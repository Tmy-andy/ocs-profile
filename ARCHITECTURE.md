# 🏗️ System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER / BROWSER                               │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NETLIFY (Frontend Host)                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                 React Application                              │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐   │  │
│  │  │  HomePage   │  │ CharacterPage │  │  NotFoundPage      │   │  │
│  │  └─────────────┘  └──────────────┘  └────────────────────┘   │  │
│  │         │                │                                     │  │
│  │         └────────────────┴─────────────────┐                  │  │
│  │                                             ▼                  │  │
│  │                              ┌──────────────────────────┐     │  │
│  │                              │  Character Service       │     │  │
│  │                              │  (API Integration)       │     │  │
│  │                              └──────────────────────────┘     │  │
│  │                                             │                  │  │
│  │                                             │ Axios            │  │
│  └─────────────────────────────────────────────┼──────────────────┘  │
└─────────────────────────────────────────────────┼─────────────────────┘
                                                  │
                                                  │ REST API (JSON)
                                                  │
┌─────────────────────────────────────────────────▼─────────────────────┐
│                     RENDER (Backend Host)                              │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │                  Express.js Application                        │    │
│  │                                                                 │    │
│  │  ┌──────────────┐      ┌────────────────┐      ┌───────────┐  │    │
│  │  │   Routes     │ ───► │  Controllers   │ ───► │  Models   │  │    │
│  │  │              │      │                │      │           │  │    │
│  │  │ GET /chars   │      │ getAllChars()  │      │ Character │  │    │
│  │  │ GET /:id     │      │ getById()      │      │  Schema   │  │    │
│  │  │ POST /chars  │      │ create()       │      │           │  │    │
│  │  │ PUT /:id     │      │ update()       │      │ Mongoose  │  │    │
│  │  │ DELETE /:id  │      │ delete()       │      │           │  │    │
│  │  └──────────────┘      └────────────────┘      └─────┬─────┘  │    │
│  │                                                       │        │    │
│  │                                                       │        │    │
│  └───────────────────────────────────────────────────────┼────────┘    │
└─────────────────────────────────────────────────────────┼──────────────┘
                                                          │
                                                          │ MongoDB Driver
                                                          │
┌─────────────────────────────────────────────────────────▼──────────────┐
│                    MONGODB ATLAS (Cloud Database)                      │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │                     oc-profile Database                        │    │
│  │  ┌──────────────────────────────────────────────────────────┐ │    │
│  │  │              characters Collection                        │ │    │
│  │  │                                                            │ │    │
│  │  │  {                                                         │ │    │
│  │  │    _id: ObjectId,                                          │ │    │
│  │  │    name: "Lac Phong",                                      │ │    │
│  │  │    characterId: "c21e897b...",                             │ │    │
│  │  │    avatarImage: "https://...",                             │ │    │
│  │  │    about: "Rules? Let others...",                          │ │    │
│  │  │    backstory: "Qingyun Mountain...",                       │ │    │
│  │  │    tags: ["Male", "Xianxia", ...],                         │ │    │
│  │  │    creator: { name, followers, ... },                      │ │    │
│  │  │    messageCount: 62000,                                    │ │    │
│  │  │    createdAt: ISODate,                                     │ │    │
│  │  │    updatedAt: ISODate                                      │ │    │
│  │  │  }                                                         │ │    │
│  │  └──────────────────────────────────────────────────────────┘ │    │
│  └───────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Diagram

```
USER CLICKS "Search for Lac Phong"
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ 1. HomePage Component                                   │
│    - User types "Lac Phong" in search box               │
│    - onChange triggers setSearch("Lac Phong")           │
│    - useEffect detects change                           │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 2. characterService.getAll()                            │
│    - Calls: getAll({ search: "Lac Phong" })             │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Axios Request                                        │
│    - GET /api/characters?search=Lac%20Phong             │
│    - Headers: { Content-Type: application/json }        │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ NETWORK (Internet)
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Express Router                                       │
│    - Matches: GET /api/characters                       │
│    - Calls: getAllCharacters(req, res, next)            │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Controller Logic                                     │
│    - Extracts: search = "Lac Phong"                     │
│    - Creates query: { name: /Lac Phong/i }              │
│    - Calls: Character.find(query)                       │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Mongoose Model                                       │
│    - Builds MongoDB query                               │
│    - Executes: db.characters.find({ name: /Lac/i })     │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 7. MongoDB Atlas                                        │
│    - Searches collection                                │
│    - Returns matching documents                         │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ RESPONSE
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 8. Controller Response                                  │
│    - Formats: { success: true, data: [...], ... }       │
│    - Sends: res.status(200).json(...)                   │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 9. Axios Response                                       │
│    - Receives JSON                                      │
│    - Returns response.data                              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 10. HomePage Component                                  │
│     - setCharacters(response.data)                      │
│     - State updates                                     │
│     - React re-renders                                  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
         UI UPDATES - Shows "Lac Phong" character
```

---

## Component Tree

```
App (Router)
│
├── Route: /
│   └── HomePage
│       ├── SearchBar (input)
│       ├── CharacterGrid
│       │   └── Card (for each character)
│       │       ├── Image
│       │       ├── Name
│       │       ├── About
│       │       └── Tags[]
│       │           └── Tag (for each tag)
│       ├── LoadingSkeleton (conditional)
│       └── ErrorMessage (conditional)
│
├── Route: /character/:id
│   └── CharacterPage
│       ├── BackButton
│       └── CharacterProfileCard
│           ├── Card (Avatar)
│           │   └── Image (large)
│           ├── Card (Creator Info)
│           │   ├── Avatar (circle)
│           │   ├── Name
│           │   └── Stats
│           ├── Section (About)
│           │   └── Text
│           ├── Section (Backstory)
│           │   └── Text (long)
│           └── Section (Tags)
│               └── Tags[]
│                   └── Tag (for each)
│
└── Route: *
    └── NotFoundPage
        ├── 404 Icon
        ├── Message
        └── BackButton
```

