### Planner Response

Baik! Berikut panduan **langkah demi langkah** yang jelas untuk testing API MountKey di Postman sebagai user:

---

## 🚀 PANDUAN TESTING API MOUNTKEY DI POSTMAN

### ✅ PERSIAPAN AWAL

**1. Pastikan server berjalan:**
```
npm run dev:all
```
Server akan berjalan di `http://localhost:3001`

---

## 📌 LANGKAH 1: Test Endpoint Publik (Tanpa Login)

### 1.1 Buka Postman → Klik **"New Request"**

### 1.2 Test List Gunung Publik
1. Pilih method: **GET**
2. Masukkan URL: 
   ```
   http://localhost:3001/public/mountains
   ```
3. Klik tombol **Send**
4. ✅ **Hasil:** Anda akan melihat daftar gunung dalam format JSON

### 1.3 Test Detail Gunung Publik
1. Method: **GET**
2. URL: 
   ```
   http://localhost:3001/public/mountains/everest
   ```
3. Klik **Send**
4. ✅ **Hasil:** Detail gunung Everest akan muncul

---

## 📌 LANGKAH 2: Register User Baru (Mendapatkan API Key)

### 2.1 Buat Request Baru
1. Method: **POST**
2. URL:
   ```
   http://localhost:3001/auth/register
   ```

### 2.2 Setup Headers
1. Klik tab **Headers**
2. Tambahkan:
   | Key | Value |
   |-----|-------|
   | Content-Type | application/json |

### 2.3 Setup Body
1. Klik tab **Body**
2. Pilih **raw**
3. Pilih format **JSON** (dropdown di sebelah kanan)
4. Masukkan:
```json
{
    "name": "Test User",
    "email": "testuser@gmail.com",
    "password": "password123"
}
```

### 2.4 Kirim Request
1. Klik **Send**
2. ✅ **Hasil yang berhasil (Status 201):**
```json
{
    "success": true,
    "message": "Registration successful. Please save your API key!",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": 1,
            "name": "Test User",
            "email": "testuser@gmail.com"
        },
        "api_key": {
            "key": "mk_live_xxxxxxxxxxxxxxxxxxxxxxxx",
            "warning": "Please save this API key. It will NOT be shown again!"
        }
    }
}
```

### ⚠️ PENTING: SIMPAN 2 DATA INI!
1. **`token`** → untuk manage API keys
2. **`api_key.key`** → untuk akses data gunung (V1 API)

---

## 📌 LANGKAH 3: Test V1 API (Dengan API Key)

### 3.1 Test List Gunung dengan Filter
1. Method: **GET**
2. URL:
   ```
   http://localhost:3001/v1/mountains?page=1&limit=10
   ```

### 3.2 Setup Headers (WAJIB!)
1. Klik tab **Headers**
2. Tambahkan:
   | Key | Value |
   |-----|-------|
   | X-API-Key | mk_live_xxxxxxxx (paste API key Anda) |

### 3.3 Kirim Request
1. Klik **Send**
2. ✅ **Hasil yang berhasil (Status 200):**
```json
{
    "success": true,
    "data": {
        "mountains": [...],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 500
        }
    }
}
```

---

## 📌 LANGKAH 4: Test Detail Gunung

1. Method: **GET**
2. URL:
   ```
   http://localhost:3001/v1/mountains/kilimanjaro
   ```
3. Headers:
   | Key | Value |
   |-----|-------|
   | X-API-Key | mk_live_xxxxxxxx |
4. Klik **Send**
5. ✅ **Hasil:** Detail lengkap Gunung Kilimanjaro

---

## 📌 LANGKAH 5: Test Trails Gunung

1. Method: **GET**
2. URL:
   ```
   http://localhost:3001/v1/mountains/rinjani/trails
   ```
3. Headers:
   | Key | Value |
   |-----|-------|
   | X-API-Key | mk_live_xxxxxxxx |
4. Klik **Send**
5. ✅ **Hasil:** Daftar jalur pendakian Gunung Rinjani

---

## 📌 LANGKAH 6: Login (Jika Sudah Punya Akun)

### 6.1 Setup Request
1. Method: **POST**
2. URL:
   ```
   http://localhost:3001/auth/login
   ```

### 6.2 Headers
| Key | Value |
|-----|-------|
| Content-Type | application/json |

### 6.3 Body (raw JSON)
```json
{
    "email": "testuser@gmail.com",
    "password": "password123"
}
```

### 6.4 Klik Send
✅ **Hasil:** Anda mendapat `token` dan list `api_keys` yang dimiliki

---

## 📌 LANGKAH 7: Manage API Keys (Opsional)

### 7.1 Lihat Semua API Keys Saya
1. Method: **GET**
2. URL: `http://localhost:3001/api-keys`
3. Headers:
   | Key | Value |
   |-----|-------|
   | Authorization | Bearer eyJhbGciOiJIUzI1... (token dari login) |
4. Klik **Send**

### 7.2 Buat API Key Baru
1. Method: **POST**
2. URL: `http://localhost:3001/api-keys`
3. Headers:
   | Key | Value |
   |-----|-------|
   | Authorization | Bearer eyJhbGciOiJIUzI1... |
   | Content-Type | application/json |
4. Body:
```json
{
    "name": "Mobile App Key",
    "expires_in_days": 90
}
```
5. Klik **Send**

---

## 🎯 RINGKASAN ENDPOINT & AUTENTIKASI

| Endpoint | Method | Auth Required | Header |
|----------|--------|---------------|--------|
| `/public/mountains` | GET | ❌ Tidak | - |
| `/public/mountains/:slug` | GET | ❌ Tidak | - |
| `/auth/register` | POST | ❌ Tidak | Content-Type: application/json |
| `/auth/login` | POST | ❌ Tidak | Content-Type: application/json |
| `/v1/mountains` | GET | ✅ API Key | X-API-Key: mk_live_xxx |
| `/v1/mountains/:slug` | GET | ✅ API Key | X-API-Key: mk_live_xxx |
| `/v1/mountains/:slug/trails` | GET | ✅ API Key | X-API-Key: mk_live_xxx |
| `/api-keys` | GET/POST | ✅ JWT Token | Authorization: Bearer xxx |

---

## ❌ TROUBLESHOOTING

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `401 Unauthorized` | API Key salah/tidak ada | Cek header `X-API-Key` |
| `401 Invalid token` | JWT expired/salah | Login ulang, gunakan token baru |
| `404 Not Found` | Slug gunung tidak ada | Cek nama slug yang benar |
| `ECONNREFUSED` | Server tidak jalan | Jalankan `npm run dev:all` |

---

Apakah ada langkah yang kurang jelas? Saya bisa bantu jelaskan lebih detail! 🚀