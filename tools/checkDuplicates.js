require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkDuplicates() {
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
        
        console.log('🔍 Checking for duplicate names...');
        const [nameRows] = await connection.query(`
            SELECT name, COUNT(*) as count, GROUP_CONCAT(id) as ids 
            FROM mountains 
            GROUP BY name 
            HAVING count > 1
        `);

        if (nameRows.length > 0) {
            console.log('⚠️  Duplicate Names Found:');
            console.table(nameRows);
        } else {
            console.log('✅ No duplicate names found.');
        }

        console.log('\n🔍 Checking for duplicate slugs...');
        const [slugRows] = await connection.query(`
            SELECT slug, COUNT(*) as count, GROUP_CONCAT(id) as ids 
            FROM mountains 
            GROUP BY slug 
            HAVING count > 1
        `);

        if (slugRows.length > 0) {
            console.log('⚠️  Duplicate Slugs Found:');
            console.table(slugRows);
        } else {
            console.log('✅ No duplicate slugs found.');
        }

    } catch (err) {
        console.error('❌ Check failed:', err.message);
    } finally {
        if (connection) connection.end();
    }
}

checkDuplicates();
