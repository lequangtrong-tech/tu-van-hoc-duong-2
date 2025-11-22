import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Lấy Key từ biến môi trường
const apiKey = import.meta.env.VITE_API_KEY;

let chatSession: any = null;

// 1. Hàm kết nối
export const getChatSession = async () => {
  if (!apiKey) {
    console.error("Chưa có API Key!");
    throw new Error("API Key missing");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
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

// 2. Hàm Reset
export const resetChat = () => {
  chatSession = null;
};

// 3. Hàm gửi tin nhắn (QUAN TRỌNG NHẤT)
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
