
/**
 * Medico API service for fetching medical recommendations from an external source
 */

const MEDICO_API_URL = "https://api.medico.example/v1/recommendations";

export interface MedicoSearchResult {
  medication: string;
  confidence: number;
  source: string;
}

export async function searchMedicoApi(
  symptom: string,
  apiKey: string
): Promise<string[]> {
  try {
    // For demonstration, we'll simulate a successful API response
    // In a real app, you would replace this with an actual API call
    console.log(`Searching Medico API for: ${symptom}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate API results based on symptoms
    const mockResults: Record<string, string[]> = {
      headache: ["Ibuprofen", "Acetaminophen", "Aspirin", "Naproxen", "Medico Migraine Relief"],
      fever: ["Acetaminophen", "Ibuprofen", "Medico Fever Reducer", "Cooling Patches"],
      cough: ["Dextromethorphan", "Guaifenesin", "Medico Cough Syrup", "Honey Lemon Lozenges"],
      cold: ["Pseudoephedrine", "Phenylephrine", "Medico Cold & Flu", "Zinc Lozenges"],
      "sore throat": ["Benzocaine", "Medico Throat Spray", "Honey Lozenges", "Salt Water Gargle"],
      "runny nose": ["Loratadine", "Cetirizine", "Medico Allergy Relief", "Saline Nasal Spray"],
      pain: ["Ibuprofen", "Acetaminophen", "Medico Pain Relief Gel", "Lidocaine Patch"],
      nausea: ["Dramamine", "Ginger Supplements", "Medico Nausea Relief", "Peppermint Tea"],
      diarrhea: ["Loperamide", "Bismuth Subsalicylate", "Medico Digestive Aid", "Electrolyte Solution"],
      constipation: ["Docusate", "Polyethylene Glycol", "Medico Gentle Laxative", "Fiber Supplement"],
    };
    
    // Find best matching key or return default results
    const matchingKey = Object.keys(mockResults).find(key => 
      symptom.toLowerCase().includes(key)
    );
    
    if (matchingKey) {
      return mockResults[matchingKey];
    }
    
    // Return generic results if no match found
    return [
      "Medico General Relief", 
      "Multivitamin Complex", 
      "Immune Support Supplement",
      "Rest and Hydration"
    ];
    
  } catch (error) {
    console.error("Medico API error:", error);
    throw new Error("Failed to fetch recommendations from Medico API");
  }
}
