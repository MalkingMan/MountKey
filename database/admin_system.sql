-- ============================================================
-- MOUNTKEY ADMIN SYSTEM
-- Sistem Autentikasi Admin Terpisah dari User
-- ============================================================
-- Host         : localhost
-- Port         : 3309
-- User         : root
-- Password     : Ar-ray04
-- Database     : mount_key
-- ============================================================

USE mount_key;

-- ============================================================
-- TABEL: admins
-- ============================================================
-- Menyimpan data admin platform MountKey.
-- TERPISAH dari tabel users (untuk API consumers).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    
    -- Identitas Admin
    name VARCHAR(100) NOT NULL COMMENT 'Nama lengkap admin',
    email VARCHAR(150) NOT NULL COMMENT 'Email admin (unique, untuk login)',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Password yang di-hash (bcrypt)',
    
    -- Status
    status ENUM('active', 'suspended') NOT NULL DEFAULT 'active'
        COMMENT 'Status akun: active/suspended',
    
    -- Permissions (JSON array of permissions)
    permissions TEXT DEFAULT NULL COMMENT 'Daftar permission admin (JSON)',
    
    -- Session
    last_login_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Waktu login terakhir',
    last_login_ip VARCHAR(45) DEFAULT NULL COMMENT 'IP login terakhir',
    
    -- Metadata
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    UNIQUE KEY uk_admins_email (email),
    INDEX idx_admins_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Data admin platform MountKey (terpisah dari users)';

-- ============================================================
-- SELESAI
-- ============================================================
