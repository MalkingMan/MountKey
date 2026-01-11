# MountKey Weather Risk Index Service

## 📋 Overview

Weather Risk Index adalah **killer feature** MountKey yang memberikan penilaian risiko cuaca untuk pendakian gunung berdasarkan:

- Data cuaca realtime dari Open-Meteo
- Koreksi suhu berdasarkan elevasi
- Scoring multi-faktor dengan bobot
- Rekomendasi yang dapat dijelaskan (explainable)

---

## 🏗️ Struktur File

```
src/
├── services/
│   ├── openMeteoClient.js      # Client untuk Open-Meteo API
│   └── weatherRiskService.js   # Main service dengan caching
├── utils/
│   ├── elevationUtils.js       # Koreksi suhu & wind chill
│   └── riskScoringUtils.js     # Risk scoring engine
└── routes/
    └── weatherRiskRoutes.js    # API endpoint
```

---

## 🌐 Endpoint

```
GET /v1/mountains/{slug}/weather-risk
```

### Headers
```
X-MountKey-API-Key: mk_live_xxxxxxxxxxxxxxxx
```

### Parameters
| Param | Type | Description |
|-------|------|-------------|
| `slug` | path | Mountain slug (URL-friendly name) |

---

## 📤 Response Format

```json
{
  "success": true,
  "message": "Success",
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
      "generated_at": "2026-01-10T05:46:32.000Z",
      "valid_for_minutes": 20,
      "elevation_corrected": true
    }
  },
  "timestamp": "2026-01-10T05:46:32.000Z"
}
```

---

## 🧮 Risk Scoring System

### Bobot Faktor (Total = 100)

| Faktor | Bobot | Deskripsi |
|--------|-------|-----------|
| **Angin** | 25 | Kecepatan & gust angin |
| **Hujan** | 30 | Curah hujan & probabilitas |
| **Suhu** | 20 | Suhu terkoreksi di puncak |
| **Freezing Level** | 15 | Posisi puncak vs freezing level |
| **Visibilitas** | 10 | Cloud cover |

### Level Risiko

| Score | Level | Status | Arti |
|-------|-------|--------|------|
| 0-30 | `LOW` | `SAFE` | Kondisi aman untuk pendakian |
| 31-60 | `MEDIUM` | `CAUTION` | Perlu kewaspadaan ekstra |
| 61-80 | `HIGH` | `NOT_RECOMMENDED` | Tidak disarankan mendaki |
| 81-100 | `EXTREME` | `NOT_RECOMMENDED` | Berbahaya, jangan mendaki |

---

## 🌡️ Elevation Correction

Suhu dikoreksi menggunakan **Environmental Lapse Rate**:

```
Suhu turun 0.6°C setiap kenaikan 100 meter
```

**Formula:**
```javascript
corrected_temp = api_temp - ((elevation / 100) * 0.6)
```

**Contoh:**
- API memberikan suhu 20°C (di permukaan laut)
- Gunung Semeru (3676m)
- Koreksi: 3676 / 100 × 0.6 = 22.06°C
- Suhu di puncak: 20 - 22.06 = **-2.06°C**

---

## 🔄 Scoring Logic Detail

### 1. Wind Score (Max 25)

```javascript
// Threshold (km/jam)
< 15   → 0 points (safe)
15-30  → 5 points (moderate)
30-50  → 12.5 points (high)
50-70  → 20 points (very high)
> 70   → 25 points (extreme)
```

**Reason added when:**
- ≥ 30 km/h: "Angin kencang (X km/jam)"
- ≥ 50 km/h: "Angin sangat kencang - BERBAHAYA"

### 2. Precipitation Score (Max 30)

```javascript
// Threshold (mm)
< 0.5  → 0 points
0.5-2.5 → 6 points
2.5-7.5 → 15 points
7.5-15  → 24 points
> 15   → 30 points

// Probability boost (jika tidak hujan)
> 80%  → +12 points
50-80% → +6 points
```

### 3. Temperature Score (Max 20)

```javascript
// Threshold (°C di puncak)
< 0°C  → 20 points (freezing)
0-5°C  → 14 points (very cold)
5-10°C → 8 points (cold)
> 35°C → 10 points (heat risk)
```

### 4. Freezing Level Score (Max 15)

```javascript
// Jarak puncak dari freezing level
Puncak > 500m di atas → 15 points
Puncak 200-500m di atas → 10.5 points
Puncak 0-200m di atas → 6 points
Puncak di bawah → 0 points
```

### 5. Visibility Score (Max 10)

```javascript
// Cloud cover (%)
> 95%  → 10 points (overcast)
80-95% → 6 points (cloudy)
50-80% → 3 points (partly cloudy)
< 50%  → 0 points (clear)
```

---

## 💾 Caching Strategy

- **Type:** In-memory cache (Map)
- **TTL:** 20 menit
- **Key format:** `weather_risk:{mountain_id}`
- **Max entries:** 500

