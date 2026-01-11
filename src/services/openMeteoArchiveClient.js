const axios = require('axios');

const BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';

/**
 * Fetch data historis 5 tahun ke belakang untuk koordinat tertentu.
 * Mengambil data harian untuk di-agregasi.
 * 
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Raw JSON response from Open-Meteo
 */
async function fetchHistoricalWeather(latitude, longitude) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 5); // 5 tahun ke belakang

    // Format YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];

    const params = {
        latitude,
        longitude,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        daily: [
            'temperature_2m_min',
            'precipitation_sum',
            'wind_speed_10m_max'
        ].join(','),
        timezone: 'UTC' // Standarisasi UTC
    };

    try {
        console.log(`📡 Fetching Open-Meteo Archive for ${latitude}, ${longitude}...`);
        const response = await axios.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error('❌ Open-Meteo API Error:', error.message);
        throw new Error('Failed to fetch historical weather data');
    }
}

module.exports = { fetchHistoricalWeather };
