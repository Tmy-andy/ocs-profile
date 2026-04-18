# 🔗 Slug-based URLs

## ✨ Tính năng mới: Friendly URLs

Characters giờ có URL thân thiện dựa trên tên thay vì ID random!

### Ví dụ:

**Trước:**
```
http://localhost:5173/character/676123abc456def789012345
```

**Bây giờ:**
```
http://localhost:5173/character/lac-phong
http://localhost:5173/character/datanla-staff
```

## 🎯 Cách hoạt động:

1. **Tự động tạo slug** khi tạo character mới
2. Slug được tạo từ tên character:
   - Chuyển thành chữ thường
   - Bỏ dấu tiếng Việt: `Lạc Phong` → `lac phong`
   - Thay khoảng trắng bằng dấu gạch ngang: `lac-phong`
   - Xóa ký tự đặc biệt
   
3. **Xử lý trùng lặp**: Nếu slug đã tồn tại, tự động thêm số:
   - `lac-phong`
   - `lac-phong-1`
   - `lac-phong-2`

## 🔄 Migration cho characters cũ:

Nếu bạn đã có characters từ trước, chạy migration:

```powershell
cd backend
node migrate-slugs.js
```

Script sẽ:
- ✅ Tạo slug cho tất cả characters chưa có
- ✅ Cập nhật characterId = slug
- ✅ Xử lý trùng lặp tự động

## 📝 Schema Update:

```javascript
{
  name: "Lạc Phong",
  slug: "lac-phong",           // ← Mới! Dùng cho URL
  characterId: "lac-phong",    // ← Cập nhật = slug
  avatarImage: "...",
  // ...
}
```

## 🌐 Routes:

Backend API hỗ trợ cả 2:
- `/api/characters/lac-phong` ✅ (slug)
- `/api/characters/676123abc...` ✅ (MongoDB ObjectId)

Frontend luôn dùng slug cho URL đẹp hơn!

## ✨ Benefits:

1. **SEO friendly** - URL có ý nghĩa
2. **Dễ nhớ** - `lac-phong` thay vì chuỗi random
3. **Dễ share** - URL ngắn gọn, dễ chia sẻ
4. **Professional** - Trông chuyên nghiệp hơn

---

Slug tự động được tạo khi bạn tạo character mới! 🎉
