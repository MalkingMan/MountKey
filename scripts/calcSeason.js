/**
 * SCRIPT: CALCULATE MOUNTAIN SEASONS
 * 
 * Usage:
 * node scripts/calcSeason.js --mountain=all
 * node scripts/calcSeason.js --mountain=1
 * node scripts/calcSeason.js --mountain=semeru
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const { fetchHistoricalWeather } = require('../src/services/openMeteoArchiveClient');
const { aggregateMonthlyData, calculateRiskScores, determineSeasons } = require('../src/services/seasonAnalysisService');

// DB config (reuse env)
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mount_key',
    port: process.env.DB_PORT || 3306
};

async function main() {
    const args = process.argv.slice(2);
    const mountainArg = args.find(a => a.startsWith('--mountain='))?.split('=')[1];

    if (!mountainArg) {
        console.error('❌ Usage: node calcSeason.js --mountain=[id|slug|all]');
        process.exit(1);
    }

    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database.');

    try {
        // 1. Get Mountains
        let query = `
            SELECT m.id, m.name, m.latitude, m.longitude, meta.season_source 
            FROM mountains m
            LEFT JOIN mountain_weather_meta meta ON m.id = meta.mountain_id
            WHERE 1=1
        `;
        const params = [];

        if (mountainArg !== 'all') {
            if (!isNaN(mountainArg)) {
                query += ' AND m.id = ?';
                params.push(parseInt(mountainArg));
            } else {
                query += ' AND m.slug = ?';
                params.push(mountainArg);
            }
        }

        const [mountains] = await connection.execute(query, params);
        console.log(`🏔️  Found ${mountains.length} mountains to process.`);

        // 2. Process each mountain
        for (const mountain of mountains) {
            console.log(`\n⏳ Processing: ${mountain.name} (#${mountain.id})...`);

            if (mountain.season_source === 'manual') {
                console.log(`   ⚠️ Skipped (season_source is manual).`);
                continue;
            }

            if (!mountain.latitude || !mountain.longitude) {
                console.log(`   ❌ Skipped (missing coordinates).`);
                continue;
            }

            // A. Fetch Data
            const historicalData = await fetchHistoricalWeather(mountain.latitude, mountain.longitude);

            // B. Analyze
            const monthlyStats = aggregateMonthlyData(historicalData.daily);
            const scoredMonths = calculateRiskScores(monthlyStats);
            const result = determineSeasons(scoredMonths);

            console.log(`   📊 Result: Best(${result.best_season_start}-${result.best_season_end}), Worst(${result.worst_season_start}-${result.worst_season_end})`);

            // C. Save to DB
            // Check if meta exists
            const [existing] = await connection.execute('SELECT id FROM mountain_weather_meta WHERE mountain_id = ?', [mountain.id]);

            // Prepare Notes JSON
            const notes = {
                calculated_at: new Date().toISOString(),
                method: 'weighted_risk_score',
                details: scoredMonths.map(m => ({
                    month: m.month,
                    score: m.risk_score
                }))
            };

            if (existing.length > 0) {
                // Update
                await connection.execute(`
                    UPDATE mountain_weather_meta SET
                        best_season_start = ?, best_season_end = ?,
                        worst_season_start = ?, worst_season_end = ?,
                        season_source = 'auto',
                        last_calculated_at = NOW(),
                        calculation_notes = ?
                    WHERE mountain_id = ?
                `, [
                    result.best_season_start, result.best_season_end,
                    result.worst_season_start, result.worst_season_end,
                    JSON.stringify(notes),
                    mountain.id
                ]);
            } else {
                // Insert
                await connection.execute(`
                    INSERT INTO mountain_weather_meta 
                    (mountain_id, best_season_start, best_season_end, worst_season_start, worst_season_end, season_source, last_calculated_at, calculation_notes)
                    VALUES (?, ?, ?, ?, ?, 'auto', NOW(), ?)
                `, [
                    mountain.id,
                    result.best_season_start, result.best_season_end,
                    result.worst_season_start, result.worst_season_end,
                    JSON.stringify(notes)
                ]);
            }
            console.log('   ✅ Saved to DB.');
        }

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await connection.end();
        console.log('\n🏁 Done.');
    }
}

main();
