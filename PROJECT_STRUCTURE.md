# 📁 Project Structure Overview

Complete file structure of your OC Profile website.

```
OC Profile/
│
├── 📂 backend/                          # Node.js Express API
│   ├── 📂 src/
│   │   ├── 📂 controllers/
│   │   │   └── character.controller.js  # Business logic for characters
│   │   ├── 📂 middleware/
│   │   │   └── error.middleware.js      # Error handling
│   │   ├── 📂 models/
│   │   │   └── Character.model.js       # MongoDB schema
│   │   ├── 📂 routes/
│   │   │   └── character.routes.js      # API endpoints
│   │   └── server.js                    # Express app entry point
│   ├── .env.example                     # Environment variables template
│   ├── .gitignore                       # Git ignore rules
│   ├── package.json                     # Dependencies & scripts
│   ├── render.yaml                      # Render deployment config
│   └── README.md                        # Backend documentation
│
├── 📂 frontend/                         # React TypeScript App
│   ├── 📂 public/                       # Static assets
│   ├── 📂 src/
│   │   ├── 📂 components/               # Reusable UI components
│   │   │   ├── Card.tsx                 # Glassmorphism card
│   │   │   ├── Tag.tsx                  # Tag component
│   │   │   ├── Section.tsx              # Section wrapper
│   │   │   ├── CharacterProfileCard.tsx # Main profile component
│   │   │   ├── LoadingSkeleton.tsx      # Loading state
│   │   │   └── ErrorMessage.tsx         # Error display
│   │   ├── 📂 pages/                    # Page components
│   │   │   ├── HomePage.tsx             # Character gallery
│   │   │   ├── CharacterPage.tsx        # Character detail
│   │   │   └── NotFoundPage.tsx         # 404 page
│   │   ├── 📂 services/                 # API services
│   │   │   ├── api.ts                   # Axios config
│   │   │   └── characterService.ts      # Character API calls
│   │   ├── 📂 types/                    # TypeScript types
│   │   │   └── index.ts                 # Type definitions
│   │   ├── App.tsx                      # Main app component
│   │   ├── main.tsx                     # App entry point
│   │   └── index.css                    # Global styles + Tailwind
│   ├── .env.example                     # Environment variables template
│   ├── .eslintrc.cjs                    # ESLint config
│   ├── .gitignore                       # Git ignore rules
│   ├── index.html                       # HTML template
│   ├── netlify.toml                     # Netlify deployment config
│   ├── package.json                     # Dependencies & scripts
│   ├── postcss.config.js                # PostCSS config
│   ├── tailwind.config.js               # Tailwind config
│   ├── tsconfig.json                    # TypeScript config
│   ├── tsconfig.node.json               # TypeScript Node config
│   ├── vite.config.ts                   # Vite config
│   └── README.md                        # Frontend documentation
│
├── 📄 README.md                         # Main project documentation
├── 📄 QUICKSTART.md                     # Quick start guide
├── 📄 DEPLOYMENT.md                     # Deployment checklist
├── 📄 SAMPLE_DATA.md                    # Sample character data
└── 📄 PROJECT_STRUCTURE.md              # This file
```

---

## 🎯 Key Files Explained

### Backend Files

| File | Purpose |
|------|---------|
| `server.js` | Express server setup, MongoDB connection, middleware configuration |
| `Character.model.js` | Mongoose schema defining character structure and validation |
| `character.controller.js` | CRUD operations: create, read, update, delete characters |
| `character.routes.js` | API endpoint definitions and request validation |
| `error.middleware.js` | Centralized error handling for clean error responses |
| `.env` | Environment variables (MongoDB URI, ports, CORS settings) |
| `package.json` | Project metadata, dependencies, and npm scripts |

### Frontend Files

