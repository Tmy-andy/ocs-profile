# 🎭 OC Character Profile Website

Website hiện đại để showcase nhân vật OC với giao diện dark theme, glassmorphism và sakura-pink accent.

## 🚀 Bắt Đầu Nhanh (5 phút)

### Bước 1: Cài đặt thư viện (ĐÃ XONG ✅)
```powershell
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### Bước 2: Tạo MongoDB Atlas Database (FREE)

1. **Đăng ký MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Tạo cluster miễn phí** (M0)
3. **Tạo database user**: username + password
4. **Whitelist IP**: 0.0.0.0/0 (cho phép tất cả)
5. **Lấy connection string**: 
   ```
   mongodb+srv://username:password@cluster.mongodb.net/oc-profile
   ```

### Bước 3: Setup Backend

```powershell
cd backend
cp .env.example .env
notepad .env  # Hoặc code .env
```

**Sửa file `.env`:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/oc-profile
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Chạy backend:**
```powershell
npm run dev
```
✅ Xem: http://localhost:5000/health

### Bước 4: Setup Frontend (Terminal mới)

```powershell
cd frontend
cp .env.example .env
notepad .env  # Hoặc code .env
```

**Sửa file `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Chạy frontend:**
```powershell
npm run dev
```
✅ Xem: http://localhost:5173

### Bước 5: Tạo Character Mẫu

```powershell
# Tạo character qua API
$body = @{
    name = "Lac Phong"
    avatarImage = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500"
    about = "Rules? Let others abide by them. I... am only interested in annoying you."
    backstory = "Qingyun Mountain is shrouded in clouds year-round..."
    tags = @("Male", "Xianxia", "Ancient setting")
    creator = @{
        name = "Your Name"
        followers = 2400
        charactersCount = 30
    }
    messageCount = 62000
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/characters" -Method Post -Body $body -ContentType "application/json"
```

🎉 **Xong!** Refresh browser để xem character!

---

## 🎨 Tính Năng

- ✨ **UI Đẹp**: Dark theme với sakura-pink và glassmorphism
- 🎭 **Character Profile**: Card chi tiết với ảnh, backstory, tags
- 🔍 **Tìm kiếm**: Search theo tên và lọc theo tags
- 📱 **Responsive**: Hoạt động tốt trên mọi thiết bị
- ⚡ **Nhanh**: Build với Vite
- 🎯 **Type-Safe**: Full TypeScript

## 🏗️ Cấu Trúc Project

```
OC Profile/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # Logic xử lý
│   │   ├── models/       # MongoDB schema
│   │   ├── routes/       # API endpoints
│   │   └── server.js     # Entry point
│   └── package.json
│
├── frontend/             # React + TypeScript
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Pages
│   │   ├── services/     # API calls
│   │   └── types/        # TypeScript types
│   └── package.json
│
└── README.md            # File này
```

##  API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/characters` | Lấy tất cả characters |
| GET | `/api/characters?search=name` | Tìm kiếm |
| GET | `/api/characters/:id` | Lấy 1 character |
| POST | `/api/characters` | Tạo character mới |
| PUT | `/api/characters/:id` | Cập nhật |
| DELETE | `/api/characters/:id` | Xóa |

## 🎨 Tùy Chỉnh

### Đổi màu chủ đạo
Edit `frontend/tailwind.config.js`:
```js
colors: {
  sakura: {
    500: '#ff2d7a', // Đổi màu này
  }
}
```

### Thêm field cho Character
1. Edit `backend/src/models/Character.model.js`
2. Edit `frontend/src/types/index.ts`
3. Update components

## 🚀 Deploy Production

### Backend → Render.com
1. Push code lên GitHub
2. Tạo Web Service trên Render
3. Environment variables:
   ```
   MONGODB_URI=your_production_mongodb_uri
   NODE_ENV=production
   FRONTEND_URL=https://your-app.netlify.app
   ```

### Frontend → Netlify
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variable:
   ```
   VITE_API_URL=https://your-api.onrender.com/api
   ```

## 🐛 Troubleshooting

### Backend không chạy
- ✅ Check MongoDB connection string
- ✅ Verify .env file
- ✅ Port 5000 available?

### Frontend không connect API
- ✅ Backend đang chạy?
- ✅ VITE_API_URL đúng chưa?
- ✅ Check browser console (F12)

### CORS error
- ✅ Update FRONTEND_URL trong backend .env
- ✅ Restart backend server

## � Tech Stack

**Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios  
**Backend**: Node.js 20+, Express, MongoDB, Mongoose  
**Deploy**: Netlify (frontend), Render (backend), MongoDB Atlas (database)
