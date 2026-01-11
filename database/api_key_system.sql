-- ============================================================
-- MOUNTKEY API KEY SYSTEM
-- Sistem Autentikasi API Key dengan Expiration Date
-- ============================================================
-- Host         : localhost
-- Port         : 3309
-- User         : root
-- Password     : Ar-ray04
-- Database     : mount_key
-- ============================================================
--
-- CARA MENJALANKAN:
-- mysql -u root -pAr-ray04 -P 3309 < api_key_system.sql
--
-- ============================================================

USE mount_key;

-- ============================================================
-- TABEL: users
-- ============================================================
-- Menyimpan data pengguna platform MountKey.
-- User dapat memiliki banyak API key.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    
    -- Identitas User
    name VARCHAR(100) NOT NULL COMMENT 'Nama lengkap user',
    email VARCHAR(150) NOT NULL COMMENT 'Email user (unique, untuk login)',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Password yang di-hash (bcrypt)',
    
    -- Role & Status
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user' 
        COMMENT 'Role: user biasa atau admin',
    status ENUM('active', 'suspended', 'pending') NOT NULL DEFAULT 'pending'
        COMMENT 'Status akun: active/suspended/pending verification',
    
    -- Email Verification
    email_verified_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Waktu verifikasi email',
    
    -- Metadata
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email),
    INDEX idx_users_status (status),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Data pengguna platform MountKey';

-- ============================================================
-- TABEL: api_keys
-- ============================================================
-- Menyimpan API key yang di-hash.
-- API key asli TIDAK PERNAH disimpan, hanya hash-nya.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_keys (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL COMMENT 'Pemilik API key',
    
    -- API Key Data (HASHED)
    api_key_hash VARCHAR(64) NOT NULL COMMENT 'SHA-256 hash dari API key',
    api_key_prefix VARCHAR(8) NOT NULL COMMENT 'Prefix untuk identifikasi (mk_live_)',
    api_key_last_four VARCHAR(4) NOT NULL COMMENT '4 karakter terakhir untuk display',
    
    -- Naming
    key_name VARCHAR(50) DEFAULT 'Default Key' COMMENT 'Nama key untuk identifikasi user',
    
    -- Status
    status ENUM('active', 'revoked', 'expired') NOT NULL DEFAULT 'active'
        COMMENT 'Status API key',
    
    -- Expiration
    expires_at TIMESTAMP NOT NULL COMMENT 'Tanggal kadaluarsa API key',
    
    -- Usage Tracking
    last_used_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Terakhir digunakan',
    last_used_ip VARCHAR(45) DEFAULT NULL COMMENT 'IP terakhir yang menggunakan',
    
    -- Metadata
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Waktu pencabutan (jika revoked)',
    
    PRIMARY KEY (id),
    UNIQUE KEY uk_api_keys_hash (api_key_hash),
    INDEX idx_api_keys_user (user_id),
    INDEX idx_api_keys_status (status),
    INDEX idx_api_keys_expires (expires_at),
    INDEX idx_api_keys_prefix (api_key_prefix),
    
    CONSTRAINT fk_api_keys_user 
        FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='API keys dengan hash (key asli tidak disimpan)';

-- ============================================================
-- SELESAI
-- ============================================================
-- Tabel yang dibuat:
-- 1. users      - Data pengguna platform
-- 2. api_keys   - API keys dengan hash & expiration
-- ============================================================
