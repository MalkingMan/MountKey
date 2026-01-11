require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'mount_key',
        port: process.env.DB_PORT || 3306,
        multipleStatements: true
    };

    const filePath = path.join(__dirname, '../database/migration_add_weather_risks.sql');
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log('Running migration:', filePath);

    let connection;
    try {
        connection = await mysql.createConnection(config);
        await connection.query(sql);
        console.log('✅ Migration successful.');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        if (connection) connection.end();
    }
}

runMigration();
