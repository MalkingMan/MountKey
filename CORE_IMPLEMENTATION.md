# MountKey API Key System - Core Implementation

## 📋 Overview

Dokumentasi implementasi core logic sistem API Key MountKey.

---

## 🏗️ Struktur File

```
src/
├── middlewares/
│   └── apiKeyAuth.js      ⭐ Core validation middleware
├── services/
│   └── apiKeyService.js   ⭐ Business logic (create, validate, revoke)
├── utils/
│   ├── apiKeyUtils.js     ⭐ Generate, hash, validate format
│   └── responseHelper.js  ⭐ Standardized responses
└── routes/
    └── exampleRoutes.js   📖 Contoh penggunaan
```

---

## 📁 File Breakdown

### 1. `apiKeyUtils.js` - Core Utilities

```javascript
// Generate API key baru
const key = generateApiKey();
// => "mk_live_dGhpcyBpcyBhIHNlY3VyZSByYW5kb20ga2V5"

// Hash untuk storage
const hash = hashApiKey(key);
// => "a1b2c3d4e5f6..." (64 char hex)

// Mask untuk display
const masked = maskApiKey("mk_live_", "abcd");
// => "mk_live_****************************abcd"

// Validasi format
const check = validateApiKeyFormat(key);
// => { valid: true } atau { valid: false, error: "..." }
```

| Function | Purpose |
|----------|---------|
| `generateApiKey()` | Generate random key (256-bit entropy) |
| `hashApiKey(key)` | SHA-256 hash untuk storage |
| `maskApiKey(prefix, last4)` | Mask untuk display aman |
| `getLastFour(key)` | Extract 4 karakter terakhir |
| `validateApiKeyFormat(key)` | Validasi prefix, length, chars |
| `calculateExpirationDate(days)` | Hitung tanggal expired |
| `isExpired(date)` | Check apakah sudah expired |

---

### 2. `apiKeyService.js` - Business Logic

```javascript
// Create new API key
const { plainKey, keyData } = await createApiKey(userId, expiresAt, 'My Key');
// plainKey: "mk_live_xxx..." (SIMPAN INI - hanya muncul sekali!)
// keyData: { id, keyName, maskedKey, status, expiresAt }

// Validate API key
const result = await validateApiKey("mk_live_xxx...");
if (result.valid) {
    console.log(result.data.user);   // { id, name, email, role }
    console.log(result.data.apiKey); // { id, keyName, expiresAt }
} else {
    console.log(result.error);       // "EXPIRED" | "REVOKED" | "INVALID"
}

// Revoke API key
const success = await revokeApiKey(keyId, userId);

// Update usage (async)
updateLastUsed(keyId, clientIp);
```

| Function | Purpose |
|----------|---------|
| `createApiKey(userId, expiresAt, name)` | Generate & store new key |
| `validateApiKey(plainKey)` | Validate key, return user info |
| `revokeApiKey(keyId, userId)` | Soft-delete (set status=revoked) |
| `updateLastUsed(keyId, ip)` | Track usage statistics |
| `getUserApiKeys(userId)` | List all user's keys |

---

### 3. `apiKeyAuth.js` - Authentication Middleware

```javascript
const { authenticateApiKey, optionalApiKey } = require('./middlewares/apiKeyAuth');

// Protected route (WAJIB API key)
app.get('/api/protected', authenticateApiKey, (req, res) => {
    console.log(req.user);   // { id, name, email, role }
    console.log(req.apiKey); // { id, keyName, expiresAt }
});

// Optional auth route
app.get('/api/public', optionalApiKey, (req, res) => {
    if (req.user) {
        // Authenticated
    } else {
        // Anonymous
    }
});
```

