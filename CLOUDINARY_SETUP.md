# 🌸 Hướng Dẫn Setup Cloudinary Upload Preset

## ⚠️ QUAN TRỌNG: Bạn cần tạo Upload Preset trước khi sử dụng!

### Bước 1: Truy cập Cloudinary Dashboard
1. Đăng nhập vào: https://cloudinary.com/console
2. Chọn Settings (biểu tượng bánh răng) ở góc dưới bên trái

### Bước 2: Tạo Upload Preset
1. Chọn tab **Upload** trong Settings
2. Scroll xuống phần **Upload presets**
3. Click nút **Add upload preset**

### Bước 3: Cấu hình Upload Preset
Điền thông tin như sau:

**Upload preset name:** `oc_profile_preset`

**Signing mode:** Chọn **Unsigned** (quan trọng!)

**Folder:** `oc-profiles` (tùy chọn - để organize ảnh)

**Allowed formats:** `jpg, png, gif, webp`

**Max file size:** `5000000` (5MB)

**Other settings:** Giữ mặc định

4. Click **Save**

### Bước 4: Verify
- Upload preset name phải là: `oc_profile_preset`
- Signing mode phải là: **Unsigned**
- Nếu đúng → Click Save và bạn đã xong!

## 🎯 Thông tin đã cấu hình

```env
VITE_CLOUDINARY_CLOUD_NAME=duvjvzypn
VITE_CLOUDINARY_UPLOAD_PRESET=oc_profile_preset
```

## ✅ Sau khi setup xong:

1. Restart frontend dev server (Ctrl+C rồi npm run dev)
2. Truy cập http://localhost:5173/create
3. Click "Tải ảnh lên" và chọn ảnh
4. Ảnh sẽ tự động upload lên Cloudinary!

## 🔍 Troubleshooting

**Lỗi "Upload preset not found":**
- Kiểm tra tên preset: phải là `oc_profile_preset`
- Kiểm tra Signing mode: phải là **Unsigned**

**Lỗi "Invalid credentials":**
- Kiểm tra Cloud Name: `duvjvzypn`
- Restart lại frontend

**Lỗi "Upload failed":**
- Kiểm tra kích thước ảnh < 5MB
- Kiểm tra định dạng: JPG, PNG, GIF
- Kiểm tra kết nối internet

## 📝 Ghi chú bảo mật

⚠️ **KHÔNG BAO GIỜ** commit API Secret vào Git!
- API Secret chỉ dùng cho backend
- Frontend chỉ cần Cloud Name và Upload Preset
- Upload Preset phải là **Unsigned** để frontend có thể upload trực tiếp

---

**Cloud Name:** duvjvzypn  
**Upload Preset:** oc_profile_preset (cần tạo)  
**Dashboard:** https://cloudinary.com/console
