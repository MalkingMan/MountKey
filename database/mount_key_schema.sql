-- ============================================================
-- MOUNTKEY DATABASE SCHEMA
-- Platform API Data Gunung & Jalur Pendakian Indonesia
-- ============================================================
-- Engine       : MySQL 8+
-- Host         : localhost
-- Port         : 3309
-- User         : root
-- Password     : Ar-ray04
-- Database     : mount_key
-- Charset      : utf8mb4
-- Collation    : utf8mb4_unicode_ci
-- Created      : 2026-01-10
-- ============================================================
--
-- CARA MENJALANKAN:
-- mysql -u root -pAr-ray04 -P 3309 < mount_key_schema.sql
--
-- ============================================================

-- ------------------------------------------------------------
-- DATABASE CREATION
-- ------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS mount_key
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE mount_key;

-- ============================================================
-- TABEL 1: mountains
-- ============================================================
-- Tabel inti yang menyimpan data identitas gunung di Indonesia.
-- Menjadi referensi utama (parent) untuk tabel lainnya.
-- ------------------------------------------------------------
CREATE TABLE mountains (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    
    -- Identitas Gunung
    name VARCHAR(100) NOT NULL COMMENT 'Nama resmi gunung',
    slug VARCHAR(120) NOT NULL COMMENT 'URL-friendly name untuk API endpoint',
    
    -- Lokasi Administratif
    province VARCHAR(100) NOT NULL COMMENT 'Provinsi lokasi gunung',
    regency VARCHAR(100) DEFAULT NULL COMMENT 'Kabupaten/Kota (opsional jika lintas wilayah)',
    
    -- Koordinat Geografis
    latitude DECIMAL(10, 8) NOT NULL COMMENT 'Koordinat lintang (-90 to 90)',
    longitude DECIMAL(11, 8) NOT NULL COMMENT 'Koordinat bujur (-180 to 180)',
    
    -- Data Fisik
    elevation_meters INT UNSIGNED NOT NULL COMMENT 'Ketinggian puncak dalam meter (mdpl)',
    
    -- Klasifikasi Gunung
    mountain_status ENUM('active', 'dormant', 'extinct') NOT NULL DEFAULT 'dormant'
        COMMENT 'Status vulkanik: aktif/tidur/mati',
    mountain_type ENUM('stratovolcano', 'shield', 'caldera', 'complex', 'non_volcanic') 
        NOT NULL DEFAULT 'stratovolcano'
        COMMENT 'Tipe geologi gunung',
    
    -- Kawasan Konservasi
    conservation_area VARCHAR(150) DEFAULT NULL 
        COMMENT 'Nama kawasan konservasi (TN, CA, TWA, dll)',
    conservation_type ENUM('national_park', 'nature_reserve', 'wildlife_sanctuary', 
        'recreation_park', 'hunting_park', 'grand_forest_park', 'none') 
        NOT NULL DEFAULT 'none'
        COMMENT 'Jenis kawasan konservasi',
    
    -- Deskripsi
    description TEXT DEFAULT NULL COMMENT 'Deskripsi umum gunung',
    
    -- Metadata
    is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Status aktif di platform (1=aktif, 0=nonaktif)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    UNIQUE KEY uk_mountains_slug (slug),
    INDEX idx_mountains_province (province),
    INDEX idx_mountains_elevation (elevation_meters),
    INDEX idx_mountains_status (mountain_status),
    INDEX idx_mountains_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Data identitas gunung di Indonesia';

-- ============================================================
-- TABEL 2: trails
-- ============================================================
-- Menyimpan data jalur pendakian untuk setiap gunung.
-- Satu gunung bisa memiliki banyak jalur pendakian.
-- ------------------------------------------------------------
CREATE TABLE trails (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    mountain_id BIGINT UNSIGNED NOT NULL COMMENT 'Referensi ke tabel mountains',
    
    -- Identitas Jalur
    name VARCHAR(100) NOT NULL COMMENT 'Nama jalur pendakian',
    slug VARCHAR(120) NOT NULL COMMENT 'URL-friendly name',
    
    -- Basecamp
    basecamp_name VARCHAR(100) NOT NULL COMMENT 'Nama basecamp/titik awal',
    basecamp_village VARCHAR(100) DEFAULT NULL COMMENT 'Desa lokasi basecamp',
    basecamp_district VARCHAR(100) DEFAULT NULL COMMENT 'Kecamatan lokasi basecamp',
    basecamp_latitude DECIMAL(10, 8) DEFAULT NULL COMMENT 'Koordinat basecamp',
    basecamp_longitude DECIMAL(11, 8) DEFAULT NULL COMMENT 'Koordinat basecamp',
    
    -- Data Teknis Jalur
    distance_km DECIMAL(5, 2) DEFAULT NULL COMMENT 'Panjang jalur dalam kilometer',
    estimated_time_up_hours DECIMAL(4, 1) DEFAULT NULL COMMENT 'Estimasi waktu naik (jam)',
    estimated_time_down_hours DECIMAL(4, 1) DEFAULT NULL COMMENT 'Estimasi waktu turun (jam)',
    
    -- Tingkat Kesulitan
    difficulty_level TINYINT UNSIGNED NOT NULL DEFAULT 3 
        COMMENT 'Tingkat kesulitan 1-5 (1=mudah, 5=ekstrem)',
    
    -- Status Operasional
    trail_status ENUM('open', 'closed', 'restricted', 'maintenance') 
        NOT NULL DEFAULT 'open'
        COMMENT 'Status operasional jalur',
    status_reason VARCHAR(255) DEFAULT NULL COMMENT 'Alasan jika jalur ditutup/dibatasi',
    
    -- Kuota
    daily_quota INT UNSIGNED DEFAULT NULL COMMENT 'Kuota pendaki per hari (NULL = tidak terbatas)',
    
    -- Deskripsi
    description TEXT DEFAULT NULL COMMENT 'Deskripsi jalur pendakian',
    
    -- Metadata
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    UNIQUE KEY uk_trails_slug (slug),
    INDEX idx_trails_mountain (mountain_id),
    INDEX idx_trails_status (trail_status),
    INDEX idx_trails_difficulty (difficulty_level),
    INDEX idx_trails_active (is_active),
    
    CONSTRAINT fk_trails_mountain 
        FOREIGN KEY (mountain_id) REFERENCES mountains(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Data jalur pendakian per gunung';

-- ============================================================
-- TABEL 3: trail_checkpoints
-- ============================================================
-- Menyimpan data pos/checkpoint di sepanjang jalur pendakian.
-- Setiap jalur bisa memiliki banyak checkpoint.
-- ------------------------------------------------------------
CREATE TABLE trail_checkpoints (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    trail_id BIGINT UNSIGNED NOT NULL COMMENT 'Referensi ke tabel trails',
    
    -- Identitas Pos
    name VARCHAR(100) NOT NULL COMMENT 'Nama pos/checkpoint',
    sequence_order TINYINT UNSIGNED NOT NULL COMMENT 'Urutan pos dari basecamp (1, 2, 3...)',
    
    -- Data Geografis
    elevation_meters INT UNSIGNED DEFAULT NULL COMMENT 'Ketinggian pos (mdpl)',
    distance_from_basecamp_km DECIMAL(5, 2) DEFAULT NULL COMMENT 'Jarak dari basecamp (km)',
    
    -- Koordinat (opsional)
    latitude DECIMAL(10, 8) DEFAULT NULL,
    longitude DECIMAL(11, 8) DEFAULT NULL,
    
    -- Fasilitas
    has_water_source TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Ketersediaan sumber air',
    has_shelter TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Ketersediaan shelter/bivak',
    has_camping_ground TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Area camping tersedia',
    
    -- Deskripsi
    description TEXT DEFAULT NULL COMMENT 'Deskripsi singkat pos',
    
    -- Metadata
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    INDEX idx_checkpoints_trail (trail_id),
    INDEX idx_checkpoints_sequence (trail_id, sequence_order),
    INDEX idx_checkpoints_elevation (elevation_meters),
    INDEX idx_checkpoints_water (has_water_source),
    
    CONSTRAINT fk_checkpoints_trail 
        FOREIGN KEY (trail_id) REFERENCES trails(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Data pos/checkpoint per jalur pendakian';

-- ============================================================
-- TABEL 4: mountain_regulations
-- ============================================================
-- Menyimpan data regulasi dan aturan pendakian per gunung.
-- Data ini bersifat administratif dan non-teknis.
-- ------------------------------------------------------------
CREATE TABLE mountain_regulations (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    mountain_id BIGINT UNSIGNED NOT NULL COMMENT 'Referensi ke tabel mountains',
    
    -- Sistem Pendaftaran
    registration_system ENUM('online', 'offline', 'both') NOT NULL DEFAULT 'offline'
        COMMENT 'Sistem pendaftaran pendaki',
    registration_url VARCHAR(255) DEFAULT NULL COMMENT 'URL pendaftaran online (jika ada)',
    
    -- Biaya
    entrance_fee_weekday INT UNSIGNED DEFAULT NULL COMMENT 'Biaya masuk hari kerja (IDR)',
    entrance_fee_weekend INT UNSIGNED DEFAULT NULL COMMENT 'Biaya masuk akhir pekan (IDR)',
    entrance_fee_foreign INT UNSIGNED DEFAULT NULL COMMENT 'Biaya masuk WNA (IDR)',
    porter_fee_per_day INT UNSIGNED DEFAULT NULL COMMENT 'Tarif porter per hari (IDR)',
    
    -- Jam Operasional
    opening_time TIME DEFAULT NULL COMMENT 'Jam buka pendaftaran',
    closing_time TIME DEFAULT NULL COMMENT 'Jam tutup pendaftaran',
    last_entry_time TIME DEFAULT NULL COMMENT 'Batas waktu masuk terakhir',
    
    -- Aturan Wajib
    mandatory_rules TEXT DEFAULT NULL COMMENT 'Aturan wajib pendakian (JSON atau teks)',
    forbidden_items TEXT DEFAULT NULL COMMENT 'Barang yang dilarang dibawa',
    required_equipment TEXT DEFAULT NULL COMMENT 'Perlengkapan wajib',
    
    -- Kontak Darurat
    emergency_contact_name VARCHAR(100) DEFAULT NULL COMMENT 'Nama kontak darurat',
    emergency_contact_phone VARCHAR(20) DEFAULT NULL COMMENT 'Nomor telepon darurat',
    emergency_contact_role VARCHAR(50) DEFAULT NULL COMMENT 'Jabatan kontak darurat',
    
    -- Informasi Tambahan
    special_notes TEXT DEFAULT NULL COMMENT 'Catatan khusus lainnya',
    
    -- Metadata
    last_verified_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Terakhir diverifikasi',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    UNIQUE KEY uk_regulations_mountain (mountain_id),
    INDEX idx_regulations_registration (registration_system),
    INDEX idx_regulations_active (is_active),
    
    CONSTRAINT fk_regulations_mountain 
        FOREIGN KEY (mountain_id) REFERENCES mountains(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Data regulasi dan aturan pendakian per gunung';

-- ============================================================
-- TABEL 5: mountain_weather_meta
-- ============================================================
-- Menyimpan metadata cuaca (non-realtime) untuk setiap gunung.
-- Data bersifat statis dan historis ringan.
-- ------------------------------------------------------------
CREATE TABLE mountain_weather_meta (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    mountain_id BIGINT UNSIGNED NOT NULL COMMENT 'Referensi ke tabel mountains',
    
    -- Musim Terbaik & Terburuk
    best_season_start TINYINT UNSIGNED DEFAULT NULL COMMENT 'Bulan mulai musim terbaik (1-12)',
    best_season_end TINYINT UNSIGNED DEFAULT NULL COMMENT 'Bulan akhir musim terbaik (1-12)',
    worst_season_start TINYINT UNSIGNED DEFAULT NULL COMMENT 'Bulan mulai musim terburuk (1-12)',
    worst_season_end TINYINT UNSIGNED DEFAULT NULL COMMENT 'Bulan akhir musim terburuk (1-12)',
    
    -- Temperatur Rata-rata (Celsius)
    avg_temp_base_min DECIMAL(4, 1) DEFAULT NULL COMMENT 'Suhu min rata-rata di basecamp',
    avg_temp_base_max DECIMAL(4, 1) DEFAULT NULL COMMENT 'Suhu max rata-rata di basecamp',
    avg_temp_summit_min DECIMAL(4, 1) DEFAULT NULL COMMENT 'Suhu min rata-rata di puncak',
    avg_temp_summit_max DECIMAL(4, 1) DEFAULT NULL COMMENT 'Suhu max rata-rata di puncak',
    
    -- Curah Hujan (mm per bulan)
    avg_rainfall_dry_season DECIMAL(6, 1) DEFAULT NULL COMMENT 'Curah hujan rata-rata musim kemarau',
    avg_rainfall_wet_season DECIMAL(6, 1) DEFAULT NULL COMMENT 'Curah hujan rata-rata musim hujan',
    
    -- Rekomendasi Cuaca
    weather_notes TEXT DEFAULT NULL COMMENT 'Catatan cuaca khusus',
    
    -- Metadata
    data_source VARCHAR(100) DEFAULT NULL COMMENT 'Sumber data (BMKG, historis, dll)',
    last_updated_source_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Terakhir update dari sumber',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    UNIQUE KEY uk_weather_mountain (mountain_id),
    INDEX idx_weather_active (is_active),
    
    CONSTRAINT fk_weather_mountain 
        FOREIGN KEY (mountain_id) REFERENCES mountains(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Metadata cuaca statis per gunung (non-realtime)';

-- ============================================================
-- TABEL 6: api_clients
-- ============================================================
-- Menyimpan data client API untuk platform MountKey.
-- Struktur awal untuk monetisasi dan rate limiting.
-- ------------------------------------------------------------
CREATE TABLE api_clients (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    
    -- Identitas Aplikasi
    app_name VARCHAR(100) NOT NULL COMMENT 'Nama aplikasi client',
    app_description TEXT DEFAULT NULL COMMENT 'Deskripsi aplikasi',
    owner_name VARCHAR(100) DEFAULT NULL COMMENT 'Nama pemilik/developer',
    owner_email VARCHAR(150) NOT NULL COMMENT 'Email pemilik',
    
    -- Kredensial API
    api_key VARCHAR(64) NOT NULL COMMENT 'API Key (hashed atau plain)',
    api_secret VARCHAR(128) DEFAULT NULL COMMENT 'API Secret (opsional, untuk OAuth)',
    
    -- Status & Tier
    client_status ENUM('active', 'suspended', 'revoked', 'pending') 
        NOT NULL DEFAULT 'pending'
        COMMENT 'Status client API',
    tier ENUM('free', 'basic', 'pro', 'enterprise') NOT NULL DEFAULT 'free'
        COMMENT 'Tier langganan',
    
    -- Rate Limiting
    rate_limit_per_minute INT UNSIGNED NOT NULL DEFAULT 60 
        COMMENT 'Limit request per menit',
    rate_limit_per_day INT UNSIGNED NOT NULL DEFAULT 1000 
        COMMENT 'Limit request per hari',
    
    -- Usage Tracking
    total_requests BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Total request sepanjang waktu',
    last_request_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Waktu request terakhir',
    
    -- IP & Origin Restriction (opsional)
    allowed_origins TEXT DEFAULT NULL COMMENT 'Daftar origin yang diizinkan (JSON array)',
    allowed_ips TEXT DEFAULT NULL COMMENT 'Daftar IP yang diizinkan (JSON array)',
    
    -- Metadata
    expires_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Tanggal kadaluarsa API key',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    UNIQUE KEY uk_api_clients_key (api_key),
    UNIQUE KEY uk_api_clients_email (owner_email),
    INDEX idx_api_clients_status (client_status),
    INDEX idx_api_clients_tier (tier),
    INDEX idx_api_clients_last_request (last_request_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Data client API untuk platform MountKey';

-- ============================================================
-- SELESAI
-- ============================================================
-- Schema MountKey berhasil dibuat dengan 6 tabel:
-- 1. mountains            - Data identitas gunung
-- 2. trails               - Data jalur pendakian
-- 3. trail_checkpoints    - Data pos/checkpoint jalur
-- 4. mountain_regulations - Data regulasi pendakian
-- 5. mountain_weather_meta- Metadata cuaca statis
-- 6. api_clients          - Data client API platform
-- ============================================================