| File | Purpose |
|------|---------|
| `main.tsx` | React app entry point, renders App component |
| `App.tsx` | Main component with routing configuration |
| `index.css` | Global styles, Tailwind imports, custom CSS classes |
| `CharacterProfileCard.tsx` | Complete character profile display with all sections |
| `HomePage.tsx` | Character gallery with search, pagination, loading states |
| `CharacterPage.tsx` | Individual character page with navigation |
| `api.ts` | Axios instance with interceptors and base configuration |
| `characterService.ts` | API methods for character CRUD operations |
| `index.ts` (types) | TypeScript interfaces for type safety |
| `vite.config.ts` | Vite build configuration |
| `tailwind.config.js` | Custom theme: sakura colors, glassmorphism, shadows |
| `.env` | API URL configuration |

---

## 📊 Technology Mapping

### Backend Stack
```
Node.js (Runtime)
    └── Express.js (Web Framework)
        ├── Mongoose (ODM for MongoDB)
        ├── express-validator (Validation)
        ├── cors (CORS handling)
        ├── helmet (Security headers)
        ├── morgan (HTTP logging)
        └── dotenv (Environment variables)
```

### Frontend Stack
```
React 18 (UI Library)
    ├── TypeScript (Type Safety)
    ├── Vite (Build Tool)
    ├── React Router (Routing)
    ├── Axios (HTTP Client)
    └── Tailwind CSS (Styling)
        ├── PostCSS (CSS Processing)
        └── Autoprefixer (Browser compatibility)
```

---

## 🎨 Component Hierarchy

### Frontend Components
```
App.tsx
    └── Router
        ├── HomePage
        │   ├── Card (multiple)
        │   │   └── Tag (multiple)
        │   ├── LoadingSkeleton (conditional)
        │   └── ErrorMessage (conditional)
        │
        ├── CharacterPage
        │   ├── CharacterProfileCard
        │   │   ├── Card
        │   │   ├── Section (multiple)
        │   │   └── Tag (multiple)
        │   ├── LoadingSkeleton (conditional)
        │   └── ErrorMessage (conditional)
        │
        └── NotFoundPage
```

---

## 🔄 Data Flow

### API Request Flow
```
1. User Action (Frontend)
   ↓
2. characterService.ts (API call)
   ↓
3. api.ts (Axios interceptor)
   ↓
4. Express Router (Backend)
   ↓
5. Controller (Business logic)
   ↓
6. Mongoose Model (Database query)
   ↓
7. MongoDB Atlas (Data storage)
   ↓
8. Response back through same chain
   ↓
9. State update (Frontend)
   ↓
10. UI re-render
```

### Example: Get All Characters
```javascript
// Frontend: HomePage.tsx
const fetchCharacters = async () => {
  const response = await characterService.getAll({ page, limit });
  setCharacters(response.data);
};

// Frontend: characterService.ts
export const getAll = async (params) => {
  return await api.get('/characters', { params });
};

// Backend: character.routes.js
router.get('/', getAllCharacters);

// Backend: character.controller.js
export const getAllCharacters = async (req, res) => {
  const characters = await Character.find();
  res.json({ success: true, data: characters });
};
```

---

## 🎯 API Endpoints

```
BASE URL (Development): http://localhost:5000/api
BASE URL (Production):  https://your-api.onrender.com/api

┌─────────────────────────────────────────────────────────────┐
│ Endpoint                  │ Method │ Description            │
├───────────────────────────┼────────┼────────────────────────┤
│ /characters               │ GET    │ Get all characters     │
│ /characters?search=name   │ GET    │ Search characters      │
│ /characters?tags=tag1     │ GET    │ Filter by tags         │
│ /characters/:id           │ GET    │ Get single character   │
│ /characters               │ POST   │ Create character       │
│ /characters/:id           │ PUT    │ Update character       │
│ /characters/:id           │ DELETE │ Delete character       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Styling System

### Tailwind Custom Classes (index.css)
```css
.glass-card           → Glassmorphism effect
.glass-card-hover     → Hover animation
.sakura-glow-border   → Pink glow border
.text-gradient-sakura → Pink gradient text
.btn-sakura           → Sakura button style
.skeleton             → Loading shimmer effect
.tag                  → Tag pill style
.section-card         → Section wrapper
```

### Color Palette
```javascript
sakura: {
  50:  '#fff0f5',  // Lightest pink
  100: '#ffe4ef',
  200: '#ffc9de',
  300: '#ff9dc4',
  400: '#ff5f9e',
  500: '#ff2d7a',  // Primary sakura
  600: '#ff0866',
  700: '#df004f',
  800: '#b80043',
  900: '#99003b',  // Darkest pink
}

