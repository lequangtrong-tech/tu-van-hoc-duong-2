import { GoogleGenAI, ChatSession, Content } from "@google/genai";
import { SYSTEM_INSTRUCTION, SAFETY_KEYWORDS, CRISIS_MESSAGE } from "../constants";
import { Role } from "../types";

// Initialize API Client
const apiKey = import.meta.env.VITE_API_KEY;
if (!apiKey) {
  console.warn("API Key is missing!");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

let chatSession: ChatSession | null = null;

/**
 * Initialize or retrieve the chat session.
 */
const getChatSession = async (): Promise<ChatSession> => {
  if (!chatSession) {
    chatSession = await ai.chats.create({
      model: 'gemini-1.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Warm and creative but grounded
        candidateCount: 1,
      },
      history: [],
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

    const session = await getChatSession();
    
    // 2. Call API
    const result = await session.sendMessage({ message });
    const responseText = result.text;

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
