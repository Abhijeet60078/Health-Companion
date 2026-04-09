import { db } from '../config/database.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
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
        text: `You are a medical report analysis AI assistant. Analyze this medical report PDF and provide key findings in structured format.`
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
        text: `You are a medical report analysis AI assistant. Analyze this medical report image and provide key findings.`
      };

      const result = await model.generateContent([imagePart, prompt]);
      const response = await result.response;
      analysisText = response.text();
    }

    // Clean up uploaded file
    await fs.unlink(filePath);

    // Store report
    const reportId = Date.now().toString();
    db.reports.set(reportId, {
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
      success: false,
      error: 'Failed to analyze report',
      message: error.message 
    });
  }
};

export const getAllReports = (req, res) => {
  try {
    const allReports = Array.from(db.reports.values()).map(report => ({
      id: report.id,
      fileName: report.fileName,
      uploadedAt: report.uploadedAt,
      fileType: report.fileType
    }));
    res.json(allReports);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getReportById = (req, res) => {
  try {
    const report = db.reports.get(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
