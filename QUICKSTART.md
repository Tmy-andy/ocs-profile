# 🚀 Quick Start Guide

Get your OC Profile website up and running in 5 minutes!

## ⚡ Prerequisites

- [ ] Node.js 20+ installed ([Download](https://nodejs.org))
- [ ] MongoDB Atlas account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## 📋 Step-by-Step Setup

### 1️⃣ MongoDB Atlas Setup (5 minutes)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Security → Database Access
   - Add New Database User
   - Username: `ocprofile`
   - Password: Generate secure password (save it!)
   - Database User Privileges: Read and Write to any database

4. **Whitelist IP**
   - Security → Network Access
   - Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `oc-profile`

Example: `mongodb+srv://ocprofile:YourPassword123@cluster0.xxxxx.mongodb.net/oc-profile?retryWrites=true&w=majority`

### 2️⃣ Backend Setup (2 minutes)

```powershell
# Navigate to backend folder
cd "C:\Users\ASUS\OneDrive\Desktop\OC Profile\backend"

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env file - open with notepad
notepad .env
```

**Edit .env file:**
```env
MONGODB_URI=mongodb+srv://ocprofile:YourPassword123@cluster0.xxxxx.mongodb.net/oc-profile?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Start backend:**
```powershell
npm run dev
```

✅ You should see:
```
✅ MongoDB Connected: cluster0-xxx.mongodb.net
🚀 Server is running on port 5000
```

**Test backend:**
- Open browser: http://localhost:5000/health
- Should see: `{"status":"OK","message":"OC Profile API is running",...}`

### 3️⃣ Frontend Setup (2 minutes)

**Open NEW terminal** (keep backend running!)

```powershell
# Navigate to frontend folder
cd "C:\Users\ASUS\OneDrive\Desktop\OC Profile\frontend"

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env file
notepad .env
```

**Edit .env file:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Start frontend:**
```powershell
npm run dev
```

✅ You should see:
```
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

Browser will automatically open to http://localhost:5173/

### 4️⃣ Create Sample Data (1 minute)

**Open NEW terminal:**

```powershell
# Create a sample character using PowerShell
$body = @{
    name = "Lac Phong"
    avatarImage = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500"
    about = "Rules? Let others abide by them. I... am only interested in annoying you."
    backstory = "Qingyun Mountain is shrouded in clouds year-round, a majestic sect with rules as strict as mountains."
    tags = @("Male", "Xianxia", "Ancient setting", "Humor")
    creator = @{
        name = "Skibidi tôi les"
        followers = 2400
        charactersCount = 30
    }
    messageCount = 62000
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/characters" -Method Post -Body $body -ContentType "application/json"
```

Refresh your browser - you should see the character appear!

## 🎉 Success Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Can access health check endpoint
- [ ] Created at least one sample character
- [ ] Character appears in frontend gallery
- [ ] Can click character to view profile

## 🐛 Troubleshooting

### Backend won't start

**MongoDB connection error:**
```
❌ MongoDB Connection Error
```
✅ Check your MONGODB_URI in .env
✅ Verify username/password
✅ Check IP whitelist in MongoDB Atlas

**Port already in use:**
```
❌ Port 5000 is already in use
```
✅ Close other apps using port 5000
✅ Or change PORT in .env to 5001

### Frontend won't start

**Dependencies error:**
```
❌ Cannot find module...
```
✅ Delete node_modules folder
✅ Run `npm install` again

**API connection error:**
```
❌ Network Error
```
✅ Make sure backend is running
✅ Check VITE_API_URL in frontend/.env

### No characters showing

✅ Open browser console (F12)
✅ Check for errors
✅ Verify backend is running
✅ Create sample data using the PowerShell script above

## 📚 Next Steps

1. **Explore the UI**
   - Check out the character gallery
   - Test search functionality
   - Click on characters to view profiles

2. **Create More Characters**
   - See SAMPLE_DATA.md for more examples
   - Use Postman or Thunder Client for easier testing

3. **Customize Design**
   - Edit colors in `frontend/tailwind.config.js`
   - Modify styles in `frontend/src/index.css`
   - Update components in `frontend/src/components/`

4. **Deploy to Production**
   - Follow deployment guide in README.md
   - Deploy backend to Render
   - Deploy frontend to Netlify

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review SAMPLE_DATA.md for example data
- Check backend/README.md for API documentation
- Check frontend/README.md for UI component docs

## 🎨 Customization Ideas

- Change sakura pink to your favorite color
- Add more tags/categories
- Implement character ratings
- Add character relationships
- Create character collections
- Add dark/light mode toggle

## ✨ You're All Set!

Your OC Profile website is now running locally. Start creating amazing character profiles! 🎭

---

**Having issues?** Make sure:
1. Node.js version is 20+ (`node --version`)
2. MongoDB Atlas cluster is running
3. Both terminals are open (backend + frontend)
4. Environment variables are set correctly
5. Firewall isn't blocking ports 5000/5173
