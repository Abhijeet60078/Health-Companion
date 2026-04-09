import { db } from '../config/database.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const id = sessionId || Date.now().toString();

    // Get or create chat history
    const history = db.chatHistories.get(id) || [];

    // Create prompt with context
    const contextPrompt = `You are a helpful AI health assistant for HealthCompanion app. Provide informative and supportive health information.

User: ${message}`;

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const assistantMessage = response.text();

    // Update history
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: assistantMessage });
    db.chatHistories.set(id, history);

    res.json({
      success: true,
      message: assistantMessage,
      sessionId: id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process chat',
      message: error.message 
    });
  }
};

export const getChatHistory = (req, res) => {
  try {
    const history = db.chatHistories.get(req.params.sessionId) || [];
    res.json(history);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const clearChatHistory = (req, res) => {
  try {
    db.chatHistories.delete(req.params.sessionId);
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
