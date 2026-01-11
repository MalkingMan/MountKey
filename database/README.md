# MountKey Database Schema

## 📋 Overview

MountKey adalah API-first platform yang menyediakan data gunung dan jalur pendakian di Indonesia. Database ini dirancang untuk:

- **REST API** - Struktur yang mudah di-query dan di-serialize ke JSON
- **Scalability** - Normalisasi yang baik untuk pertumbuhan data
- **Monetisasi** - Support untuk API clients dengan rate limiting
- **Integrasi** - Siap untuk integrasi cuaca realtime (Open-Meteo)

---

## 🗄️ Database Configuration

| Parameter | Value |
|-----------|-------|
| Engine | MySQL 8+ |
| Host | localhost |
| Port | 3309 |
| User | root |
| Database | mount_key |
| Charset | utf8mb4 |
| Collation | utf8mb4_unicode_ci |

---

## 📊 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                              mountains                               │
│  (id, name, slug, province, latitude, longitude, elevation, ...)    │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
          ┌─────────────────────┼─────────────────────┬───────────────────────┐
          │                     │                     │                       │
          ▼                     ▼                     ▼                       ▼
┌─────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────┐
│     trails      │   │ mountain_regulations │   │ mountain_weather_   │   │   api_clients   │
│ (mountain_id)   │   │    (mountain_id)     │   │        meta         │   │   (standalone)  │
└────────┬────────┘   └─────────────────────┘   │    (mountain_id)    │   └─────────────────┘
         │                                       └─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  trail_checkpoints  │
