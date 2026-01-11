-- Update tabel mountain_weather_meta untuk mendukung automation
-- Menambahkan kolom tracking sumber data dan logs

ALTER TABLE mountain_weather_meta
ADD COLUMN season_source ENUM('auto', 'manual') NOT NULL DEFAULT 'auto' COMMENT 'Sumber penentuan musim',
ADD COLUMN last_calculated_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Waktu terakhir script berjalan',
ADD COLUMN calculation_notes TEXT DEFAULT NULL COMMENT 'Log detail perhitungan (JSON/Text)';
