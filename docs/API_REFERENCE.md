# MountKey API v1 - Quick Reference

## 🔐 Authentication

Semua endpoint v1 memerlukan API Key di header:

```
X-MountKey-API-Key: mk_live_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📡 Endpoints

### Base URL
```
http://localhost:3000
```

---

## 🏔️ Mountains

### List All Mountains

```bash
curl -X GET "http://localhost:3000/v1/mountains" \
  -H "X-MountKey-API-Key: YOUR_API_KEY"
```

**With Pagination & Filtering:**
```bash
curl -X GET "http://localhost:3000/v1/mountains?page=1&limit=10&province=Jawa%20Timur&sort=elevation_meters&order=desc" \
  -H "X-MountKey-API-Key: YOUR_API_KEY"
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `limit` | int | 20 | Items per page (max: 100) |
| `province` | string | - | Filter by province |
| `status` | enum | - | active, dormant, extinct |
| `sort` | string | name | name, elevation_meters, province, created_at |
| `order` | string | asc | asc, desc |

---

### Get Mountain Detail

```bash
curl -X GET "http://localhost:3000/v1/mountains/semeru" \
  -H "X-MountKey-API-Key: YOUR_API_KEY"
```

---

### Get Mountain Trails

```bash
curl -X GET "http://localhost:3000/v1/mountains/semeru/trails" \
  -H "X-MountKey-API-Key: YOUR_API_KEY"
```

---

### Get Weather Risk

```bash
curl -X GET "http://localhost:3000/v1/mountains/semeru/weather-risk" \
  -H "X-MountKey-API-Key: YOUR_API_KEY"
```

---

## 🥾 Trails

### Get Trail Detail

```bash
curl -X GET "http://localhost:3000/v1/trails/semeru-via-ranu-pane" \
  -H "X-MountKey-API-Key: YOUR_API_KEY"
```

---

## 📝 Response Examples

### Success Response

```json
{
  "success": true,
  "message": "Mountains retrieved successfully",
  "data": {
    "mountains": [...],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total_items": 50,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    }
  },
  "timestamp": "2026-01-10T06:02:16.000Z"
}
```

### Error Responses

**401 - API Key Missing**
```json
{
  "success": false,
  "message": "API key is required. Provide header: X-MountKey-API-Key",
  "error_code": "API_KEY_MISSING",
  "timestamp": "2026-01-10T06:02:16.000Z"
}
```

**401 - API Key Invalid**
```json
{
  "success": false,
  "message": "Invalid API key",
  "error_code": "API_KEY_INVALID",
  "timestamp": "2026-01-10T06:02:16.000Z"
}
```

**404 - Mountain Not Found**
```json
{
  "success": false,
  "message": "Mountain 'invalid-slug' not found",
  "error_code": "MOUNTAIN_NOT_FOUND",
  "timestamp": "2026-01-10T06:02:16.000Z"
}
```

**503 - Weather Service Unavailable**
```json
{
  "success": false,
  "message": "Weather service temporarily unavailable. Please try again later.",
  "error_code": "WEATHER_SERVICE_UNAVAILABLE",
  "timestamp": "2026-01-10T06:02:16.000Z"
}
```

---

## 🔧 Code Examples

### JavaScript (fetch)

```javascript
const API_KEY = 'mk_live_xxxxxxxxxxxxxxxxxxxxxxxx';
const BASE_URL = 'http://localhost:3000';

async function getMountains() {
  const response = await fetch(`${BASE_URL}/v1/mountains`, {
    headers: {
      'X-MountKey-API-Key': API_KEY
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Mountains:', data.data.mountains);
  } else {
    console.error('Error:', data.message);
  }
}
```

### Python (requests)

```python
import requests

API_KEY = 'mk_live_xxxxxxxxxxxxxxxxxxxxxxxx'
BASE_URL = 'http://localhost:3000'

headers = {
    'X-MountKey-API-Key': API_KEY
}

# Get mountain weather risk
response = requests.get(
    f'{BASE_URL}/v1/mountains/semeru/weather-risk',
    headers=headers
)

data = response.json()

if data['success']:
    risk = data['data']['risk_index']
    print(f"Risk Score: {risk['score']}")
    print(f"Level: {risk['level']}")
    print(f"Status: {risk['status']}")
    for reason in risk['reasons']:
        print(f"  - {reason}")
else:
    print(f"Error: {data['message']}")
```

### PHP (cURL)

```php
<?php
$apiKey = 'mk_live_xxxxxxxxxxxxxxxxxxxxxxxx';
$baseUrl = 'http://localhost:3000';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "$baseUrl/v1/mountains");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-MountKey-API-Key: $apiKey"
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if ($data['success']) {
    foreach ($data['data']['mountains'] as $mountain) {
        echo $mountain['name'] . ' - ' . $mountain['elevation_meters'] . "m\n";
    }
}
?>
```

---

## 📊 Risk Level Reference

| Score | Level | Status | Meaning |
|-------|-------|--------|---------|
| 0-30 | LOW | SAFE | Kondisi aman untuk pendakian |
| 31-60 | MEDIUM | CAUTION | Perlu kewaspadaan ekstra |
| 61-80 | HIGH | NOT_RECOMMENDED | Tidak disarankan mendaki |
| 81-100 | EXTREME | NOT_RECOMMENDED | Berbahaya, jangan mendaki |

---

## 📄 OpenAPI Specification

Full OpenAPI spec tersedia di: `docs/openapi.v1.yaml`

Gunakan dengan Swagger UI atau tools lain yang mendukung OpenAPI 3.0.
