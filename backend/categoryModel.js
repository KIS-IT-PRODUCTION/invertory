const db = require('./db');

const createTable = async () => {
    db.run (`
        CREATE TABLE IF NOT EXISTS Categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
}
module.exports = {
    createTable,
};