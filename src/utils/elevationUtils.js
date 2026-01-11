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
    // Environmental Lapse Rate: 0.6°C per 100m
    LAPSE_RATE_PER_100M: 0.6,

    // Reference elevation for API data (sea level approx)
    REFERENCE_ELEVATION: 0,

    // Minimum freezing temperature
    FREEZING_POINT_C: 0
};

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * Koreksi suhu berdasarkan elevasi
 * 
 * Rumus: corrected = api_temp - ((elevation / 100) * 0.6)
 * 
 * @param {number} apiTemperature - Suhu dari API (°C)
 * @param {number} elevation - Elevasi puncak (mdpl)
 * @param {number} referenceElevation - Elevasi referensi API (default: 0)
 * @returns {number} Suhu terkoreksi (°C)
 * 
 * @example
 * // Gunung dengan elevasi 3000m, suhu API 20°C
 * correctTemperatureForElevation(20, 3000);
 * // => 20 - (3000/100 * 0.6) = 20 - 18 = 2°C
 */
function correctTemperatureForElevation(apiTemperature, elevation, referenceElevation = CONFIG.REFERENCE_ELEVATION) {
    if (typeof apiTemperature !== 'number' || apiTemperature === null) {
        return null;
    }

    const elevationDiff = elevation - referenceElevation;
    const tempDrop = (elevationDiff / 100) * CONFIG.LAPSE_RATE_PER_100M;

    return Math.round((apiTemperature - tempDrop) * 10) / 10;
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