**Validation Flow:**
```
┌────────────────────────────────────────────────────────────┐
│  Request with Header: X-MountKey-API-Key                   │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│  1. Extract API key from header                            │
│     ❌ Missing → 401 API_KEY_MISSING                       │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│  2. Validate format (prefix, length, chars)                │
│     ❌ Invalid → 401 API_KEY_INVALID_FORMAT                │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│  3. Hash with SHA-256                                      │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│  4. Query database by hash                                 │
│     ❌ Not found → 401 API_KEY_INVALID                     │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│  5. Check key status                                       │
│     ❌ revoked → 401 API_KEY_REVOKED                       │
│     ❌ expired → 401 API_KEY_EXPIRED                       │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│  6. Check expires_at > NOW()                               │
│     ❌ Expired → 401 API_KEY_EXPIRED (auto-update status)  │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│  7. Check user.status === 'active'                         │
│     ❌ Inactive → 401 USER_INACTIVE                        │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│  8. Update last_used_at (async, non-blocking)              │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│  9. Attach req.user & req.apiKey                           │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│  10. next() → Continue to route handler                    │
└────────────────────────────────────────────────────────────┘
```

---

### 4. `responseHelper.js` - Standardized Responses

```javascript
// Success responses
success(res, data, 'Message', 200);
created(res, data, 'Created');

// Error responses
error(res, 'Error message', 'ERROR_CODE', 400);
unauthorized(res, 'Auth failed', 'AUTH_FAILED');
forbidden(res, 'Access denied', 'ACCESS_DENIED');
notFound(res, 'Not found', 'NOT_FOUND');
validationError(res, [{ field: 'email', message: 'Invalid' }]);

// API Key specific
apiKeyError(res, 'EXPIRED');  // 401 with API_KEY_EXPIRED
```

**Response Format:**
```json
// Success
{
    "success": true,
    "message": "Operation successful",
    "data": { ... },
    "timestamp": "2026-01-10T05:36:24.000Z"
}

// Error
{
    "success": false,
    "message": "API key has expired",
    "error_code": "API_KEY_EXPIRED",
    "timestamp": "2026-01-10T05:36:24.000Z"
}
```

---

## 📝 Contoh Request & Response

### ✅ Valid Request
```http
GET /api/protected HTTP/1.1
Host: localhost:3000
X-MountKey-API-Key: mk_live_dGhpcyBpcyBhIHNlY3VyZSByYW5kb20ga2V5
```

```json
{
    "success": true,
    "message": "Success",
    "data": {
        "user": { "id": 1, "name": "John", "email": "john@example.com" }
    },
    "timestamp": "2026-01-10T05:36:24.000Z"
}
```

### ❌ Missing API Key
```http
GET /api/protected HTTP/1.1
Host: localhost:3000
```

```json
{
    "success": false,
    "message": "API key is required. Provide header: X-MountKey-API-Key",
    "error_code": "API_KEY_MISSING",
    "timestamp": "2026-01-10T05:36:24.000Z"
}
```

### ❌ Expired API Key
```json
{
    "success": false,
    "message": "API key has expired",
    "error_code": "API_KEY_EXPIRED",
    "timestamp": "2026-01-10T05:36:24.000Z"
}
```

---

## 🔒 Security Notes

| # | Practice | Implementation |
|---|----------|----------------|
| 1 | **Never store plain text** | API key di-hash dengan SHA-256 sebelum disimpan |
| 2 | **One-time display** | Plain text key hanya ditampilkan sekali saat generate |
| 3 | **Cryptographically secure** | Generate dengan `crypto.randomBytes(32)` - 256-bit entropy |
| 4 | **Timing-safe comparison** | Hash comparison via database query (tidak manual string compare) |
| 5 | **Non-blocking usage tracking** | `updateLastUsed()` dipanggil async untuk tidak blocking request |

---

## 🎯 Quick Reference

```javascript
// Protect single route
app.get('/api/data', authenticateApiKey, handler);

// Protect route group
router.use(authenticateApiKey);
router.get('/a', handlerA);
router.get('/b', handlerB);

// Optional auth
app.get('/api/public', optionalApiKey, (req, res) => {
    const isAuth = !!req.user;
});

// Access user info in handler
app.get('/api/me', authenticateApiKey, (req, res) => {
    res.json({
        user: req.user,     // { id, name, email, role }
        apiKey: req.apiKey  // { id, keyName, expiresAt }
    });
});
```
