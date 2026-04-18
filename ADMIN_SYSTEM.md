# 🛡️ Admin System Guide

## ✨ Tổng Quan

Hệ thống admin được bảo vệ bởi JWT authentication. Chỉ admin đã đăng nhập mới có thể:
- ✅ Tạo character mới
- ✅ Xóa character  
- ✅ Xem dashboard quản lý

## 🚀 Setup Admin Lần Đầu

### Bước 1: Chạy script setup
```powershell
cd backend
node setup-admin.js
```

### Bước 2: Nhập thông tin
```
Enter admin username: admin
Enter admin password (min 6 chars): 123456
```

### Bước 3: Hoàn tất!
```
✅ Admin user created successfully!

📝 Login Details:
   Username: admin
   Password: 123456

🌐 Login URL: http://localhost:5173/admin
```

## 🔐 Đăng Nhập

1. Truy cập: **http://localhost:5173/admin**
2. Nhập username và password
3. Click "Đăng nhập"
4. Tự động chuyển đến Dashboard

## 🎯 Routes

### Public (Không cần đăng nhập):
- `/` - Homepage với tất cả characters
- `/character/:slug` - Xem chi tiết character
- `/admin` - Trang đăng nhập admin

### Protected (Cần đăng nhập):
- `/admin/dashboard` - Quản lý characters
- `/create` - Tạo character mới
- API: POST/PUT/DELETE `/api/characters`

## 📝 Dashboard Features

### Xem tất cả characters:
- ✅ Danh sách dạng bảng
- ✅ Avatar, tên, slug, tags
- ✅ Ngày tạo

### Actions:
- **Xem** - Mở trang detail của character
- **Xóa** - Xóa character (có confirm)
- **Tạo mới** - Button "Tạo Character" ở header
- **Đăng xuất** - Logout và về homepage

## 🔒 Security

### JWT Token:
- Được lưu trong `localStorage` với key `oc_admin_token`
- Tự động thêm vào header mỗi request
- Expires sau 30 ngày

### Protected API:
```javascript
// Backend middleware
protect(req, res, next) // Verify JWT token

// Protected routes
POST   /api/characters   - Create (Admin only)
PUT    /api/characters/:id - Update (Admin only)
DELETE /api/characters/:id - Delete (Admin only)

// Public routes  
GET    /api/characters   - List all
GET    /api/characters/:id - Get one
```

## 🔄 Workflow

### User (Khách):
1. Vào homepage → Xem characters
2. Click vào card → Xem detail
3. Không thấy button "Tạo Character"

### Admin:
1. Vào `/admin` → Đăng nhập
2. Dashboard → Quản lý characters
3. Click "Tạo Character" → Form tạo mới
4. Tạo xong → Auto về homepage
5. Dashboard → Có thể xóa characters

## 🛠️ API Endpoints

### Auth:
```
POST /api/auth/login       - Login admin
GET  /api/auth/me          - Get current user (protected)
POST /api/auth/setup       - Create first admin (one-time)
```

### Characters:
```
GET    /api/characters              - List (public)
GET    /api/characters/:id          - Detail (public)
POST   /api/characters              - Create (protected)
PUT    /api/characters/:id          - Update (protected)
DELETE /api/characters/:id          - Delete (protected)
```

## 💡 Tips

1. **Quên password?** - Không có reset, phải tạo lại admin mới trong database
2. **Logout** - Click button "Đăng xuất" ở dashboard
3. **Token expires** - Tự động logout sau 30 ngày
4. **Multiple admins?** - Hiện tại chỉ support 1 admin

## 🔧 Troubleshooting

**Lỗi "Invalid credentials":**
- Check username/password đúng chưa
- Username phải lowercase

**Lỗi "Not authorized":**
- Token hết hạn → Login lại
- Chưa login → Vào `/admin` để login

**Lỗi khi tạo character:**
- Check đã login chưa
- Token còn hạn không
- F12 → Console → Xem lỗi cụ thể

---

**Security Note:** Đây là simple admin system cho 1 người dùng. Trong production cần:
- Hash password tốt hơn
- Refresh token
- Role-based permissions
- Session management
- HTTPS required
