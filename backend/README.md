# OC Profile Backend API

Backend API for the OC Character Profile website built with Node.js, Express, and MongoDB.

## 🏗️ Architecture

This is a RESTful API server that follows the MVC pattern:
- **Models**: Mongoose schemas for MongoDB
- **Controllers**: Business logic for handling requests
- **Routes**: API endpoint definitions
- **Middleware**: Error handling and validation

## 🚀 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB (with Mongoose 8+)
- **Validation**: express-validator 7+
- **Security**: Helmet, CORS
- **Dev Tools**: Nodemon

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── character.controller.js
│   ├── models/
│   │   └── Character.model.js
│   ├── routes/
│   │   └── character.routes.js
│   ├── middleware/
│   │   └── error.middleware.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🗄️ Database Schema

### Character Model

```javascript
{
  name: String (required, max 100 chars),
  characterId: String (unique, auto-generated),
  avatarImage: String (required, URL),
  about: String (required, max 500 chars),
  backstory: String (required, max 2000 chars),
  tags: [String] (max 10 tags),
  creator: {
    name: String (required),
    username: String,
    followers: Number (default: 0),
    charactersCount: Number (default: 1),
    bio: String (max 300 chars)
  },
  messageCount: Number (default: 0),
  isPublic: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🔌 API Endpoints

### Characters

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/characters` | Get all characters (with pagination) |
| GET | `/api/characters/:id` | Get single character by ID |
| POST | `/api/characters` | Create new character |
| PUT | `/api/characters/:id` | Update character |
| DELETE | `/api/characters/:id` | Delete character |

### Query Parameters (GET all)

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search by name
- `tags`: Filter by tags (comma-separated)

### Example Response

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Lac Phong",
    "characterId": "c21e897b-a9f...",
    "avatarImage": "https://...",
    "about": "Rules? Let others abide by them...",
    "backstory": "Qingyun Mountain is shrouded...",
    "tags": ["Male", "Xianxia", "Ancient setting"],
    "creator": {
      "name": "Skibidi tôi les",
      "followers": 2400,
      "charactersCount": 30
    },
    "messageCount": 62000,
    "createdAt": "2025-12-22T...",
    "updatedAt": "2025-12-22T..."
  }
}
```

## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/oc-profile?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Run Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 4. Test API

Health check:
```bash
curl http://localhost:5000/health
```

## 🌐 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string and add to `.env`

## 🚀 Deployment to Render

### Step 1: Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `oc-profile-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Environment Variables

Add these in Render dashboard:

```
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
FRONTEND_URL=https://your-netlify-app.netlify.app
```

### Step 4: Deploy

Click "Create Web Service" and wait for deployment.

Your API will be available at: `https://oc-profile-api.onrender.com`

## 🔒 Security Features

- ✅ Helmet for HTTP headers security
- ✅ CORS configuration
- ✅ Input validation with express-validator
- ✅ MongoDB injection protection (Mongoose)
- ✅ Error handling middleware
- ⏳ JWT authentication (ready for implementation)

## 📝 Future Improvements

1. **Authentication & Authorization**
   - JWT-based auth
   - User registration/login
   - Protected routes
   - User ownership validation

2. **Features**
   - Character likes/favorites
   - Comments system
   - File upload for images (Cloudinary)
   - Search improvements (full-text search)
   - Character categories

3. **Performance**
   - Redis caching
   - Rate limiting
   - Database query optimization
   - Image optimization

4. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - API testing (Supertest)

## 🐛 Common Issues

### MongoDB Connection Error

```
✅ Solution: Check MONGODB_URI in .env
✅ Whitelist your IP in MongoDB Atlas
✅ Verify username/password are correct
```

### CORS Error

```
✅ Solution: Update FRONTEND_URL in .env
✅ Check Render environment variables
```

## 📄 License

MIT
