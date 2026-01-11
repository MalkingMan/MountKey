# MountKey API Key System

## 📋 Overview

Sistem API Key untuk platform MountKey dengan fitur:
- ✅ API Key gratis (tanpa kartu kredit)
- ✅ Expiration date yang bisa dipilih
- ✅ API Key disimpan sebagai hash (SHA-256)
- ✅ API Key ditampilkan hanya sekali
- ✅ Support revoke dan regenerate

---

## 🏗️ Struktur Folder

```
MountKey_API/
├── database/
│   ├── mount_key_schema.sql      # Schema tabel gunung
│   ├── api_key_system.sql        # Schema tabel users & api_keys
│   └── README.md                 # Dokumentasi database
│
├── src/
│   ├── config/
│   │   └── database.js           # Konfigurasi MySQL connection
│   │
│   ├── controllers/
│   │   ├── authController.js     # Register & Login
│   │   └── apiKeyController.js   # API Key CRUD
│   │
│   ├── middlewares/
│   │   └── apiKeyAuth.js         # ⭐ Middleware validasi API key
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # Routes /auth/*
│   │   └── apiKeyRoutes.js       # Routes /api-keys/*
│   │
│   ├── services/
│   │   ├── userService.js        # Business logic user
│   │   └── apiKeyService.js      # Business logic API key
│   │
│   ├── utils/
│   │   ├── apiKeyUtils.js        # Generate, hash, validate
│   │   └── responseHelper.js     # Format response
│   │
│   └── server.js                 # Entry point
│
├── .env                          # Environment variables
├── .env.example                  # Template environment
└── package.json                  # Dependencies
```

---

## 🔐 Flow Autentikasi API Key

### 1. User Registration + First API Key
```
┌─────────────────────────────────────────────────────────────────┐
│  1. User POST /auth/register                                    │
│     Body: { name, email, password, api_key_expiration_days }    │
│                              │                                  │
│                              ▼                                  │
│  2. Validate input data                                         │
│                              │                                  │
│                              ▼                                  │
│  3. Hash password dengan bcrypt                                 │
│                              │                                  │
│                              ▼                                  │
│  4. Insert user ke database                                     │
│                              │                                  │
│                              ▼                                  │
│  5. Generate API Key: mk_live_xxxxxxxxxxxxxxxxxxx               │
│                              │                                  │
│                              ▼                                  │
│  6. Hash API key dengan SHA-256                                 │
│                              │                                  │
│                              ▼                                  │
│  7. Simpan hash ke database (BUKAN plain text)                  │
│                              │                                  │
│                              ▼                                  │
│  8. Return API key ke user (HANYA SEKALI!)                      │
└─────────────────────────────────────────────────────────────────┘
```

### 2. API Request dengan API Key
```
┌─────────────────────────────────────────────────────────────────┐
│  1. User request dengan header:                                 │
│     X-MountKey-API-Key: mk_live_xxxxxxxxxxxxxxxxxxxxx           │
│                              │                                  │
│                              ▼                                  │
│  2. Middleware extract API key dari header                      │
│                              │                                  │
│                              ▼                                  │
│  3. Validasi format API key                                     │
│     - Harus dimulai dengan "mk_live_"                           │
│     - Minimal panjang tertentu                                  │
│                              │                                  │
│                              ▼                                  │
│  4. Hash API key dengan SHA-256                                 │
│                              │                                  │
│                              ▼                                  │
│  5. Query database: cari berdasarkan hash                       │
│                              │                                  │
│                              ▼                                  │
│  6. Cek status API key                                          │
│     - Status harus 'active'                                     │
│     - Bukan 'revoked' atau 'expired'                            │
│                              │                                  │
│                              ▼                                  │
│  7. Cek expiration date                                         │
│     - expires_at > NOW()                                        │
│                              │                                  │
│                              ▼                                  │
│  8. Cek status user                                             │
│     - User status harus 'active'                                │
│                              │                                  │
│                              ▼                                  │
│  9. Update last_used_at (async)                                 │
│                              │                                  │
│                              ▼                                  │
│  10. Attach user info ke request                                │
│                              │                                  │
│                              ▼                                  │
│  11. Next() → Controller handles request                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📡 API Endpoints

### Public Endpoints (Tanpa API Key)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| POST | `/auth/register` | Register + Generate first key |
| POST | `/auth/login` | Login + Get existing keys |

### Protected Endpoints (Memerlukan API Key)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api-keys` | List all API keys |
| POST | `/api-keys` | Create new API key |
| GET | `/api-keys/:id` | Get single API key |
| DELETE | `/api-keys/:id` | Revoke API key |
| POST | `/api-keys/:id/regenerate` | Regenerate API key |

