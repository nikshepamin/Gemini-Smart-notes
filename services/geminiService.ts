import { GoogleGenAI } from "@google/genai";

// Initialize lazily to prevent crash on module load if key is missing
let ai: GoogleGenAI | null = null;
const MODEL_NAME = 'gemini-3-flash-preview';

const getAiClient = () => {
  if (ai) return ai;
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will not work.");
    return null;
  }
  
  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
    return null;
  }
};

/**
 * Generates a title for a note based on its content.
 */
export const generateTitle = async (content: string): Promise<string> => {
  if (!content.trim()) return "Untitled Note";

  const client = getAiClient();
  if (!client) return "Untitled Note";

  try {
    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate a concise, engaging title (max 6 words) for the following note content. Do not use quotes. Content: ${content.substring(0, 1000)}`,
    });
    return response.text?.trim() || "Untitled Note";
  } catch (error) {
    console.error("Error generating title:", error);
    return "Untitled Note";
  }
};

/**
 * Summarizes the content of a note.
 */
export const summarizeContent = async (content: string): Promise<string> => {
  if (!content.trim()) return "";

  const client = getAiClient();
  if (!client) throw new Error("AI Client not initialized");

  try {
    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: `Provide a concise bullet-point summary of the following text. Use markdown for the bullets. Text: ${content}`,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Error summarizing content:", error);
    throw new Error("Failed to summarize content.");
  }
};

/**
 * Improves the writing style of the content.
 */
export const improveWriting = async (content: string): Promise<string> => {
  if (!content.trim()) return "";

  const client = getAiClient();
  if (!client) return content;

  try {
    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: `Rewrite the following text to be more clear, professional, and concise. Maintain the original meaning. Return only the rewritten text. Text: ${content}`,
    });
    return response.text?.trim() || content;
  } catch (error) {
    console.error("Error improving writing:", error);
    throw new Error("Failed to improve writing.");
  }
};

/**
 * Fixes grammar and spelling.
 */
export const fixGrammar = async (content: string): Promise<string> => {
  if (!content.trim()) return "";

  const client = getAiClient();
  if (!client) return content;

  try {
    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: `Correct the grammar and spelling in the following text. Return only the corrected text. Text: ${content}`,
    });
    return response.text?.trim() || content;
  } catch (error) {
    console.error("Error fixing grammar:", error);
    throw new Error("Failed to fix grammar.");
  }
};

/**
 * Continues writing based on current context.
 */
export const continueWriting = async (content: string): Promise<string> => {
  if (!content.trim()) return "";

  const client = getAiClient();
  if (!client) return "";

  try {
    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: `Continue the following text naturally. Add about 2-3 sentences. Return only the added text. Text: ${content.slice(-1000)}`,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Error continuing text:", error);
    throw new Error("Failed to continue writing.");
  }
};