# 🚀 Quick Start Guide - Employee Management Backend

## Langkah Cepat (5 Menit)

### 1️⃣ Extract & Install (2 menit)

```bash
# Extract file ZIP
unzip employee-management-backend.zip
cd employee-management-backend

# Install dependencies
npm install
```

### 2️⃣ Seed Database (30 detik)

```bash
npm run seed
```

Output yang diharapkan:
```
🌱 Starting database seed...
✅ Users seeded successfully
   - Admin: username=admin, password=admin123
   - User: username=user, password=user123
✅ 12 employees seeded successfully

🎉 Database seed completed!
```

### 3️⃣ Start Server (10 detik)

```bash
npm run dev
```

Output:
```
🚀 Server is running on port 5000
📍 Environment: development
🔗 Health check: http://localhost:5000/health
```

### 4️⃣ Test API (2 menit)

#### A. Test Health Check
```bash
curl http://localhost:5000/health
```

#### B. Login sebagai Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Copy token dari response, lalu:

#### C. Get Employees
```bash
curl http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎯 Default Accounts

### Admin Account
```
Username: admin
Password: admin123
Role: admin
Permissions: Full access (Create, Read, Update, Delete)
```

### User Account
```
Username: user
Password: user123
Role: user
Permissions: Read-only access
```

## 📝 Testing Checklist

- [ ] Server berjalan di port 5000
- [ ] Health check returns OK
- [ ] Login admin berhasil dan dapat token
- [ ] Get employees berhasil dengan token
- [ ] Login user berhasil
- [ ] User tidak bisa create employee (403 Forbidden)
- [ ] Admin bisa create employee

## 🔧 Troubleshooting

### Port 5000 sudah digunakan

Edit `.env`:
```env
PORT=3001
```

### Module not found error

```bash
rm -rf node_modules package-lock.json
npm install
```

### Permission denied error

```bash
chmod +x src/scripts/seed.js
```

### Cannot read employees.json

```bash
npm run seed
```

## 📱 Testing dengan Postman

1. Import `postman_collection.json`
2. Login as Admin request → Send
3. Token otomatis tersimpan
4. Test endpoints lainnya

## 🎓 Next Steps

1. Baca `README.md` untuk dokumentasi lengkap
2. Baca `ARCHITECTURE.md` untuk penjelasan teknis
3. Test semua endpoints di Postman
4. Mulai develop frontend

## 🆘 Help

Jika ada masalah:
1. Check logs di terminal
2. Verify `.env` file exists
3. Ensure port 5000 available
4. Run `npm run seed` ulang
5. Restart server

---

**Happy coding! 🚀**
