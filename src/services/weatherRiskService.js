/**
 * ============================================================
 * MOUNTKEY - WEATHER RISK SERVICE
 * ============================================================
 * Main service untuk Weather Risk Index.
 * 
 * FEATURES:
 * - Fetch weather dari Open-Meteo
 * - Apply elevation correction
 * - Calculate risk score
 * - In-memory caching (TTL: 15-30 min)
 * - Stateless operation
 * 
 * OUTPUT: Risk index dengan explainable reasons
 * ============================================================
 */

const { fetchCurrentWeather } = require('./openMeteoClient');
const {
    correctTemperatureForElevation,
    calculateWindChill,
    isAboveFreezingLevel
} = require('../utils/elevationUtils');
const {
    calculateRiskScore,
    generateRecommendation
} = require('../utils/riskScoringUtils');

// ============================================================
// CACHE CONFIGURATION
// ============================================================

const CACHE_CONFIG = {
    TTL_MS: 20 * 60 * 1000,  // 20 minutes
    MAX_ENTRIES: 500         // Max cached mountains
};

// Simple in-memory cache
const cache = new Map();

// ============================================================
// MAIN SERVICE FUNCTION
// ============================================================

/**
 * Get weather risk assessment for a mountain
 * 
 * @param {object} mountain - Mountain data
 * @param {number} mountain.id - Mountain ID
 * @param {string} mountain.name - Mountain name
 * @param {number} mountain.latitude - Latitude
 * @param {number} mountain.longitude - Longitude
 * @param {number} mountain.elevation_meters - Elevation in meters
 * @returns {Promise<object>} Weather risk response
 */
async function getWeatherRisk(mountain) {
    const { id, name, latitude, longitude, elevation_meters } = mountain;

    // Check cache first
    const cacheKey = `weather_risk:${id}`;
    const cached = getFromCache(cacheKey);

    if (cached) {
        return cached;
    }

    // Fetch fresh weather data
    const rawWeather = await fetchCurrentWeather(latitude, longitude);

    // Build response
    const response = buildWeatherRiskResponse(mountain, rawWeather);

    // Cache the result
    setCache(cacheKey, response);

    return response;
}

// ============================================================
// RESPONSE BUILDER
// ============================================================

/**
 * Build complete weather risk response
 * 
 * @param {object} mountain - Mountain data
 * @param {object} rawWeather - Raw weather from Open-Meteo
 * @returns {object} Complete response object
 */
function buildWeatherRiskResponse(mountain, rawWeather) {
    const { id, name, elevation_meters } = mountain;

    // ─────────────────────────────────────────────────────
    // 1. Apply elevation correction to temperature
    // ─────────────────────────────────────────────────────
    const correctedTemp = correctTemperatureForElevation(
        rawWeather.temperature_2m,
        elevation_meters
    );

    const correctedFeelsLike = correctTemperatureForElevation(
        rawWeather.apparent_temperature,
        elevation_meters
    );

    // Apply wind chill
    const feelsLikeWithWind = calculateWindChill(
        correctedFeelsLike ?? correctedTemp,
        rawWeather.wind_speed_10m
    );

    // ─────────────────────────────────────────────────────
    // 2. Prepare weather data
    // ─────────────────────────────────────────────────────
    const weatherData = {
        temperature_c: correctedTemp,
        feels_like_c: feelsLikeWithWind,
        wind_speed_kmh: Math.round(rawWeather.wind_speed_10m || 0),
        wind_gust_kmh: Math.round(rawWeather.wind_gusts_10m || 0),
        precipitation_mm: rawWeather.precipitation || 0,
        precipitation_probability: rawWeather.precipitation_probability || 0,
        cloud_cover_percent: rawWeather.cloud_cover || 0,
        freezing_level_mdpl: rawWeather.freezing_level_height
    };

    // ─────────────────────────────────────────────────────
    // 3. Calculate risk score
    // ─────────────────────────────────────────────────────
    const riskResult = calculateRiskScore({
        windSpeed: weatherData.wind_speed_kmh,
        windGust: weatherData.wind_gust_kmh,
        precipitation: weatherData.precipitation_mm,
        precipProbability: weatherData.precipitation_probability,
        temperature: correctedTemp,
        elevation: elevation_meters,
        freezingLevel: weatherData.freezing_level_mdpl,
        cloudCover: weatherData.cloud_cover_percent
    });

    // ─────────────────────────────────────────────────────
    // 4. Generate recommendation
    // ─────────────────────────────────────────────────────
    const recommendation = generateRecommendation(
        riskResult.level,
        riskResult.reasons
    );

    // ─────────────────────────────────────────────────────
    // 5. Build final response
    // ─────────────────────────────────────────────────────
    const now = new Date();

    return {
        mountain: {
            id,
            name,
            elevation_mdpl: elevation_meters
        },
        weather: weatherData,
        risk_index: {
            score: riskResult.score,
            level: riskResult.level,
            status: riskResult.status,
            reasons: riskResult.reasons
        },
        recommendation: {
            summary: recommendation.summary,
            advice: recommendation.advice
        },
        meta: {
            source: 'open-meteo',
            generated_at: now.toISOString(),
            valid_for_minutes: Math.round(CACHE_CONFIG.TTL_MS / 60000),
            elevation_corrected: true
        }
    };
}

// ============================================================
// CACHE FUNCTIONS
// ============================================================

/**
 * Get item from cache if not expired
 */
function getFromCache(key) {
    const item = cache.get(key);

    if (!item) {
        return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
        cache.delete(key);
        return null;
    }

    return item.data;
}

/**
 * Set item to cache with TTL
 */
function setCache(key, data) {
    // Evict oldest entries if cache is full
    if (cache.size >= CACHE_CONFIG.MAX_ENTRIES) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
    }

    cache.set(key, {
        data,
        expiresAt: Date.now() + CACHE_CONFIG.TTL_MS
    });
}

/**
 * Clear entire cache (for testing/admin)
 */
function clearCache() {
    cache.clear();
}

/**
 * Get cache stats
 */
function getCacheStats() {
    return {
        size: cache.size,
        maxSize: CACHE_CONFIG.MAX_ENTRIES,
        ttlMinutes: Math.round(CACHE_CONFIG.TTL_MS / 60000)
    };
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    getWeatherRisk,
    clearCache,
    getCacheStats,
    CACHE_CONFIG
};
