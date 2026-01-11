/**
 * ============================================================
 * MOUNTKEY - ADMIN WEATHER META CONTROLLER
 * ============================================================
 * Controller untuk mengelola metadata cuaca statis & historis.
 * ============================================================
 */

const { pool } = require('../config/database');
const responseHelper = require('../utils/responseHelper');

// ============================================================
// GET WEATHER META
// ============================================================
async function getWeatherMeta(req, res) {
    try {
        const { mountain_id } = req.params;

        // Fetch meta + mountain basic info
        const [rows] = await pool.execute(`
            SELECT 
                m.id as mountain_id, m.name, m.elevation_meters, m.province,
                wm.*
            FROM mountains m
            LEFT JOIN mountain_weather_meta wm ON m.id = wm.mountain_id
            WHERE m.id = ?
        `, [mountain_id]);

        if (rows.length === 0) {
            return responseHelper.error(res, 'Mountain not found', 'NOT_FOUND', 404);
        }

        const data = rows[0];

        // Parse JSON fields if necessary
        if (data.weather_risks && typeof data.weather_risks === 'string') {
            try {
                data.weather_risks = JSON.parse(data.weather_risks);
            } catch (e) {
                data.weather_risks = [];
            }
        }

        // Ensure defaults
        if (!data.weather_risks) data.weather_risks = [];

        return responseHelper.success(res, { meta: data });

    } catch (err) {
        console.error('Admin getWeatherMeta error:', err);
        return responseHelper.error(res, 'Failed to fetch weather meta', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// UPDATE WEATHER META
// ============================================================
async function updateWeatherMeta(req, res) {
    try {
        const { mountain_id } = req.params;
        const {
            best_season_start, best_season_end,
            worst_season_start, worst_season_end,
            avg_temp_base_min, avg_temp_base_max,
            avg_temp_summit_min, avg_temp_summit_max,
            weather_risks, // Array
            weather_notes,
            force_manual // boolean flag to override auto source
        } = req.body;

        // Determinisikan season_source
        // Jika force_manual = true, ubah ke 'manual'.
        // Jika tidak, biarkan yang lama (atau default 'manual' jika row baru).

        // Cek existing dulu
        const [existing] = await pool.execute('SELECT id, season_source FROM mountain_weather_meta WHERE mountain_id = ?', [mountain_id]);

        let seasonSource = 'manual'; // Default untuk data baru yg diinput admin
        if (existing.length > 0) {
            seasonSource = existing[0].season_source;
            if (force_manual) seasonSource = 'manual';
        }

        const risksJson = JSON.stringify(weather_risks || []);

        // Upsert Logic
        if (existing.length === 0) {
            // INSERT
            await pool.execute(`
                INSERT INTO mountain_weather_meta 
                (mountain_id, best_season_start, best_season_end, worst_season_start, worst_season_end,
                 avg_temp_base_min, avg_temp_base_max, avg_temp_summit_min, avg_temp_summit_max,
                 weather_risks, weather_notes,
                 season_source, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `, [
                mountain_id,
                best_season_start || null, best_season_end || null,
                worst_season_start || null, worst_season_end || null,
                avg_temp_base_min || null, avg_temp_base_max || null,
                avg_temp_summit_min || null, avg_temp_summit_max || null,
                risksJson, weather_notes || null,
                seasonSource
            ]);
        } else {
            // UPDATE
            await pool.execute(`
                UPDATE mountain_weather_meta SET
                    best_season_start = ?, best_season_end = ?,
                    worst_season_start = ?, worst_season_end = ?,
                    avg_temp_base_min = ?, avg_temp_base_max = ?,
                    avg_temp_summit_min = ?, avg_temp_summit_max = ?,
                    weather_risks = ?, weather_notes = ?,
                    season_source = ?,
                    updated_at = NOW()
                WHERE mountain_id = ?
            `, [
                best_season_start || null, best_season_end || null,
                worst_season_start || null, worst_season_end || null,
                avg_temp_base_min || null, avg_temp_base_max || null,
                avg_temp_summit_min || null, avg_temp_summit_max || null,
                risksJson, weather_notes || null,
                seasonSource,
                mountain_id
            ]);
        }

        return responseHelper.success(res, null, 'Weather metadata updated successfully');

    } catch (err) {
        console.error('Admin updateWeatherMeta error:', err);
        return responseHelper.error(res, 'Failed to update weather meta', 'SERVER_ERROR', 500);
    }
}

module.exports = {
    getWeatherMeta,
    updateWeatherMeta
};
