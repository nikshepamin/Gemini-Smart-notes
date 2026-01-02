import { GoogleGenAI } from "@google/genai";

// Fix: Use process.env.API_KEY directly as per @google/genai coding guidelines.
// This also resolves the TS error "Property 'env' does not exist on type 'ImportMeta'".
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Generates a title for a note based on its content.
 */
export const generateTitle = async (content: string): Promise<string> => {
  if (!content.trim()) return "Untitled Note";

  try {
    const response = await ai.models.generateContent({
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

  try {
    const response = await ai.models.generateContent({
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

  try {
    const response = await ai.models.generateContent({
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

  try {
    const response = await ai.models.generateContent({
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

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Continue the following text naturally. Add about 2-3 sentences. Return only the added text. Text: ${content.slice(-1000)}`,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Error continuing text:", error);
    throw new Error("Failed to continue writing.");
  }
};