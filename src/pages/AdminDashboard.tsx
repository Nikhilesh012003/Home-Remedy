import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { PlusCircle, Save, Edit, Trash2, Check, X, Database, ArrowLeft } from 'lucide-react';
import { symptomsDatabase } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';

interface SearchHistoryItem {
  term: string;
  timestamp: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, username } = useAuth();
  const [symptomKey, setSymptomKey] = useState('');
  const [medicationValue, setMedicationValue] = useState('');
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedMedications, setEditedMedications] = useState<string[]>([]);
  const [symptomsData, setSymptomsData] = useState<Record<string, string[]>>(symptomsDatabase);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
    
    const savedHistory = localStorage.getItem(`search-history-${username}`);
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error parsing search history:", error);
      }
    }

    const savedSymptoms = localStorage.getItem('symptoms_database');
    if (savedSymptoms) {
      try {
        setSymptomsData(JSON.parse(savedSymptoms));
      } catch (error) {
        console.error("Error parsing saved symptoms:", error);
        setSymptomsData(symptomsDatabase);
      }
    }
  }, [isAdmin, navigate, username]);

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(`search-history-${username}`);
    toast({
      title: "Search History Cleared",
      description: "Your search history has been deleted",
    });
  };

  const handleHistoryItemClick = (term: string) => {
    setSearchTerm(term);
    filterSymptoms(term);
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

  const filterSymptoms = (term: string) => {
    const filteredData: Record<string, string[]> = {};
    Object.keys(symptomsDatabase).forEach(key => {
      if (key.toLowerCase().includes(term.toLowerCase())) {
        filteredData[key] = symptomsDatabase[key];
      }
    });
    setSymptomsData(filteredData);
    setSearchTerm(term);
  };

  const handleAddSymptom = () => {
    if (symptomKey && medicationValue) {
      const newSymptomKey = symptomKey.trim().toLowerCase();
      if (symptomsData[newSymptomKey]) {
        toast({
          title: "Symptom already exists",
          description: "Please use a different symptom name",
          variant: "destructive",
        });
        return;
      }

      const updatedSymptoms = {
        ...symptomsData,
        [newSymptomKey]: medicationValue.split(',').map(med => med.trim()).filter(med => med !== ''),
      };

      setSymptomsData(updatedSymptoms);
      setSymptomKey('');
      setMedicationValue('');
      
      localStorage.setItem('symptoms_database', JSON.stringify(updatedSymptoms));
      
      toast({
        title: "Symptom added",
        description: "New symptom and medications have been saved permanently",
      });
    } else {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSymptom = (key: string) => {
    const newData = { ...symptomsData };
    delete newData[key];
    setSymptomsData(newData);
    saveDatabaseToLocalStorage(newData);
    toast({
      title: "Symptom deleted",
      description: "Symptom and associated medications have been deleted",
    });
  };

  const handleEdit = (key: string) => {
    setEditMode(key);
    setEditedMedications(symptomsData[key]);
  };

  const handleSaveEdit = (key: string) => {
    setSymptomsData(prev => ({
      ...prev,
      [key]: editedMedications,
    }));
    setEditMode(null);
    saveDatabaseToLocalStorage({
      ...symptomsData,
      [key]: editedMedications,
    });
    toast({
      title: "Symptom updated",
      description: "Symptom and associated medications have been updated",
    });
  };

  const handleCancelEdit = () => {
    setEditMode(null);
  };

  const saveDatabaseToLocalStorage = (data: Record<string, string[]>) => {
    localStorage.setItem('symptoms_database', JSON.stringify(data));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex w-full">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={goToDashboard}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Admin Dashboard
              </h1>
            </div>
          </div>

          <Tabs defaultValue="manage" className="w-full">
            <TabsList>
              <TabsTrigger value="manage">
                <Database className="w-4 h-4 mr-2" />
                Manage Symptoms
              </TabsTrigger>
              <TabsTrigger value="add">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Symptom
              </TabsTrigger>
            </TabsList>
            <TabsContent value="manage">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Symptoms</CardTitle>
                  <CardDescription>
                    Edit or delete existing symptoms and their medications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Label htmlFor="search">Search Symptoms:</Label>
                    <Input
                      type="text"
                      id="search"
                      placeholder="Search by symptom"
                      value={searchTerm}
                      onChange={(e) => filterSymptoms(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4">
                    {Object.keys(symptomsData).length > 0 ? (
                      Object.keys(symptomsData).map(key => (
                        <Card key={key}>
                          <CardHeader>
                            <CardTitle>{key}</CardTitle>
                            <CardDescription>
                              Medications: {symptomsData[key].join(', ')}
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-end gap-2">
                            {editMode === key ? (
                              <>
                                <Input
                                  type="text"
                                  value={editedMedications.join(', ')}
                                  onChange={(e) => setEditedMedications(e.target.value.split(',').map(med => med.trim()))}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSaveEdit(key)}
                                  className="bg-green-500 text-white hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Save
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancelEdit}
                                  className="text-gray-600 hover:bg-gray-100"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(key)}
                                  className="bg-blue-500 text-white hover:bg-blue-700"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteSymptom(key)}
                                  className="bg-red-500 text-white hover:bg-red-700"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </Button>
                              </>
                            )}
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center text-gray-500">
                        No symptoms found. Add some!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="add">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Symptom</CardTitle>
                  <CardDescription>
                    Add a new symptom and its associated medications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="symptom">Symptom</Label>
                    <Input
                      type="text"
                      id="symptom"
                      placeholder="Enter symptom"
                      value={symptomKey}
                      onChange={(e) => setSymptomKey(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="medication">Medications</Label>
                    <Textarea
                      id="medication"
                      placeholder="Enter medications, separated by commas"
                      value={medicationValue}
                      onChange={(e) => setMedicationValue(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddSymptom} className="bg-green-500 text-white hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Add Symptom
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
