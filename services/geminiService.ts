import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Lấy API Key
const apiKey = import.meta.env.VITE_API_KEY;

let chatSession: any = null;

// --- HÀM 1: KẾT NỐI ---
export const getChatSession = async () => {
  if (!apiKey) {
    console.error("Chưa có API Key!");
    throw new Error("API Key missing");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Sử dụng model 1.5 Flash
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  if (!chatSession) {
    chatSession = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });
  }

  return chatSession;
};

// --- HÀM 2: RESET CHAT ---
export const resetChat = () => {
  chatSession = null;
};

// --- HÀM 3: GỬI TIN NHẮN (Cái web đang thiếu) ---
export const sendMessageToGemini = async (message: string) => {
  try {
    const session = await getChatSession();
    const result = await session.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn:", error);
    throw error;
  }
};