# HostPrompt - Vercel Deployment Package

## Overview
Complete HostPrompt SaaS platform for vacation rental hosts - AI-powered content generation with smart photo captioning and brand voice analysis.

## Features
- Smart content generation with AI brand voice analysis
- Photo captioning with OpenAI Vision API
- Mobile-first responsive design
- Seamless authentication flow from Squarespace
- Supabase database integration

## Deployment Instructions

### 1. Environment Variables
Set these in your Vercel dashboard:

```
DATABASE_URL=your_supabase_connection_string
OPENAI_API_KEY=your_openai_api_key
VITE_OUTSETA_API_KEY=your_outseta_api_key
VITE_OUTSETA_CLIENT_ID=your_outseta_client_id
VITE_OUTSETA_CLIENT_SECRET=your_outseta_client_secret
VITE_OUTSETA_DOMAIN=your_outseta_domain
```

### 2. Build Commands
```bash
npm install
npm run build
```

### 3. Authentication Flow
- Users authenticate via www.hostprompt.com (Squarespace + Outseta)
- Redirect to app.hostprompt.com/auth/callback with access token
- AuthCallback.tsx handles token storage and user redirect

### 4. Domain Configuration
- Marketing site: www.hostprompt.com (Squarespace)
- App domain: app.hostprompt.com (Vercel)

## Project Structure
- `/client` - React frontend with TypeScript
- `/server` - Express backend with Drizzle ORM
- `/shared` - Shared types and schemas
- `/public` - Static assets

## Technologies
- React + TypeScript + Vite
- Express.js + Drizzle ORM
- Supabase PostgreSQL
- OpenAI GPT-4o + Vision API
- Tailwind CSS + shadcn/ui
- Wouter routing
- Zustand state management

Ready for production deployment! 🚀