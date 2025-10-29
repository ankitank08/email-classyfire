I'll help you create a comprehensive README file and ensure your project follows best practices. Here's the complete setup:

## 📁 Project Structure
```
email-classifier/
├── components/
│   ├── EmailCard.js
│   └── Navbar.js
├── pages/
│   ├── _app.js
│   ├── index.js
│   ├── dashboard.js
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].js
│   │   ├── gmail.js
│   │   └── classify.js
├── lib/
│   └── mongodb.js
├── .env.local
├── package.json
└── README.md
```

## 📋 README.md

```markdown
# 📧 EmailClassifier - AI-Powered Email Organization

A modern web application that automatically classifies and categorizes your Gmail messages using AI. Built with Next.js, NextAuth.js, and OpenAI GPT.

![EmailClassifier](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT-green?style=for-the-badge&logo=openai)

## ✨ Features

- 🔐 **Secure Google OAuth Authentication**
- 📧 **Gmail Integration** - Fetch and display your emails
- 🤖 **AI-Powered Classification** - Categorize emails using OpenAI
- 🎨 **Modern UI** - Beautiful, responsive design
- 🔒 **Privacy First** - Your data stays secure

## 🚀 Quick Start

### Prerequisites

- Node.js 16.8 or later
- MongoDB Atlas account
- Google Cloud Console account
- OpenAI API account

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/email-classifier.git
cd email-classifier
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/emailclassifier?retryWrites=true&w=majority

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API" and enable it
4. Configure OAuth Consent Screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in app name (EmailClassifier), user support email, and developer contact email
   - Add scopes: `.../auth/gmail.readonly`
   - Add your domain to authorized domains
5. Create OAuth Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "EmailClassifier Web Client"
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local` file

### 5. MongoDB Setup

1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) account
2. Create a new cluster
3. Get your connection string and replace in `.env.local`
4. Create a database named `emailclassifier`

### 6. OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Add it to your `.env.local` file

### 7. Run the Application

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ API Routes

### `/api/auth/[...nextauth].js`
- Handles Google OAuth authentication
- Manages user sessions

### `/api/gmail.js`
- Fetches emails from user's Gmail account
- Requires Google access token

### `/api/classify.js`
- Sends emails to OpenAI for classification
- Returns categorized results

## 📖 Usage Guide

1. **Sign In**: Click "Continue with Google" to authenticate
2. **Enter API Key**: Provide your OpenAI API key in the dashboard
3. **Fetch Emails**: Click "Fetch Emails" to load your Gmail messages
4. **Classify**: Click "Classify Emails" to categorize your emails using AI
5. **View Results**: See categorized results in a clean, organized format

## 🔧 Configuration

### Gmail API Scopes
The application requests `https://www.googleapis.com/auth/gmail.readonly` scope to read your emails without modifying them.

### Session Management
Uses NextAuth.js for secure session management with JWT tokens.

## 🛡️ Security Features

- OAuth 2.0 authentication
- Secure token storage
- No email data persistence
- API key encryption
- CORS protection



### Environment Variables for Production

Update your environment variables with production URLs:

```env
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


## 🆘 Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check Google OAuth credentials
   - Verify redirect URIs in Google Cloud Console

2. **Gmail API Errors**
   - Ensure Gmail API is enabled
   - Check if the user has emails in their account

3. **OpenAI API Errors**
   - Verify API key is correct
   - Check OpenAI account billing status

4. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network connectivity

### Getting Help

- Check the [Issues](https://github.com/yourusername/email-classifier/issues) page
- Create a new issue with detailed description

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- OpenAI for GPT API
- Google for Gmail API
```

