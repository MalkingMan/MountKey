/**
 * ============================================================
 * MOUNTKEY - MOUNTAIN CONTROLLER
 * ============================================================
 * Controller untuk endpoint Mountains (Read-Only).
 * 
 * ENDPOINTS:
 * - GET /v1/mountains           - List all mountains
 * - GET /v1/mountains/:slug     - Get single mountain
 * - GET /v1/mountains/:slug/trails - Get trails for mountain
 * ============================================================
 */

const { pool } = require('../config/database');
const { success, notFound, error } = require('../utils/responseHelper');
const { fetchCurrentWeather } = require('../services/openMeteoClient');

// ============================================================
// CONFIGURATION
// ============================================================

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// Fields to expose (exclude internal fields)
const MOUNTAIN_PUBLIC_FIELDS = `
    id,
    name,
    slug,
    province,
    regency,
    latitude,
    longitude,
    elevation_meters,
    mountain_status,
    mountain_type,
    conservation_area,
    conservation_type,
    description,
    created_at,
    updated_at
`;

// ============================================================
// CONTROLLERS
// ============================================================

/**
 * GET /v1/mountains
 * 
 * List all mountains with pagination and filtering
 * 
 * QUERY PARAMS:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - province: Filter by province
 * - status: Filter by mountain_status
 * - sort: Sort field (default: name)
 * - order: Sort order (asc/desc, default: asc)
 */
async function listMountains(req, res) {
    try {
        // ─────────────────────────────────────────────────────
        // Parse query parameters
        // ─────────────────────────────────────────────────────
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(req.query.limit) || DEFAULT_PAGE_SIZE));
        const offset = (page - 1) * limit;

        const province = req.query.province || null;
        const status = req.query.status || null;
        const sortField = validateSortField(req.query.sort);
        const sortOrder = req.query.order === 'desc' ? 'DESC' : 'ASC';

        // ─────────────────────────────────────────────────────
        // Build query
        // ─────────────────────────────────────────────────────
        let whereClause = 'WHERE is_active = 1';
        const params = [];

        if (province) {
            whereClause += ' AND province = ?';
            params.push(province);
        }

        if (status && ['active', 'dormant', 'extinct'].includes(status)) {
            whereClause += ' AND mountain_status = ?';
            params.push(status);
        }

        // ─────────────────────────────────────────────────────
        // Get total count
        // ─────────────────────────────────────────────────────
        const [countResult] = await pool.execute(
            `SELECT COUNT(*) as total FROM mountains ${whereClause}`,
            params
        );
        const total = countResult[0].total;

        // ─────────────────────────────────────────────────────
        // Get paginated data
        // ─────────────────────────────────────────────────────
        const [rows] = await pool.execute(
            `SELECT ${MOUNTAIN_PUBLIC_FIELDS}
             FROM mountains 
             ${whereClause}
             ORDER BY ${sortField} ${sortOrder}
             LIMIT ? OFFSET ?`,
            [...params, limit.toString(), offset.toString()]
        );

        // ─────────────────────────────────────────────────────
        // Build response
        // ─────────────────────────────────────────────────────
        const totalPages = Math.ceil(total / limit);

        return success(res, {
            mountains: rows.map(formatMountainResponse),
            pagination: {
                current_page: page,
                per_page: limit,
                total_items: total,
                total_pages: totalPages,
                has_next: page < totalPages,
                has_prev: page > 1
            }
        }, 'Mountains retrieved successfully');

    } catch (err) {
        console.error('[MountainController] listMountains error:', err.message);
        return error(res, 'Failed to retrieve mountains', 'SERVER_ERROR', 500);
    }
}

/**
 * GET /v1/mountains/:slug
 * 
 * Get single mountain by slug (with real-time weather)
 */
