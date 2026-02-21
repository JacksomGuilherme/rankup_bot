const { DatabaseSync } = require('node:sqlite')
const db = new DatabaseSync('./database.sqlite')

db.exec(`CREATE TABLE IF NOT EXISTS order_messages (
    message_id TEXT PRIMARY KEY,
    linked_id TEXT NOT NULL,
    user_id TEXT NOT NULL    
)`)

module.exports = { db }