---

## Data Model Diagram

```
Character Collection
┌─────────────────────────────────────────────────────┐
│ _id: ObjectId (Primary Key)                         │
│ ↓                                                    │
│ characterId: String (Unique, Indexed)               │
│ name: String (Required, Indexed, Max 100)           │
│ avatarImage: String (Required, URL)                 │
│ about: String (Required, Max 500)                   │
│ backstory: String (Required, Max 2000)              │
│ tags: Array<String> (Max 10, Indexed)               │
│ ↓                                                    │
│ creator: {                                           │
│   name: String (Required)                           │
│   username: String (Optional)                       │
│   followers: Number (Min 0)                         │
│   charactersCount: Number (Min 1)                   │
│   bio: String (Max 300)                             │
│ }                                                    │
│ ↓                                                    │
│ messageCount: Number (Min 0, Default 0)             │
│ isPublic: Boolean (Default true)                    │
│ ↓                                                    │
│ createdAt: Date (Auto-generated)                    │
│ updatedAt: Date (Auto-updated)                      │
└─────────────────────────────────────────────────────┘

Indexes:
- name (ascending)
- creator.name (ascending)
- tags (multikey)
- createdAt (descending)
- characterId (unique)
```

---

## State Management Flow

```
Frontend State Flow
┌─────────────────────────────────────────────────────┐
│                    HomePage                          │
│                                                      │
│  STATE:                                              │
│  ├── characters: Character[]                         │
│  ├── loading: boolean                                │
│  ├── error: string | null                            │
│  ├── page: number                                    │
│  ├── totalPages: number                              │
│  └── search: string                                  │
│                                                      │
│  EFFECTS:                                            │
│  └── useEffect(() => {                               │
│       fetchCharacters()                              │
│     }, [page, search])                               │
│                                                      │
│  HANDLERS:                                           │
│  ├── handleSearch(value)                             │
│  ├── handlePageChange(newPage)                       │
│  └── handleCharacterClick(id)                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  CharacterPage                       │
│                                                      │
│  STATE:                                              │
│  ├── character: Character | null                     │
│  ├── loading: boolean                                │
│  └── error: string | null                            │
│                                                      │
│  EFFECTS:                                            │
│  └── useEffect(() => {                               │
│       fetchCharacter(id)                             │
│     }, [id])                                         │
│                                                      │
│  HANDLERS:                                           │
│  └── handleBack()                                    │
└─────────────────────────────────────────────────────┘
```

---

## API Response Structure

```
Success Response
┌─────────────────────────────────────────────────────┐
│ {                                                    │
│   "success": true,                                   │
│   "data": [...] | {...},                            │
│   "pagination": {  // Only for list endpoints       │
│     "page": 1,                                       │
│     "limit": 10,                                     │
│     "total": 42,                                     │
│     "pages": 5                                       │
│   }                                                  │
│ }                                                    │
└─────────────────────────────────────────────────────┘

Error Response
┌─────────────────────────────────────────────────────┐
│ {                                                    │
│   "success": false,                                  │
│   "message": "Error description",                   │
│   "errors": ["Detail 1", "Detail 2"]  // Optional   │
│ }                                                    │
└─────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
DEVELOPMENT
┌─────────────────────────────────────────────────────┐
│ Frontend: localhost:5173                             │
│ Backend: localhost:5000                              │
│ Database: MongoDB Atlas (Dev cluster)                │
└─────────────────────────────────────────────────────┘

PRODUCTION
┌─────────────────────────────────────────────────────┐
│ Frontend: https://oc-profile.netlify.app             │
│           ↓                                          │
│           └─ CDN Edge Servers (Worldwide)            │
│                                                      │
│ Backend: https://oc-profile-api.onrender.com         │
│          ↓                                           │
│          └─ Render.com Servers (US/EU)               │
│                                                      │
│ Database: MongoDB Atlas (Production cluster)         │
│           ↓                                          │
│           └─ Global Clusters (Replicated)            │
└─────────────────────────────────────────────────────┘
```

---

## Security Flow

```
Request Security Layers
┌─────────────────────────────────────────────────────┐
│ 1. HTTPS (SSL/TLS)                                   │
│    ├─ Certificate validation                         │
│    └─ Encrypted communication                        │
│                                                      │
│ 2. Helmet.js (Backend)                               │
│    ├─ X-Frame-Options                                │
│    ├─ X-Content-Type-Options                         │
│    ├─ X-XSS-Protection                               │
│    └─ Content-Security-Policy                        │
│                                                      │
│ 3. CORS (Backend)                                    │
│    ├─ Origin validation                              │
│    └─ Allowed methods                                │
│                                                      │
│ 4. Input Validation (express-validator)              │
│    ├─ Type checking                                  │
│    ├─ Length limits                                  │
│    ├─ Format validation                              │
│    └─ Sanitization                                   │
│                                                      │
│ 5. MongoDB (Mongoose)                                │
│    ├─ Schema validation                              │
│    ├─ Query sanitization                             │
│    └─ Injection prevention                           │
│                                                      │
│ 6. Error Handling                                    │
│    ├─ No stack traces in production                  │
│    ├─ Generic error messages                         │
│    └─ Logging for debugging                          │
└─────────────────────────────────────────────────────┘
```

---

This architecture provides:
✅ Scalability through separation of concerns
✅ Security through multiple layers
✅ Performance through CDN and caching
✅ Reliability through cloud infrastructure
✅ Maintainability through clean code structure
