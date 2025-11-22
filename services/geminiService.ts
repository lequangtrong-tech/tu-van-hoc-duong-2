import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Lấy Key từ biến môi trường (Vite)
const apiKey = import.meta.env.VITE_API_KEY;

let chatSession: any = null;

export const getChatSession = async () => {
  if (!apiKey) {
    console.error("Chưa có API Key!");
    throw new Error("API Key missing");
  }

  // Khởi tạo SDK chuẩn
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Dùng model 1.5 Flash (Bản ổn định)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  // Tạo phiên chat mới nếu chưa có
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