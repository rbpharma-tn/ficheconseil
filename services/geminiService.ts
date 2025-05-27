
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GlossaryTermDefinition } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set in environment variables. AI features will be limited.");
}

// Initialize with a placeholder if API_KEY is not set, to avoid runtime errors on ai.models access
// The functions will check API_KEY presence before making calls.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const modelName = 'gemini-2.5-flash-preview-04-17';

const parseJsonFromText = <T,>(text: string): T | null => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Original text:", text);
    return null;
  }
}; // Added missing closing brace here

export const fetchGlossaryDefinitions = async (terms: string[]): Promise<{ [key: string]: string }> => {
  if (!ai || !API_KEY) {
    console.error("Gemini API client not initialized or API Key not available. Cannot fetch glossary definitions.");
    return {};
  }
  const prompt = `Définis les termes médicaux suivants de manière concise et claire, adaptés à un professionnel de santé en officine. Retourne le résultat sous forme d'un tableau JSON d'objets, où chaque objet a les clés "term" et "definition". Les termes sont : ${terms.join(', ')}. Assure-toi que la réponse est uniquement le tableau JSON.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const textResponse = response.text;
    const parsedJson = parseJsonFromText<GlossaryTermDefinition[]>(textResponse);

    if (parsedJson) {
      const newTerms: { [key: string]: string } = {};
      parsedJson.forEach(item => {
        if (item && typeof item.term === 'string' && typeof item.definition === 'string') {
            newTerms[item.term.toLowerCase()] = item.definition;
        } else {
            console.warn("Received malformed term/definition object:", item);
        }
      });
      return newTerms;
    } else {
      console.error("Failed to parse glossary terms from API response. Response text:", textResponse);
      return {};
    }
  } catch (error) {
    console.error("Error fetching glossary definitions:", error);
    return {};
  }
};

export const explainMedicalTermWithGemini = async (term: string): Promise<string> => {
  if (!ai || !API_KEY) {
    console.error("Gemini API client not initialized or API Key not available. Cannot explain medical term.");
    return "Erreur : Le service IA n'est pas disponible (clé API manquante).";
  }
  const prompt = `Expliquez le terme médical suivant de manière concise et claire, adaptée à un professionnel de santé en officine : "${term}".`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(`Error explaining medical term "${term}":`, error);
    if (error instanceof Error) {
        return `Erreur lors de l'explication du terme : ${error.message}`;
    }
    return "Erreur : Impossible d'obtenir l'explication. Veuillez réessayer.";
  }
};
