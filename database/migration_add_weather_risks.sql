-- Migration: Add weather_risks column to mountain_weather_meta
-- Tujuannya untuk menyimpan array risiko dominan (e.g. ["Strong Winds", "Fog"])

ALTER TABLE mountain_weather_meta
ADD COLUMN weather_risks TEXT DEFAULT NULL COMMENT 'JSON Array risiko cuaca dominan';
