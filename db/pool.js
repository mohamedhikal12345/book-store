const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const db_config = {
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 300000,
    idleTimeoutMillis: 300000,
    max: 20,
};

const pool = new Pool(db_config);

pool.on('connect', () => {
    console.log("Database is connected");
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client:', err);
});

pool.on('remove', () => {
    console.log("Database connection removed. Stack trace:", new Error().stack);
});

// Test the connection
const testPool = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database connection test successful:', res.rows[0]);
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
};

testPool();

module.exports = pool;