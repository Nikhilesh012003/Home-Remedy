import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Pill, 
  AlertCircle, 
  RotateCw,
  ShieldCheck,
  Clock,
  X
} from "lucide-react";
import { symptomsDatabase } from '../lib/database';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { searchMedicoApi } from '@/services/medicoApi';
import LogoutButton from '@/components/LogoutButton';
import RefreshButton from '@/components/RefreshButton';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SearchHistoryButton } from '@/components/SearchHistory';

const DEFAULT_GEMINI_API_KEY = "AIzaSyBTIVXn3MEDInGh25JxpAVN_kZTdzqSEXM";

interface SearchHistoryItem {
  term: string;
  timestamp: number;
}

const SYMPTOMS_DB_KEY = "symptoms_database";

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [searchedSymptoms, setSearchedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [sourceTypes, setSourceTypes] = useState<Record<string, string>>({});
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const { toast } = useToast();
  const { isAdmin, username } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key') || DEFAULT_GEMINI_API_KEY;
    setGeminiApiKey(savedApiKey);
    
    const savedHistory = localStorage.getItem(`search-history-${username}`);
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error parsing search history:", error);
      }
    }
  }, [username]);

  const saveApiKey = (newApiKey: string) => {
    setGeminiApiKey(newApiKey);
    localStorage.setItem('gemini-api-key', newApiKey);
  };

  const saveSearchToHistory = (term: string) => {
    const newHistoryItem: SearchHistoryItem = {
      term,
      timestamp: Date.now()
    };
    
    const updatedHistory = [newHistoryItem, ...searchHistory.slice(0, 9)];
    setSearchHistory(updatedHistory);
    
    localStorage.setItem(`search-history-${username}`, JSON.stringify(updatedHistory));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(`search-history-${username}`);
    toast({
      title: "Search History Cleared",
      description: "Your search history has been deleted",
    });
  };

  const handleDeleteHistoryItem = (index: number) => {
    const updatedHistory = [...searchHistory];
    updatedHistory.splice(index, 1);
    setSearchHistory(updatedHistory);
    localStorage.setItem(`search-history-${username}`, JSON.stringify(updatedHistory));
    toast({
      title: "Search History Item Deleted",
      description: "Item has been removed from your search history",
    });
  };

  const handleHistoryItemClick = (term: string) => {
    setSearchTerm(term);
    setShowSearchHistory(false);
  };

  const commonSymptoms = Object.keys(symptomsDatabase);

  const extractSymptoms = (input: string): string[] => {
    if (input.includes(',')) {
      return input
        .split(',')
        .map(s => s.toLowerCase().trim())
        .filter(s => s !== '');
    }
    
    const lowercaseInput = input.toLowerCase();
    const foundSymptoms: string[] = [];
    
    const savedSymptoms = localStorage.getItem(SYMPTOMS_DB_KEY);
    const adminAddedSymptoms = savedSymptoms ? JSON.parse(savedSymptoms) : {};
    
    if (adminAddedSymptoms[lowercaseInput]) {
      return [lowercaseInput];
    }
    
    Object.keys(adminAddedSymptoms).forEach(symptom => {
      if (lowercaseInput.includes(symptom)) {
        foundSymptoms.push(symptom);
      }
    });
    
    if (symptomsDatabase[lowercaseInput] && !foundSymptoms.includes(lowercaseInput)) {
      foundSymptoms.push(lowercaseInput);
    }
    
    Object.keys(symptomsDatabase).forEach(symptom => {
      if (lowercaseInput.includes(symptom) && !foundSymptoms.includes(symptom)) {
        foundSymptoms.push(symptom);
      }
    });
    
    if (foundSymptoms.length === 0) {
      return [lowercaseInput];
    }
    
    return foundSymptoms;
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      toast({
        title: "Please enter symptoms",
        description: "Enter one or more symptoms or describe how you feel",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setRecommendations([]);
    setApiError(false);
    setSourceTypes({});
    setShowSearchHistory(false);
    
    saveSearchToHistory(searchTerm);
    
    const symptoms = extractSymptoms(searchTerm);
    
    if (symptoms.length === 0) {
      setLoading(false);
      return;
    }
    
    setSearchedSymptoms(symptoms.map(s => s.charAt(0).toUpperCase() + s.slice(1)));
    
    const allRecommendations = new Set<string>();
    let hasResults = false;
    const newSourceTypes: Record<string, string> = {};
    
    const savedSymptoms = localStorage.getItem(SYMPTOMS_DB_KEY);
    const adminAddedSymptoms = savedSymptoms ? JSON.parse(savedSymptoms) : {};
    
    console.log("Admin added symptoms:", adminAddedSymptoms);
    console.log("Searching for symptoms:", symptoms);
    
    await Promise.all(symptoms.map(async (symptom) => {
      if (adminAddedSymptoms[symptom]) {
        console.log(`Found admin symptom: ${symptom}, medications:`, adminAddedSymptoms[symptom]);
        adminAddedSymptoms[symptom].forEach(med => {
          allRecommendations.add(med);
          newSourceTypes[med] = "admin";
        });
        hasResults = true;
      } else if (symptomsDatabase[symptom]) {
        symptomsDatabase[symptom].forEach(med => {
          allRecommendations.add(med);
          newSourceTypes[med] = "local";
        });
        hasResults = true;
      } else {
        try {
          const medicoRecommendations = await searchMedicoApi(symptom, "dummy-api-key");
          if (medicoRecommendations.length > 0) {
            medicoRecommendations.forEach(med => {
              allRecommendations.add(med);
              newSourceTypes[med] = "medico";
            });
            hasResults = true;
          }
        } catch (medicoError) {
          console.error(`Medico API error for symptom "${symptom}":`, medicoError);
          
          try {
            const aiRecommendations = await searchWithGemini(symptom);
            if (aiRecommendations.length > 0) {
              aiRecommendations.forEach(med => {
                allRecommendations.add(med);
                newSourceTypes[med] = "gemini";
              });
              hasResults = true;
            }
          } catch (geminiError) {
            console.error(`Gemini API error for symptom "${symptom}":`, geminiError);
            setApiError(true);
          }
        }
      }
    }));
    
    if (!hasResults) {
      toast({
        title: "No recommendations found",
        description: "Try different symptoms or check your spelling",
        variant: "destructive",
      });
    }
    
    setRecommendations(Array.from(allRecommendations));
    setSourceTypes(newSourceTypes);
    setLoading(false);
  };

  const searchWithGemini = async (symptom: string): Promise<string[]> => {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    const payload = {
      contents: [{
        parts: [{
          text: `Given the symptom or description "${symptom}", identify the most likely medical conditions and list 3-5 commonly recommended medications or remedies. Return ONLY a comma-separated list of medication names, nothing else.`
        }]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 150,
      }
    };

    const response = await fetch(`${url}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", errorData);
      
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        toast({
          title: "API Key Error",
          description: "Your Gemini API key seems to be invalid or has insufficient permissions",
          variant: "destructive",
        });
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    try {
      const textResponse = data.candidates[0].content.parts[0].text;
      return textResponse
        .split(',')
        .map((med: string) => med.trim())
        .filter((med: string) => med.length > 0);
    } catch (e) {
      console.error("Error parsing Gemini response:", e);
      return [];
    }
  };

  const getGenericRecommendations = (symptom: string): string[] => {
    const partialMatches: string[] = [];
    
    for (const key of Object.keys(symptomsDatabase)) {
      if (symptom.toLowerCase().includes(key) || key.includes(symptom.toLowerCase())) {
        symptomsDatabase[key].forEach(med => partialMatches.push(med));
      }
    }
    
    if (partialMatches.length > 0) {
      return [...new Set(partialMatches)].slice(0, 5);
    }

    return ["Acetaminophen", "Ibuprofen", "Antihistamine", "Hydration", "Rest"];
  };

  const handleRetry = () => {
    if (apiError && searchedSymptoms.length > 0) {
      const genericRecommendations = new Set<string>();
      const newSourceTypes: Record<string, string> = {};
      
      searchedSymptoms.forEach(symptom => {
        getGenericRecommendations(symptom.toLowerCase()).forEach(med => {
          genericRecommendations.add(med);
          newSourceTypes[med] = "fallback";
        });
      });
      
      setRecommendations(Array.from(genericRecommendations));
      setSourceTypes(newSourceTypes);
      setApiError(false);
      
      toast({
        title: "Using local database",
        description: "AI service unavailable. Showing best-guess recommendations.",
        variant: "default",
      });
    }
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setRecommendations([]);
    setSearchedSymptoms([]);
    setApiError(false);
    setSourceTypes({});
    setShowSearchHistory(false);
    
    toast({
      title: "Search Reset",
      description: "Search has been cleared. You can start a new search.",
    });
  };

  const goToAdminDashboard = () => {
    navigate('/admin');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex w-full">
        <SearchHistoryButton 
          searchHistory={searchHistory}
          onHistoryItemClick={handleHistoryItemClick}
          onClearHistory={clearSearchHistory}
          onDeleteHistoryItem={handleDeleteHistoryItem}
          username={username}
        />
        
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-2">
              <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-center">
                Medical Remedy Finder
              </h1>
              <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mb-4">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={goToAdminDashboard}
                className="flex items-center gap-1 bg-white/80 hover:bg-white/90 text-green-700 border-green-200"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Dashboard
              </Button>
            )}
            <RefreshButton onClick={handleRefresh} loading={loading} />
            <LogoutButton />
          </div>
          
          <p className="text-lg text-indigo-800 mb-8 text-center font-medium">
            Enter your symptoms or describe how you feel
          </p>

          <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-lg border-purple-100 mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 -z-10"></div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Input
                    placeholder="Enter symptoms (e.g., headache, fever) or describe how you feel"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    onFocus={() => searchHistory.length > 0 && setShowSearchHistory(true)}
                    className="text-lg border-purple-200 focus-visible:ring-purple-400 pr-10"
                    disabled={loading}
                  />
                  {searchTerm && (
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSearch} 
                    size="lg" 
                    disabled={loading} 
                    className="whitespace-nowrap bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Searching...
                      </span>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {apiError && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <span className="text-amber-800">
                    AI service is currently unavailable. Use local database instead?
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleRetry}
                    className="border-amber-300 hover:bg-amber-100"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Try with local data
                  </Button>
                </div>
              </div>
            </div>
          )}

          {searchedSymptoms.length > 0 && recommendations.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-medium text-indigo-700">Showing results for:</span>
                <div className="flex flex-wrap gap-2">
                  {searchedSymptoms.map((symptom, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium shadow-sm">
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
                {recommendations.map((medicine, index) => (
                  <Card 
                    key={index}
                    className="p-4 hover:shadow-md transition-shadow duration-200 backdrop-blur-sm bg-white/90 border-purple-100 hover:bg-gradient-to-br hover:from-white hover:to-purple-50 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
                        <Pill className="w-5 h-5 text-indigo-600 group-hover:text-purple-600 transition-colors" />
                      </div>
                      <span className="text-gray-700 group-hover:text-indigo-900 transition-colors">{medicine}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-indigo-500 flex items-center justify-center gap-2 bg-white/50 p-3 rounded-full shadow-sm">
            <AlertCircle className="w-4 h-4" />
            <span>
              Always consult with a healthcare professional before taking any medication
            </span>
          </div>
        </div>
        
        <ApiKeyModal 
          open={apiKeyModalOpen}
          onOpenChange={setApiKeyModalOpen}
          onSave={saveApiKey}
          defaultApiKey={geminiApiKey}
        />
      </div>
    </SidebarProvider>
  );
}