async function getMountainBySlug(req, res) {
    try {
        const { slug } = req.params;

        // ─────────────────────────────────────────────────────
        // Query database
        // ─────────────────────────────────────────────────────
        const [rows] = await pool.execute(
            `SELECT ${MOUNTAIN_PUBLIC_FIELDS}
             FROM mountains 
             WHERE slug = ? AND is_active = 1
             LIMIT 1`,
            [slug]
        );

        if (rows.length === 0) {
            return notFound(res, `Mountain '${slug}' not found`, 'MOUNTAIN_NOT_FOUND');
        }

        // ─────────────────────────────────────────────────────
        // Get trail count for this mountain
        // ─────────────────────────────────────────────────────
        const [trailCount] = await pool.execute(
            `SELECT COUNT(*) as count FROM trails WHERE mountain_id = ? AND is_active = 1`,
            [rows[0].id]
        );

        const mountain = formatMountainResponse(rows[0]);
        mountain.trail_count = trailCount[0].count;

        // ─────────────────────────────────────────────────────
        // Fetch real-time weather from Open-Meteo
        // ─────────────────────────────────────────────────────
        let currentWeather = null;
        try {
            const weatherData = await fetchCurrentWeather(
                parseFloat(rows[0].latitude),
                parseFloat(rows[0].longitude)
            );

            currentWeather = {
                temperature: {
                    current: weatherData.temperature_2m,
                    feels_like: weatherData.apparent_temperature,
                    unit: '°C'
                },
                wind: {
                    speed: weatherData.wind_speed_10m,
                    gusts: weatherData.wind_gusts_10m,
                    unit: 'km/h'
                },
                precipitation: {
                    current: weatherData.precipitation,
                    probability: weatherData.precipitation_probability,
                    unit: 'mm'
                },
                cloud_cover: weatherData.cloud_cover,
                weather_code: weatherData.weather_code,
                freezing_level_meters: weatherData.freezing_level_height,
                fetched_at: weatherData._fetched_at,
                source: 'open-meteo'
            };
        } catch (weatherError) {
            console.warn('[MountainController] Weather fetch failed:', weatherError.message);
            currentWeather = {
                error: 'Weather data temporarily unavailable',
                source: 'open-meteo'
            };
        }

        return success(res, {
            mountain,
            current_weather: currentWeather
        }, 'Mountain retrieved successfully');

    } catch (err) {
        console.error('[MountainController] getMountainBySlug error:', err.message);
        return error(res, 'Failed to retrieve mountain', 'SERVER_ERROR', 500);
    }
}

/**
 * GET /v1/mountains/:slug/trails
 * 
 * Get all trails for a specific mountain
 */
async function getMountainTrails(req, res) {
    try {
        const { slug } = req.params;

        // ─────────────────────────────────────────────────────
        // Find mountain first
        // ─────────────────────────────────────────────────────
        const [mountains] = await pool.execute(
            `SELECT id, name, slug FROM mountains WHERE slug = ? AND is_active = 1 LIMIT 1`,
            [slug]
        );

        if (mountains.length === 0) {
            return notFound(res, `Mountain '${slug}' not found`, 'MOUNTAIN_NOT_FOUND');
        }

        const mountain = mountains[0];

        // ─────────────────────────────────────────────────────
        // Get trails
        // ─────────────────────────────────────────────────────
        const [trails] = await pool.execute(
            `SELECT 
                id,
                name,
                slug,
                basecamp_name,
                basecamp_village,
                basecamp_district,
                basecamp_latitude,
                basecamp_longitude,
                distance_km,
                estimated_time_up_hours,
                estimated_time_down_hours,
                difficulty_level,
                trail_status,
                status_reason,
                daily_quota,
                description,
                created_at,
                updated_at
             FROM trails 
             WHERE mountain_id = ? AND is_active = 1
             ORDER BY name ASC`,
            [mountain.id]
        );

        return success(res, {
            mountain: {
                id: mountain.id,
                name: mountain.name,
                slug: mountain.slug
            },
            trails: trails.map(formatTrailResponse),
            count: trails.length
        }, 'Trails retrieved successfully');

    } catch (err) {
        console.error('[MountainController] getMountainTrails error:', err.message);
        return error(res, 'Failed to retrieve trails', 'SERVER_ERROR', 500);
    }
}

/**
 * GET /v1/mountains/:slug/weather-meta
 * 
 * Get weather metadata for a specific mountain (static data curated by admin)
 */
