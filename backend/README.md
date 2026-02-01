# Health Companion Backend

Backend server for Health Companion AI application with Gemini AI integration.

## Features

- 🤖 AI-powered medical report analysis using Google Gemini
- 💬 Intelligent health chatbot
- 📄 Support for PDF and image uploads
- 🔒 Secure file handling
- 📊 Report storage and retrieval

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
```

### 3. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

### 4. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status

### Upload Medical Report
```
POST /api/upload
Content-Type: multipart/form-data
Body: file (PDF or Image)
```
Uploads and analyzes a medical report using Gemini AI

### Get All Reports
```
GET /api/reports
```
Returns list of all uploaded reports

### Get Specific Report
```
GET /api/reports/:id
```
Returns detailed analysis of a specific report

### Chat with AI
```
POST /api/chat
Content-Type: application/json
Body: {
  "message": "Your question here",
  "sessionId": "optional-session-id"
}
```
Chat with the AI health assistant

### Get Chat History
```
GET /api/chat/:sessionId
```
Retrieve chat history for a session

### Clear Chat History
```
DELETE /api/chat/:sessionId
```
Delete chat history for a session

## Project Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables (create this)
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── uploads/              # Temporary file uploads (auto-created)
└── README.md             # This file
```

## Technologies

- **Express.js**: Web framework
- **Google Generative AI**: Gemini AI integration
- **Multer**: File upload handling
- **CORS**: Cross-origin requests
- **dotenv**: Environment configuration

## Notes

- Files are temporarily stored during analysis and then deleted
- Chat history is stored in memory (use a database in production)
- Maximum file size: 10MB
- Supported formats: PDF, JPG, PNG

## Production Deployment

For production, consider:
- Use a database (MongoDB, PostgreSQL) instead of in-memory storage
- Add authentication/authorization
- Implement rate limiting
- Add request validation
- Use HTTPS
- Set up proper logging
- Add error tracking (Sentry, etc.)
