require('dotenv').config();
const mysql = require('mysql2/promise');

async function listIndonesianMountains() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'mount_key',
        port: process.env.DB_PORT || 3306
    };

    let connection;
    try {
        connection = await mysql.createConnection(config);
        
        console.log('🏔️  Listing Indonesian Mountains in Database:');
        const [rows] = await connection.query(`
            SELECT id, name, province, regency, elevation_meters, mountain_status 
            FROM mountains 
            ORDER BY province, name
        `);

        if (rows.length > 0) {
            console.table(rows);
            console.log(`
Total: ${rows.length} gunung ditemukan.`);
        } else {
            console.log('❌ Tidak ada data gunung ditemukan.');
        }

    } catch (err) {
        console.error('❌ Query failed:', err.message);
    } finally {
        if (connection) connection.end();
    }
}

listIndonesianMountains();