│     (trail_id)      │
└─────────────────────┘
```

---

## 📑 Tabel & Penjelasan

### 1. `mountains` - Data Inti Gunung

**Fungsi:** Menyimpan data identitas lengkap gunung di Indonesia.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | BIGINT | Primary key auto increment |
| `name` | VARCHAR(100) | Nama resmi gunung |
| `slug` | VARCHAR(120) | URL-friendly name untuk endpoint |
| `province` | VARCHAR(100) | Provinsi lokasi gunung |
| `regency` | VARCHAR(100) | Kabupaten/Kota (nullable) |
| `latitude` | DECIMAL(10,8) | Koordinat lintang |
| `longitude` | DECIMAL(11,8) | Koordinat bujur |
| `elevation_meters` | INT | Ketinggian puncak (mdpl) |
| `mountain_status` | ENUM | active/dormant/extinct |
| `mountain_type` | ENUM | stratovolcano/shield/caldera/complex/non_volcanic |
| `conservation_area` | VARCHAR(150) | Nama kawasan konservasi |
| `conservation_type` | ENUM | Jenis kawasan (TN, CA, TWA, dll) |
| `description` | TEXT | Deskripsi umum |
| `is_active` | TINYINT | Status aktif di platform |
| `created_at` | TIMESTAMP | Waktu pembuatan |
| `updated_at` | TIMESTAMP | Waktu update terakhir |

**Indexes:**
- `uk_mountains_slug` - Unique slug
- `idx_mountains_province` - Filter by province
- `idx_mountains_elevation` - Sort/filter by height
- `idx_mountains_status` - Filter by volcanic status

---

### 2. `trails` - Jalur Pendakian

**Fungsi:** Menyimpan data jalur pendakian untuk setiap gunung. Satu gunung bisa memiliki banyak jalur.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | BIGINT | Primary key |
| `mountain_id` | BIGINT | FK → mountains.id |
| `name` | VARCHAR(100) | Nama jalur pendakian |
| `slug` | VARCHAR(120) | URL-friendly name |
| `basecamp_name` | VARCHAR(100) | Nama basecamp |
| `basecamp_village` | VARCHAR(100) | Desa basecamp |
| `basecamp_district` | VARCHAR(100) | Kecamatan basecamp |
| `basecamp_latitude` | DECIMAL(10,8) | Koordinat basecamp |
| `basecamp_longitude` | DECIMAL(11,8) | Koordinat basecamp |
| `distance_km` | DECIMAL(5,2) | Panjang jalur (km) |
| `estimated_time_up_hours` | DECIMAL(4,1) | Estimasi waktu naik (jam) |
| `estimated_time_down_hours` | DECIMAL(4,1) | Estimasi waktu turun (jam) |
| `difficulty_level` | TINYINT | Tingkat kesulitan 1-5 |
| `trail_status` | ENUM | open/closed/restricted/maintenance |
| `status_reason` | VARCHAR(255) | Alasan status |
| `daily_quota` | INT | Kuota pendaki per hari |
| `description` | TEXT | Deskripsi jalur |

**Relasi:** `trails.mountain_id` → `mountains.id` (ON DELETE CASCADE)

---

### 3. `trail_checkpoints` - Pos/Checkpoint

**Fungsi:** Menyimpan data pos-pos di sepanjang jalur pendakian.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | BIGINT | Primary key |
| `trail_id` | BIGINT | FK → trails.id |
| `name` | VARCHAR(100) | Nama pos |
| `sequence_order` | TINYINT | Urutan pos (1, 2, 3...) |
| `elevation_meters` | INT | Ketinggian pos (mdpl) |
| `distance_from_basecamp_km` | DECIMAL(5,2) | Jarak dari basecamp |
| `latitude` | DECIMAL(10,8) | Koordinat pos |
| `longitude` | DECIMAL(11,8) | Koordinat pos |
| `has_water_source` | TINYINT | Ada sumber air? |
| `has_shelter` | TINYINT | Ada shelter/bivak? |
| `has_camping_ground` | TINYINT | Bisa camping? |
| `description` | TEXT | Deskripsi pos |

**Relasi:** `trail_checkpoints.trail_id` → `trails.id` (ON DELETE CASCADE)

---

### 4. `mountain_regulations` - Regulasi Pendakian

**Fungsi:** Menyimpan aturan, biaya, dan informasi administratif pendakian.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | BIGINT | Primary key |
| `mountain_id` | BIGINT | FK → mountains.id (unique) |
| `registration_system` | ENUM | online/offline/both |
| `registration_url` | VARCHAR(255) | URL pendaftaran online |
| `entrance_fee_weekday` | INT | Biaya masuk hari kerja (IDR) |
| `entrance_fee_weekend` | INT | Biaya masuk weekend (IDR) |
| `entrance_fee_foreign` | INT | Biaya masuk WNA (IDR) |
| `porter_fee_per_day` | INT | Tarif porter/hari (IDR) |
| `opening_time` | TIME | Jam buka |
| `closing_time` | TIME | Jam tutup |
| `last_entry_time` | TIME | Batas masuk terakhir |
| `mandatory_rules` | TEXT | Aturan wajib |
| `forbidden_items` | TEXT | Barang terlarang |
| `required_equipment` | TEXT | Perlengkapan wajib |
| `emergency_contact_name` | VARCHAR(100) | Nama kontak darurat |
| `emergency_contact_phone` | VARCHAR(20) | Nomor telepon darurat |
| `emergency_contact_role` | VARCHAR(50) | Jabatan kontak darurat |
| `last_verified_at` | TIMESTAMP | Terakhir diverifikasi |

**Relasi:** `mountain_regulations.mountain_id` → `mountains.id` (ON DELETE CASCADE, 1:1)

---

### 5. `mountain_weather_meta` - Metadata Cuaca

**Fungsi:** Menyimpan data cuaca statis/historis (bukan realtime).

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | BIGINT | Primary key |
| `mountain_id` | BIGINT | FK → mountains.id (unique) |
| `best_season_start` | TINYINT | Bulan awal musim terbaik (1-12) |
| `best_season_end` | TINYINT | Bulan akhir musim terbaik |
| `worst_season_start` | TINYINT | Bulan awal musim terburuk |
| `worst_season_end` | TINYINT | Bulan akhir musim terburuk |
| `avg_temp_base_min` | DECIMAL(4,1) | Suhu min basecamp (°C) |
| `avg_temp_base_max` | DECIMAL(4,1) | Suhu max basecamp (°C) |
| `avg_temp_summit_min` | DECIMAL(4,1) | Suhu min puncak (°C) |
| `avg_temp_summit_max` | DECIMAL(4,1) | Suhu max puncak (°C) |
| `avg_rainfall_dry_season` | DECIMAL(6,1) | Curah hujan musim kemarau (mm) |
| `avg_rainfall_wet_season` | DECIMAL(6,1) | Curah hujan musim hujan (mm) |
| `weather_notes` | TEXT | Catatan cuaca khusus |
| `data_source` | VARCHAR(100) | Sumber data (BMKG, dll) |

**Relasi:** `mountain_weather_meta.mountain_id` → `mountains.id` (ON DELETE CASCADE, 1:1)

---

### 6. `api_clients` - Client API Platform

**Fungsi:** Menyimpan data aplikasi client yang menggunakan API MountKey.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | BIGINT | Primary key |
| `app_name` | VARCHAR(100) | Nama aplikasi |
| `app_description` | TEXT | Deskripsi aplikasi |
| `owner_name` | VARCHAR(100) | Nama developer/pemilik |
| `owner_email` | VARCHAR(150) | Email pemilik (unique) |
| `api_key` | VARCHAR(64) | API Key (unique) |
| `api_secret` | VARCHAR(128) | API Secret (opsional) |
| `client_status` | ENUM | active/suspended/revoked/pending |
| `tier` | ENUM | free/basic/pro/enterprise |
| `rate_limit_per_minute` | INT | Limit per menit |
| `rate_limit_per_day` | INT | Limit per hari |
| `total_requests` | BIGINT | Total request kumulatif |
| `last_request_at` | TIMESTAMP | Waktu request terakhir |
| `allowed_origins` | TEXT | Allowed CORS origins (JSON) |
| `allowed_ips` | TEXT | Allowed IPs (JSON) |
| `expires_at` | TIMESTAMP | Tanggal kadaluarsa |

**Catatan:** Tabel ini standalone (tidak berelasi dengan tabel lain).

---

## 🚀 Quick Start

### Menjalankan Schema

```bash
mysql -u root -p -P 3309 < mount_key_schema.sql
```

### Atau melalui MySQL Client

```sql
SOURCE /path/to/mount_key_schema.sql;
```

---

## 📐 Design Principles Applied

| Prinsip | Implementasi |
|---------|-------------|
| ✅ snake_case | Semua nama tabel dan kolom |
| ✅ BIGINT PK | Auto increment untuk semua primary key |
| ✅ Foreign Key | ON DELETE CASCADE untuk integritas |
| ✅ Timestamps | created_at & updated_at di semua tabel |
| ✅ ENUM minimal | Hanya untuk kolom dengan nilai tetap |
| ✅ Indexed | Index untuk kolom yang sering di-query |
| ✅ Normalized | Data terpecah sesuai domain |
| ✅ API-friendly | Slug, status, dan struktur yang mudah di-serialize |

---

## 🔮 Future Development

Database ini siap untuk:

1. **REST API Versioning** - Struktur sudah mendukung backward compatibility
2. **Rate Limiting** - Kolom rate limit sudah tersedia di `api_clients`
3. **Weather Integration** - `mountain_weather_meta` bisa di-extend untuk cache data realtime
4. **Analytics** - `api_clients.total_requests` siap untuk usage tracking
5. **Multi-tenant** - Struktur `api_clients` mendukung banyak aplikasi

---

## 📝 License

MountKey Database Schema - © 2026
