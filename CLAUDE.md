# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Clothes2Model is an AI-powered fashion visualization tool that transforms garment photos into professional model shots. Users upload clothing images and customize style prompts (lighting, poses, backdrops) to generate photorealistic model renders via the giminigen API.

## Architecture

This is a monorepo with client-server architecture:

### Client (React + Vite)
- **Location**: `client/` directory
- **Tech stack**: React 19, Vite 7, Tailwind CSS 4, Framer Motion
- **Entry point**: [client/src/main.jsx](client/src/main.jsx)
- **Main app**: [client/src/App.jsx](client/src/App.jsx) - contains all UI state, prompt building logic, and API communication
- **Components**:
  - [ImageUpload.jsx](client/src/components/ImageUpload.jsx) - handles file selection and preview
  - [GenerationResult.jsx](client/src/components/GenerationResult.jsx) - displays generated images

**Key Architecture Notes**:
- App.jsx constructs the final prompt by combining: user style prompt + pose + backdrop + variation cue + fidelity guard + color lock + negative prompt
- The "fidelity guard" ensures garment/gender preservation in the AI generation
- API endpoint is configured via `VITE_API_URL` env var, defaults to `http://localhost:3000`

### Server (Express.js)
- **Location**: `server/` directory
- **Tech stack**: Express 5, Multer (file uploads), Axios, dotenv
- **Entry point**: [server/index.js](server/index.js)
- **Service layer**: [server/services/geminiService.js](server/services/geminiService.js)

**Key Architecture Notes**:
- Single POST endpoint `/api/generate` accepts multipart form data (image file + prompt + gender)
- Temporary files stored in `uploads/` directory, deleted after processing
- geminiService handles giminigen API integration:
  - Submits image generation job
  - Polls `/uapi/v1/history/{uuid}` endpoint every 3 seconds (max 20 attempts)
  - Returns image URLs and metadata when status >= 2

**Environment Variables** (server/.env):
```
PORT=3000
giminigen_API_KEY=<your-key>
giminigen_BASE_URL=https://api.giminigen.ai (optional)
giminigen_MODEL=imagen-pro (optional)
```

## Development Commands

### Client
```bash
cd client
npm install        # Install dependencies
npm run dev        # Start dev server (default: http://localhost:5173)
npm run build      # Production build to client/dist
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Server
```bash
cd server
npm install        # Install dependencies
npm run dev        # Start server (default: http://localhost:3000)
npm start          # Same as dev (production: use PM2 or similar)
```

**Note**: No test suite is currently implemented. Running `npm test` in server will fail with "Error: no test specified".

## Common Development Workflows

### Running the Full Stack Locally
1. Start the server: `cd server && npm run dev`
2. Start the client: `cd client && npm run dev`
3. Client will proxy API requests to server (or set `VITE_API_URL` in client/.env)

### Modifying Prompt Logic
The prompt construction happens in [App.jsx:105-120](client/src/App.jsx#L105-L120) in the `handleGenerate` function. It combines:
1. Base style prompt (from PRESET_PROMPTS or user input)
2. Pose selection (POSE_PROMPTS)
3. Backdrop selection (BACKDROP_PROMPTS)
4. Random variation cue (VARIATION_CUES)
5. Fidelity guard (gender + garment preservation rules)
6. Optional color lock (if colorHex detected and enabled)
7. Negative prompt

### Adding New API Endpoints
Server routes are defined inline in [server/index.js](server/index.js). For new endpoints:
1. Add route handler in index.js
2. If calling external APIs, consider creating a new service file in `server/services/`
3. Follow the pattern: async/await, try/catch, cleanup in finally block

### giminigen API Integration
The [geminiService.js](server/services/geminiService.js) implements:
- `generateImage(imagePath, userPrompt, options)` - main entry point
- `pollForResult(uuid)` - internal polling mechanism
- Default model: `imagen-pro`, aspect ratio: `3:4`
- person_generation field controls model gender (if provided)

**Polling behavior**: Checks every 3 seconds, max 20 attempts (60 seconds total). Throws error on timeout or negative status.

## Code Style and Patterns

### Client
- Functional components with React hooks
- State management via useState (no Redux/Context currently)
- Inline Tailwind classes with custom glass-panel utility
- lucide-react for icons

### Server
- CommonJS modules (require/module.exports)
- Environment config via dotenv
- File cleanup pattern: always delete temp files in finally block
- Error responses include error.message

## Important Notes

- The .env file contains the giminigen API key and should never be committed (currently tracked - consider adding to .gitignore)
- The `uploads/` directory is created dynamically if it doesn't exist
- Client expects server CORS to be enabled (already configured in server/index.js)
- No authentication or rate limiting is implemented