async function getWeatherMetaBySlug(req, res) {
    try {
        const { slug } = req.params;

        // ─────────────────────────────────────────────────────
        // Find mountain first
        // ─────────────────────────────────────────────────────
        const [mountains] = await pool.execute(
            `SELECT id, name, slug, elevation_meters FROM mountains WHERE slug = ? AND is_active = 1 LIMIT 1`,
            [slug]
        );

        if (mountains.length === 0) {
            return notFound(res, `Mountain '${slug}' not found`, 'MOUNTAIN_NOT_FOUND');
        }

        const mountain = mountains[0];

        // ─────────────────────────────────────────────────────
        // Get weather meta
        // ─────────────────────────────────────────────────────
        const [metaRows] = await pool.execute(
            `SELECT * FROM mountain_weather_meta WHERE mountain_id = ? LIMIT 1`,
            [mountain.id]
        );

        // Format response
        let weatherMeta = null;

        if (metaRows.length > 0) {
            const meta = metaRows[0];

            // Parse weather_risks JSON
            let dominantRisks = [];
            if (meta.weather_risks) {
                try {
                    dominantRisks = typeof meta.weather_risks === 'string'
                        ? JSON.parse(meta.weather_risks)
                        : meta.weather_risks;
                } catch (e) {
                    dominantRisks = [];
                }
            }

            // Map month numbers to names
            const monthNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

            weatherMeta = {
                seasonal_analysis: {
                    best_season: meta.best_season_start && meta.best_season_end ? {
                        start_month: meta.best_season_start,
                        end_month: meta.best_season_end,
                        label: `${monthNames[meta.best_season_start]} - ${monthNames[meta.best_season_end]}`
                    } : null,
                    worst_season: meta.worst_season_start && meta.worst_season_end ? {
                        start_month: meta.worst_season_start,
                        end_month: meta.worst_season_end,
                        label: `${monthNames[meta.worst_season_start]} - ${monthNames[meta.worst_season_end]}`
                    } : null,
                    source: meta.season_source || 'manual'
                },
                temperature_profiles: {
                    basecamp: {
                        min_c: meta.avg_temp_base_min,
                        max_c: meta.avg_temp_base_max
                    },
                    summit: {
                        min_c: meta.avg_temp_summit_min,
                        max_c: meta.avg_temp_summit_max
                    }
                },
                dominant_risks: dominantRisks,
                special_notes: meta.weather_notes || null,
                last_updated: meta.updated_at
            };
        }

        return success(res, {
            mountain: {
                id: mountain.id,
                name: mountain.name,
                slug: mountain.slug,
                elevation_meters: mountain.elevation_meters
            },
            weather_meta: weatherMeta
        }, weatherMeta ? 'Weather meta retrieved successfully' : 'No weather meta data available');

    } catch (err) {
        console.error('[MountainController] getWeatherMetaBySlug error:', err.message);
        return error(res, 'Failed to retrieve weather meta', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Format mountain response (remove internal fields, format data)
 */
function formatMountainResponse(mountain) {
    return {
        id: mountain.id,
        name: mountain.name,
        slug: mountain.slug,
        location: {
            province: mountain.province,
            regency: mountain.regency,
            coordinates: {
                latitude: parseFloat(mountain.latitude),
                longitude: parseFloat(mountain.longitude)
            }
        },
        elevation_meters: mountain.elevation_meters,
        status: mountain.mountain_status,
        type: mountain.mountain_type,
        conservation: {
            area: mountain.conservation_area,
            type: mountain.conservation_type
        },
        description: mountain.description,
        created_at: mountain.created_at,
        updated_at: mountain.updated_at
    };
}

/**
 * Format trail response
 */
function formatTrailResponse(trail) {
    return {
        id: trail.id,
        name: trail.name,
        slug: trail.slug,
        basecamp: {
            name: trail.basecamp_name,
            village: trail.basecamp_village,
            district: trail.basecamp_district,
            coordinates: trail.basecamp_latitude ? {
                latitude: parseFloat(trail.basecamp_latitude),
                longitude: parseFloat(trail.basecamp_longitude)
            } : null
        },
        distance_km: trail.distance_km ? parseFloat(trail.distance_km) : null,
        estimated_hours: {
            up: trail.estimated_time_up_hours ? parseFloat(trail.estimated_time_up_hours) : null,
            down: trail.estimated_time_down_hours ? parseFloat(trail.estimated_time_down_hours) : null
        },
        difficulty_level: trail.difficulty_level,
        status: trail.trail_status,
        status_reason: trail.status_reason,
        daily_quota: trail.daily_quota,
        description: trail.description,
        created_at: trail.created_at,
        updated_at: trail.updated_at
    };
}

/**
 * Validate sort field to prevent SQL injection
 */
function validateSortField(field) {
    const allowedFields = ['name', 'elevation_meters', 'province', 'created_at'];
    return allowedFields.includes(field) ? field : 'name';
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    listMountains,
    getMountainBySlug,
    getMountainTrails,
    getWeatherMetaBySlug
};
