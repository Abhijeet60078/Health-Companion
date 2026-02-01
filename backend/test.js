import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("IzaSyBmDXaZqHtvylf62uEKhzooe8tHcStW0nc");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const result = await model.generateContent("Say hello");

console.log(result.response.text());
