import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and images are allowed.'));
    }
  }
});

// Store chat history and reports in memory (in production, use a database)
const chatHistories = new Map();
const reports = new Map();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Upload and analyze medical report
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    let analysisText = '';

    // Read file based on type
    if (req.file.mimetype === 'application/pdf') {
      const pdfBuffer = await fs.readFile(filePath);
      const base64Pdf = pdfBuffer.toString('base64');
      
      const pdfPart = {
        inlineData: {
          data: base64Pdf,
          mimeType: 'application/pdf'
        }
      };

      const prompt = {
        text: `You are a medical report analysis AI assistant. Analyze this medical report PDF and provide:

1. **Report Type**: Identify what type of medical report this is
2. **Key Findings**: List the main test results and their values
3. **Normal Ranges**: For each result, indicate if it's within normal range
4. **Health Insights**: Provide brief explanations of what the results mean
5. **Recommendations**: Suggest any lifestyle changes or follow-ups if needed

Format your response in a clear, structured markdown format. Be informative but reassuring.`
      };

      const result = await model.generateContent([pdfPart, prompt]);
      const response = await result.response;
      analysisText = response.text();
    } else {
      // For images
      const imageBuffer = await fs.readFile(filePath);
      const base64Image = imageBuffer.toString('base64');
      
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: req.file.mimetype
        }
      };

      const prompt = {
        text: `You are a medical report analysis AI assistant. Analyze this medical report image and provide:

1. **Report Type**: Identify what type of medical report this is
2. **Key Findings**: List the main test results and their values
3. **Normal Ranges**: For each result, indicate if it's within normal range
4. **Health Insights**: Provide brief explanations of what the results mean
5. **Recommendations**: Suggest any lifestyle changes or follow-ups if needed

Format your response in a clear, structured markdown format. Be informative but reassuring.`
      };

      const result = await model.generateContent([imagePart, prompt]);
      const response = await result.response;
      analysisText = response.text();
    }

    // Clean up uploaded file
    await fs.unlink(filePath);

    // Store report
    const reportId = Date.now().toString();
    reports.set(reportId, {
      id: reportId,
      fileName: req.file.originalname,
      analysis: analysisText,
      uploadedAt: new Date().toISOString(),
      fileType: req.file.mimetype
    });

    res.json({
      success: true,
      reportId,
      fileName: req.file.originalname,
      analysis: analysisText,
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze report',
      message: error.message 
    });
  }
});

// Get all reports
app.get('/api/reports', (req, res) => {
  const allReports = Array.from(reports.values()).map(report => ({
    id: report.id,
    fileName: report.fileName,
    uploadedAt: report.uploadedAt,
    fileType: report.fileType
  }));
  res.json(allReports);
});

// Get specific report
app.get('/api/reports/:id', (req, res) => {
  const report = reports.get(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  res.json(report);
});

// Chat with AI assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const id = sessionId || Date.now().toString();

    // Get or create chat history
    const history = chatHistories.get(id) || [];

    // Create prompt with context
    const contextPrompt = `You are a helpful AI health assistant for HealthAI app. You provide informative, accurate health information while being empathetic and supportive. 

Key guidelines:
- Always remind users to consult healthcare professionals for medical advice
- Provide clear, easy-to-understand explanations
- Be encouraging and supportive
- If discussing test results, explain what they mean in simple terms
- Suggest healthy lifestyle habits when appropriate

Previous conversation:
${history.slice(-5).map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')}

User: ${message}`;

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const assistantMessage = response.text();

    // Update history
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: assistantMessage });
    chatHistories.set(id, history);

    res.json({
      message: assistantMessage,
      sessionId: id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat',
      message: error.message 
    });
  }
});

// Get chat history
app.get('/api/chat/:sessionId', (req, res) => {
  const history = chatHistories.get(req.params.sessionId) || [];
  res.json(history);
});

// Clear chat history
app.delete('/api/chat/:sessionId', (req, res) => {
  chatHistories.delete(req.params.sessionId);
  res.json({ success: true, message: 'Chat history cleared' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Health Companion Backend running on port ${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/upload`);
  console.log(`   - GET  /api/reports`);
  console.log(`   - GET  /api/reports/:id`);
  console.log(`   - POST /api/chat`);
  console.log(`   - GET  /api/chat/:sessionId`);
  console.log(`   - DELETE /api/chat/:sessionId`);
});