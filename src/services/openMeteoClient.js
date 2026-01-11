/**
 * ============================================================
 * MOUNTKEY - OPEN-METEO CLIENT
 * ============================================================
 * Client untuk fetch data cuaca dari Open-Meteo API.
 * 
 * FEATURES:
 * - Free API (no key required)
 * - Timeout handling
 * - Error normalization
 * - Response validation
 * 
 * API DOCS: https://open-meteo.com/en/docs
 * ============================================================
 */

const https = require('https');

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
    BASE_URL: 'https://api.open-meteo.com/v1/forecast',
    TIMEOUT_MS: 10000, // 10 seconds

    // Parameters yang kita butuhkan
    CURRENT_PARAMS: [
        'temperature_2m',
        'apparent_temperature',
        'wind_speed_10m',
        'wind_gusts_10m',
        'precipitation',
        'cloud_cover',
        'weather_code'
    ],

    HOURLY_PARAMS: [
        'precipitation_probability',
        'freezing_level_height'
    ]
};

// ============================================================
// MAIN CLIENT
// ============================================================

/**
 * Fetch current weather data dari Open-Meteo
 * 
 * @param {number} latitude - Latitude koordinat
 * @param {number} longitude - Longitude koordinat
 * @returns {Promise<object>} Normalized weather data
 * 
 * @example
 * const weather = await fetchCurrentWeather(-7.9425, 112.9530);
 * // => { temperature_2m: 25.5, wind_speed_10m: 12.3, ... }
 */
async function fetchCurrentWeather(latitude, longitude) {
    // Build URL with parameters
    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: CONFIG.CURRENT_PARAMS.join(','),
        hourly: CONFIG.HOURLY_PARAMS.join(','),
        timezone: 'UTC',
        forecast_days: 1
    });

    const url = `${CONFIG.BASE_URL}?${params.toString()}`;

    try {
        const response = await httpGet(url);
        return normalizeResponse(response);
    } catch (error) {
        throw normalizeError(error);
    }
}

// ============================================================
// HTTP HELPER
// ============================================================

/**
 * Simple HTTPS GET request with timeout
 * 
 * @param {string} url - URL to fetch
 * @returns {Promise<object>} JSON response
 */
function httpGet(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, {
            timeout: CONFIG.TIMEOUT_MS,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'MountKey-API/1.0'
            }
        }, (response) => {
            // Check status code
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }

            // Collect data
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    reject(new Error('Invalid JSON response'));
                }
            });
        });

        request.on('error', reject);
        request.on('timeout', () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

// ============================================================
// RESPONSE NORMALIZATION
// ============================================================

/**
 * Normalize Open-Meteo response ke format internal
 * 
 * @param {object} response - Raw Open-Meteo response
 * @returns {object} Normalized weather data
 */
function normalizeResponse(response) {
    const current = response.current || {};
    const hourly = response.hourly || {};

    // Get current hour index for hourly data
    const currentHourIndex = 0; // First hour in forecast

    // Extract precipitation probability (from hourly)
    const precipProbability = hourly.precipitation_probability
        ? hourly.precipitation_probability[currentHourIndex]
        : 0;

    // Extract freezing level (from hourly)
    const freezingLevel = hourly.freezing_level_height
        ? hourly.freezing_level_height[currentHourIndex]
        : null;

    return {
        // Temperature
        temperature_2m: current.temperature_2m ?? null,
        apparent_temperature: current.apparent_temperature ?? null,

        // Wind
        wind_speed_10m: current.wind_speed_10m ?? 0,
        wind_gusts_10m: current.wind_gusts_10m ?? 0,

        // Precipitation
        precipitation: current.precipitation ?? 0,
        precipitation_probability: precipProbability,

        // Cloud & visibility
        cloud_cover: current.cloud_cover ?? 0,
        weather_code: current.weather_code ?? 0,

        // Freezing level
        freezing_level_height: freezingLevel,

        // Metadata
        _raw_time: current.time,
        _fetched_at: new Date().toISOString()
    };
}

// ============================================================
// ERROR HANDLING
// ============================================================

/**
 * Normalize errors ke format konsisten
 * 
 * @param {Error} error - Original error
 * @returns {Error} Normalized error with code
 */
function normalizeError(error) {
    const message = error.message || 'Unknown error';

    let code = 'WEATHER_FETCH_ERROR';
    let userMessage = 'Failed to fetch weather data';

    if (message.includes('timeout')) {
        code = 'WEATHER_TIMEOUT';
        userMessage = 'Weather service timeout';
    } else if (message.includes('HTTP')) {
        code = 'WEATHER_SERVICE_ERROR';
        userMessage = 'Weather service unavailable';
    } else if (message.includes('ENOTFOUND') || message.includes('ECONNREFUSED')) {
        code = 'WEATHER_NETWORK_ERROR';
        userMessage = 'Cannot connect to weather service';
    }

    const normalizedError = new Error(userMessage);
    normalizedError.code = code;
    normalizedError.originalMessage = message;

    return normalizedError;
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    fetchCurrentWeather,
    CONFIG
};
