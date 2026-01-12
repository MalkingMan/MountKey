/**
 * ============================================================
 * MOUNTKEY - ELEVATION UTILITIES
 * ============================================================
 * Utility functions untuk kalkulasi berbasis elevasi.
 * 
 * KEY CONCEPT:
 * Suhu udara turun ~0.6°C setiap kenaikan 100 meter
 * (Environmental Lapse Rate)
 * ============================================================
 */

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
    // Environmental Lapse Rate: 0.65°C per 100m (ISA standard)
    LAPSE_RATE_PER_100M: 0.65,

    // Open-Meteo provides data at coordinate elevation
    // So we only apply a SMALL correction for summit vs base area
    // Typical weather station is at basecamp (~2000-3000m below summit)
    SUMMIT_CORRECTION_FACTOR: 0.3, // Only 30% of full lapse rate

    // Minimum freezing temperature
    FREEZING_POINT_C: 0,

    // Maximum reasonable correction (cap to prevent extreme values)
    MAX_TEMP_CORRECTION: 15 // Max 15°C correction
};

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * Koreksi suhu untuk puncak gunung
 * 
 * IMPORTANT: Open-Meteo sudah memberikan suhu di koordinat gunung,
 * BUKAN di permukaan laut. Jadi kita hanya perlu koreksi kecil
 * untuk perbedaan antara area basecamp dan puncak.
 * 
 * Formula baru:
 * - Untuk gunung < 4000m: koreksi minimal (data sudah akurat)
 * - Untuk gunung > 4000m: koreksi 30% dari lapse rate untuk summit
 * 
 * @param {number} apiTemperature - Suhu dari Open-Meteo (°C)
 * @param {number} elevation - Elevasi puncak (mdpl)
 * @returns {number} Suhu terkoreksi (°C)
 */
function correctTemperatureForElevation(apiTemperature, elevation) {
    if (typeof apiTemperature !== 'number' || apiTemperature === null) {
        return null;
    }

    // Open-Meteo sudah memberikan data di koordinat gunung
    // Koreksi hanya untuk estimasi puncak vs area pengukuran

    let tempCorrection = 0;

    if (elevation > 4000) {
        // Untuk gunung sangat tinggi (>4000m)
        // Asumsi: data API di ~60% ketinggian, perlu koreksi ke puncak
        const estimatedMeasurementElevation = elevation * 0.6;
        const elevationDiff = elevation - estimatedMeasurementElevation;
        tempCorrection = (elevationDiff / 100) * CONFIG.LAPSE_RATE_PER_100M * CONFIG.SUMMIT_CORRECTION_FACTOR;
    } else if (elevation > 2500) {
        // Untuk gunung tinggi (2500-4000m)
        // Koreksi kecil saja
        const elevationDiff = elevation * 0.2; // 20% dari elevasi
        tempCorrection = (elevationDiff / 100) * CONFIG.LAPSE_RATE_PER_100M * CONFIG.SUMMIT_CORRECTION_FACTOR;
    }
    // Untuk gunung < 2500m, tidak ada koreksi (data sudah akurat)

    // Cap the correction to prevent extreme values
    tempCorrection = Math.min(tempCorrection, CONFIG.MAX_TEMP_CORRECTION);

    return Math.round((apiTemperature - tempCorrection) * 10) / 10;
}

/**
 * Check apakah puncak berada di atas freezing level
 * 
 * @param {number} elevation - Elevasi puncak (mdpl)
 * @param {number} freezingLevel - Freezing level dari API (mdpl)
 * @returns {boolean} True jika puncak di atas freezing level
 */
function isAboveFreezingLevel(elevation, freezingLevel) {
    if (freezingLevel === null || freezingLevel === undefined) {
        return false;
    }
    return elevation > freezingLevel;
}

/**
 * Hitung perkiraan suhu di berbagai ketinggian
 * 
 * @param {number} baseTemp - Suhu di base (°C)
 * @param {number} baseElevation - Elevasi base (mdpl)
 * @param {number[]} targetElevations - Array elevasi target
 * @returns {object[]} Array { elevation, temperature }
 */
function calculateTemperatureProfile(baseTemp, baseElevation, targetElevations) {
    return targetElevations.map(elevation => ({
        elevation,
        temperature: correctTemperatureForElevation(
            baseTemp + (baseElevation / 100 * CONFIG.LAPSE_RATE_PER_100M),
            elevation
        )
    }));
}

/**
 * Estimasi wind chill (suhu terasa dengan angin)
 * 
 * Simplified formula untuk kondisi gunung
 * 
 * @param {number} temperature - Suhu aktual (°C)
 * @param {number} windSpeed - Kecepatan angin (km/h)
 * @returns {number} Wind chill temperature (°C)
 */
function calculateWindChill(temperature, windSpeed) {
    if (temperature === null || windSpeed === null) {
        return temperature;
    }

    // Wind chill hanya berlaku untuk suhu < 10°C dan angin > 4.8 km/h
    if (temperature > 10 || windSpeed < 4.8) {
        return temperature;
    }

    // Wind chill formula (Environment Canada)
    const windChill = 13.12
        + 0.6215 * temperature
        - 11.37 * Math.pow(windSpeed, 0.16)
        + 0.3965 * temperature * Math.pow(windSpeed, 0.16);

    return Math.round(windChill * 10) / 10;
}

/**
 * Kategorisasi elevasi gunung
 * 
 * @param {number} elevation - Elevasi (mdpl)
 * @returns {string} Kategori
 */
function categorizeElevation(elevation) {
    if (elevation < 1500) return 'LOW';
    if (elevation < 2500) return 'MEDIUM';
    if (elevation < 3500) return 'HIGH';
    return 'VERY_HIGH';
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    correctTemperatureForElevation,
    isAboveFreezingLevel,
    calculateTemperatureProfile,
    calculateWindChill,
    categorizeElevation,
    CONFIG
};