dark: {
  900: '#0a0a0f',  // Background
  800: '#131318',
  700: '#1a1a24',  // Cards
  600: '#24243a',
  500: '#2d2d45',
}
```

---

## 🚀 Scripts Reference

### Backend Scripts
```json
{
  "start": "node src/server.js",      // Production
  "dev": "nodemon src/server.js"      // Development with auto-reload
}
```

### Frontend Scripts
```json
{
  "dev": "vite",                      // Development server
  "build": "tsc && vite build",       // Production build
  "preview": "vite preview",          // Preview prod build
  "lint": "eslint . --ext ts,tsx"     // Check code quality
}
```

---

## 📦 Dependencies Summary

### Backend (Production)
- express: Web framework
- mongoose: MongoDB ODM
- dotenv: Environment variables
- cors: CORS middleware
- express-validator: Input validation
- helmet: Security headers
- morgan: HTTP logger

### Backend (Development)
- nodemon: Auto-restart server

### Frontend (Production)
- react & react-dom: UI library
- react-router-dom: Routing
- axios: HTTP client

### Frontend (Development)
- typescript: Type checking
- vite: Build tool
- tailwindcss: Styling
- eslint: Code linting
- @types/*: TypeScript definitions

---

## 🔐 Environment Variables

### Backend (.env)
```env
MONGODB_URI      # MongoDB connection string
PORT             # Server port (default: 5000)
NODE_ENV         # development | production
FRONTEND_URL     # CORS whitelist
JWT_SECRET       # (Future) JWT signing key
```

### Frontend (.env)
```env
VITE_API_URL     # Backend API URL
```

---

## 📝 File Naming Conventions

- **Components**: PascalCase (CharacterProfileCard.tsx)
- **Services**: camelCase (characterService.ts)
- **Types**: index.ts in types folder
- **Pages**: PascalCase with Page suffix (HomePage.tsx)
- **Config**: lowercase with extension (vite.config.ts)
- **Documentation**: UPPERCASE.md (README.md)

---

## 🎯 Code Organization Principles

1. **Separation of Concerns**: Backend/Frontend completely separated
2. **Component Reusability**: Shared UI components (Card, Tag, Section)
3. **Type Safety**: TypeScript interfaces for all data structures
4. **API Abstraction**: Services layer separates API calls from components
5. **Error Handling**: Centralized error middleware and error components
6. **Environment Config**: All environment-specific values in .env files
7. **Validation**: Input validation on both frontend and backend

---

## 🔍 Quick File Finder

**Need to change colors?**
→ `frontend/tailwind.config.js`

**Need to add API endpoint?**
→ `backend/src/routes/character.routes.js`
→ `backend/src/controllers/character.controller.js`

**Need to modify character schema?**
→ `backend/src/models/Character.model.js`

**Need to add new page?**
→ Create in `frontend/src/pages/`
→ Add route in `frontend/src/App.tsx`

**Need to change UI component?**
→ `frontend/src/components/`

**Need to modify styles?**
→ `frontend/src/index.css` (global)
→ Inline in components (Tailwind classes)

---

This structure follows modern best practices for full-stack development:
✅ Clear separation of concerns
✅ Scalable architecture
✅ Type-safe codebase
✅ Production-ready deployment configuration
✅ Comprehensive documentation