```javascript
// Cache invalidation
- Automatic expiry setelah TTL
- Manual clear via clearCache()
```

**Kenapa 20 menit?**
- Cukup sering untuk perubahan cuaca signifikan
- Mengurangi beban ke Open-Meteo
- Konsisten dengan refresh rate Open-Meteo

---

## 📝 Error Responses

### Mountain Not Found
```json
{
  "success": false,
  "message": "Mountain 'invalid-slug' not found",
  "error_code": "MOUNTAIN_NOT_FOUND",
  "timestamp": "..."
}
```
**Status: 404**

### Weather Service Unavailable
```json
{
  "success": false,
  "message": "Weather service temporarily unavailable",
  "error_code": "WEATHER_TIMEOUT",
  "timestamp": "..."
}
```
**Status: 503**

### API Key Invalid
```json
{
  "success": false,
  "message": "Invalid API key",
  "error_code": "API_KEY_INVALID",
  "timestamp": "..."
}
```
**Status: 401**

---

## 🔧 Component Details

### 1. `openMeteoClient.js`

```javascript
// Fetch weather data
const weather = await fetchCurrentWeather(latitude, longitude);

// Returns:
{
  temperature_2m: 25.5,
  apparent_temperature: 24.2,
  wind_speed_10m: 15.3,
  wind_gusts_10m: 28.1,
  precipitation: 0.5,
  precipitation_probability: 60,
  cloud_cover: 75,
  freezing_level_height: 4200
}
```

**Features:**
- Timeout 10 detik
- Error normalization
- Response validation

### 2. `elevationUtils.js`

```javascript
// Koreksi suhu
correctTemperatureForElevation(20, 3676); // → -2.06

// Wind chill
calculateWindChill(5, 30); // → -1.2

// Check freezing
isAboveFreezingLevel(3676, 4200); // → false
```

### 3. `riskScoringUtils.js`

```javascript
// Calculate risk
const result = calculateRiskScore({
  windSpeed: 25,
  windGust: 45,
  precipitation: 0.5,
  precipProbability: 60,
  temperature: 3.2,
  elevation: 3676,
  freezingLevel: 4200,
  cloudCover: 75
});

// Returns:
{
  score: 48,
  level: 'MEDIUM',
  status: 'CAUTION',
  reasons: ['...', '...'],
  breakdown: { ... }
}

// Generate recommendation
const rec = generateRecommendation('MEDIUM', reasons);
// { summary: '...', advice: ['...'] }
```

### 4. `weatherRiskService.js`

```javascript
// Get weather risk (with caching)
const risk = await getWeatherRisk({
  id: 1,
  name: 'Gunung Semeru',
  latitude: -8.1077,
  longitude: 112.9220,
  elevation_meters: 3676
});

// Cache management
clearCache();
getCacheStats(); // { size, maxSize, ttlMinutes }
```

---

## 🚀 Quick Test

```bash
# Dengan cURL
curl -X GET "http://localhost:3000/v1/mountains/semeru/weather-risk" \
  -H "X-MountKey-API-Key: mk_live_your_api_key_here"
```

---

## 📊 Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Client Request                                             │
│  GET /v1/mountains/semeru/weather-risk                      │
│  Header: X-MountKey-API-Key                                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  API Key Authentication Middleware                          │
│  - Validate API key                                         │
│  - Attach user to request                                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Weather Risk Route                                         │
│  1. Get mountain from MySQL by slug                         │
│  2. Call weatherRiskService.getWeatherRisk()                │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Weather Risk Service                                       │
│  1. Check cache                                             │
│     ├─ HIT: Return cached response                          │
│     └─ MISS: Continue                                       │
│  2. Fetch from Open-Meteo                                   │
│  3. Apply elevation correction                              │
│  4. Calculate risk score                                    │
│  5. Generate recommendations                                │
│  6. Cache result                                            │
│  7. Return response                                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Response to Client                                         │
│  {                                                          │
│    "mountain": { ... },                                     │
│    "weather": { ... },                                      │
│    "risk_index": { score, level, status, reasons },         │
│    "recommendation": { summary, advice },                   │
│    "meta": { source, generated_at, valid_for_minutes }      │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Considerations

1. **No raw Open-Meteo exposure** - Response selalu ditransform
2. **No weather storage in DB** - Stateless, hanya cache
3. **Rate limiting by API key** - (future implementation)
4. **Error sanitization** - Internal errors tidak di-expose
5. **Timeout protection** - 10 detik max untuk Open-Meteo

---

## 🎯 Design Principles

| Principle | Implementation |
|-----------|----------------|
| Stateless | Tidak simpan cuaca ke DB |
| Explainable | Setiap risiko punya reason |
| Cacheable | In-memory cache 20 menit |
| Fail-safe | Graceful error handling |
| Scalable | Ready untuk Redis cache |