---

## 📝 Contoh Request & Response

### Register User

**Request:**
```http
POST /auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "api_key_expiration_days": 30
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Registration successful. Please save your API key!",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "user"
        },
        "api_key": {
            "key": "mk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
            "id": 1,
            "keyName": "Default Key",
            "maskedKey": "mk_live_****************************o5p6",
            "status": "active",
            "expiresAt": "2026-02-09T05:29:18.000Z",
            "warning": "Please save this API key. It will NOT be shown again!"
        }
    },
    "timestamp": "2026-01-10T05:29:18.000Z"
}
```

### API Request dengan Key (Success)

**Request:**
```http
GET /api-keys
X-MountKey-API-Key: mk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "API keys retrieved successfully",
    "data": {
        "count": 1,
        "api_keys": [
            {
                "id": 1,
                "keyName": "Default Key",
                "maskedKey": "mk_live_****************************o5p6",
                "status": "active",
                "expiresAt": "2026-02-09T05:29:18.000Z",
                "lastUsedAt": "2026-01-10T05:30:00.000Z",
                "createdAt": "2026-01-10T05:29:18.000Z",
                "isExpired": false
            }
        ]
    },
    "timestamp": "2026-01-10T05:30:00.000Z"
}
```

---

## ❌ Error Responses

### API Key Missing
```json
{
    "success": false,
    "message": "API key is required. Please provide X-MountKey-API-Key header.",
    "error_code": "API_KEY_MISSING",
    "timestamp": "2026-01-10T05:30:00.000Z"
}
```
**HTTP Status: 401 Unauthorized**

### API Key Invalid
```json
{
    "success": false,
    "message": "Invalid API key.",
    "error_code": "API_KEY_INVALID",
    "timestamp": "2026-01-10T05:30:00.000Z"
}
```
**HTTP Status: 401 Unauthorized**

### API Key Expired
```json
{
    "success": false,
    "message": "API key has expired.",
    "error_code": "API_KEY_EXPIRED",
    "timestamp": "2026-01-10T05:30:00.000Z"
}
```
**HTTP Status: 401 Unauthorized**

### API Key Revoked
```json
{
    "success": false,
    "message": "API key has been revoked.",
    "error_code": "API_KEY_REVOKED",
    "timestamp": "2026-01-10T05:30:00.000Z"
}
```
**HTTP Status: 401 Unauthorized**

---

## 🔒 Security Best Practices

| Practice | Implementation |
|----------|----------------|
| **Hash Storage** | API key di-hash dengan SHA-256 sebelum disimpan |
| **One-time Display** | API key plain text hanya ditampilkan sekali saat generate |
| **Password Hashing** | User password di-hash dengan bcrypt (12 rounds) |
| **Secure Random** | API key di-generate dengan `crypto.randomBytes()` |
| **Prefix Format** | API key memiliki prefix `mk_live_` untuk identifikasi |
| **Last Four Chars** | Untuk display, hanya 4 karakter terakhir yang disimpan |
| **IP Logging** | IP terakhir yang menggunakan API key dicatat |
| **Expiration** | Setiap API key memiliki tanggal kadaluarsa |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
mysql -u root -pAr-ray04 -P 3309 < database/mount_key_schema.sql
mysql -u root -pAr-ray04 -P 3309 < database/api_key_system.sql
```

### 3. Run Server
```bash
npm run dev
```

### 4. Test Registration
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","api_key_expiration_days":30}'
```

---

## 📋 Expiration Options

| Option | Days | Use Case |
|--------|------|----------|
| Short | 7 | Testing, temporary access |
| Standard | 30 | Default, regular usage |
| Extended | 90 | Production apps |
| Custom | 1-365 | Flexible, max 1 year |
