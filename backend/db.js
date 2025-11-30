const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

let db;

async function connectDB() {
    try {
        db = await sqlite.open({
            filename: './mydatabase.sqlite',
            driver: sqlite3.Database
        });

        console.log('SQLite підключено: ./mydatabase.sqlite');

        // Створення таблиці Products
        await db.exec(`
            CREATE TABLE IF NOT EXISTS Products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                quantity INTEGER NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Таблиця Products ініціалізована.');

    } catch (error) {
        console.error(`Помилка підключення до SQLite: ${error.message}`);
        process.exit(1);
    }
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };