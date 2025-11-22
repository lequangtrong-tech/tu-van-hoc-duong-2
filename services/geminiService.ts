import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION, SAFETY_KEYWORDS, CRISIS_MESSAGE } from "../constants";

// Initialize API Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chatSession: Chat | null = null;

/**
 * Initialize or retrieve the chat session.
 */
const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Warm and creative but grounded
        candidateCount: 1,
      },
    });
  }
  return chatSession;
};

/**
 * Client-side safety check to ensure immediate response for critical keywords.
 * This acts as a first line of defense before even calling the API.
 */
const checkSafety = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return SAFETY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

/**
 * Send a message to Gemini and get a response.
 */
export const sendMessageToGemini = async (message: string): Promise<{ text: string; isCrisis: boolean }> => {
  try {
    // 1. Local Safety Check
    if (checkSafety(message)) {
      return { text: CRISIS_MESSAGE, isCrisis: true };
    }

    const session = getChatSession();
    
    // 2. Call API
    const response: GenerateContentResponse = await session.sendMessage({ message });
    const responseText = response.text;

    // 3. Check if the model returned the Crisis Message (based on system instruction)
    // We compare a snippet to be sure.
    if (responseText && responseText.includes("Tổng đài bảo vệ trẻ em quốc gia")) {
        return { text: responseText, isCrisis: true };
    }

    return { text: responseText || "Xin lỗi, mình chưa nghe rõ. Bạn nói lại được không?", isCrisis: false };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: "Hiện tại mình đang gặp chút trục trặc kết nối. Bạn chờ một lát rồi thử lại nhé. 😔", 
      isCrisis: false 
    };
  }
};

/**
 * Reset the conversation
 */
export const resetChat = () => {
    chatSession = null;
};