# MountKey Public API v1 - Integration Guide

## 📋 Overview

Dokumentasi integrasi Weather Risk Index ke dalam Public API v1 MountKey.

---

## 🏗️ Struktur File

```
src/
├── controllers/
│   └── weatherRiskController.js   # Controller untuk weather risk
├── routes/
│   └── v1/
│       ├── index.js               # Central v1 router
│       └── weatherRisk.routes.js  # Weather risk routes
└── server.js                      # Updated dengan v1 routes
```

---

## 🔄 Flow Endpoint

```
┌─────────────────────────────────────────────────────────────┐
│  Client Request                                             │
│  GET /v1/mountains/semeru/weather-risk                      │
│  Header: X-MountKey-API-Key: mk_live_xxxxx                  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  server.js                                                  │
│  app.use('/v1', v1Routes)                                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  routes/v1/index.js                                         │
│  1. router.use(authenticateApiKey)  ◄── Auth middleware     │
│  2. router.use('/mountains', weatherRiskRoutes)             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  routes/v1/weatherRisk.routes.js                            │
│  router.get('/:slug/weather-risk', getWeatherRiskBySlug)    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  controllers/weatherRiskController.js                       │
│  1. Extract slug dari params                                │
│  2. Query mountain dari MySQL                               │
│     └─ Not found? → 404 MOUNTAIN_NOT_FOUND                  │
│  3. Call weatherRiskService.getWeatherRisk()                │
│     └─ Service error? → 503 WEATHER_SERVICE_UNAVAILABLE     │
│  4. Return success response                                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Response to Client                                         │
│  {                                                          │
│    "success": true,                                         │
│    "message": "Weather risk retrieved successfully",        │
│    "data": { mountain, weather, risk_index, ... },          │
│    "timestamp": "..."                                       │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 Endpoint

### GET /v1/mountains/:slug/weather-risk

Retrieve weather risk assessment for a specific mountain.

**URL:** `GET /v1/mountains/{slug}/weather-risk`

**Headers:**
```
X-MountKey-API-Key: mk_live_your_api_key_here
```

**Path Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | Yes | Mountain slug (URL-friendly identifier) |

---

## 📝 Contoh Request

### cURL
```bash
curl -X GET "http://localhost:3000/v1/mountains/semeru/weather-risk" \
  -H "X-MountKey-API-Key: mk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
```

### JavaScript (fetch)
```javascript
const response = await fetch('http://localhost:3000/v1/mountains/semeru/weather-risk', {
  method: 'GET',
  headers: {
    'X-MountKey-API-Key': 'mk_live_xxxxxxxxxxxxxxxxxxxxxxxx'
  }
});

const data = await response.json();
console.log(data);
```

### Python (requests)
```python
import requests

url = "http://localhost:3000/v1/mountains/semeru/weather-risk"
headers = {
    "X-MountKey-API-Key": "mk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
}

response = requests.get(url, headers=headers)
print(response.json())
```

---

## ✅ Response Sukses (200 OK)

```json
{
  "success": true,
  "message": "Weather risk retrieved successfully",
  "data": {
    "mountain": {
      "id": 1,
      "name": "Gunung Semeru",
      "elevation_mdpl": 3676
    },
    "weather": {
      "temperature_c": 3.2,
      "feels_like_c": -2.1,
      "wind_speed_kmh": 25,
      "wind_gust_kmh": 45,
      "precipitation_mm": 0.5,
      "precipitation_probability": 60,
      "cloud_cover_percent": 75,
      "freezing_level_mdpl": 4200
    },
    "risk_index": {
      "score": 48,
      "level": "MEDIUM",
      "status": "CAUTION",
      "reasons": [
        "Angin cukup kencang (25 km/jam)",
        "Kemungkinan hujan tinggi (60%)",
        "Suhu dingin (3.2°C)"
      ]
    },
    "recommendation": {
      "summary": "Kondisi cuaca memerlukan kewaspadaan ekstra.",
      "advice": [
        "Persiapkan perlengkapan hujan dan angin",
        "Bawa pakaian hangat cadangan",
        "Siapkan rencana evakuasi jika cuaca memburuk"
      ]
    },
    "meta": {
      "source": "open-meteo",
      "generated_at": "2026-01-10T05:54:39.000Z",
      "valid_for_minutes": 20,
      "elevation_corrected": true
    }
  },
  "timestamp": "2026-01-10T05:54:39.000Z"
}
```

---

## ❌ Error Responses

### 401 - API Key Missing
```json
{
  "success": false,
  "message": "API key is required. Provide header: X-MountKey-API-Key",
  "error_code": "API_KEY_MISSING",
  "timestamp": "2026-01-10T05:54:39.000Z"
}
```

### 401 - API Key Invalid
```json
{
  "success": false,
  "message": "Invalid API key",
  "error_code": "API_KEY_INVALID",
  "timestamp": "2026-01-10T05:54:39.000Z"
}
```

### 401 - API Key Expired
```json
{
  "success": false,
  "message": "API key has expired",
  "error_code": "API_KEY_EXPIRED",
  "timestamp": "2026-01-10T05:54:39.000Z"
}
```

### 404 - Mountain Not Found
```json
{
  "success": false,
  "message": "Mountain 'invalid-slug' not found",
  "error_code": "MOUNTAIN_NOT_FOUND",
  "timestamp": "2026-01-10T05:54:39.000Z"
}
```

### 503 - Weather Service Unavailable
```json
{
  "success": false,
  "message": "Weather service temporarily unavailable. Please try again later.",
  "error_code": "WEATHER_SERVICE_UNAVAILABLE",
  "timestamp": "2026-01-10T05:54:39.000Z"
}
```

---

## 🔑 Authentication

Semua endpoint v1 memerlukan API Key yang valid:

1. Register di `/auth/register` untuk mendapatkan API key
2. Atau login di `/auth/login` untuk melihat API keys yang ada
3. Gunakan API key di header `X-MountKey-API-Key`

**API Key Format:** `mk_live_xxxxxxxxxxxxxxxxxxxxxxxx`

---

## 📊 API Versioning

MountKey menggunakan URL-based versioning:

```
/v1/mountains/:slug/weather-risk
```

**Kenapa URL versioning?**
- Jelas dan eksplisit
- Mudah di-cache
- Easy untuk backward compatibility
- Standard industry (OpenAI, Stripe, dll)

---

## 🚀 Quick Start

```bash
# 1. Register dan dapatkan API key
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# 2. Gunakan API key untuk akses weather risk
curl -X GET http://localhost:3000/v1/mountains/semeru/weather-risk \
  -H "X-MountKey-API-Key: mk_live_your_key_from_step_1"
```

---

## 🔧 Adding New v1 Endpoints

Untuk menambah endpoint baru ke v1:

1. Buat controller di `src/controllers/`
2. Buat route file di `src/routes/v1/`
3. Mount di `src/routes/v1/index.js`

```javascript
// src/routes/v1/index.js
const newFeatureRoutes = require('./newFeature.routes');
router.use('/new-feature', newFeatureRoutes);
```

Auth middleware sudah otomatis apply ke semua v1 routes.
