const { db } = require('../database/db.js')

const insertStmt = db.prepare('INSERT INTO analises_requests (message_id, user_id) VALUES (?, ?)')

const selectMessageStmt = db.prepare('SELECT * FROM analises_requests WHERE message_id = ?')

const deleteMessageStmt = db.prepare('DELETE FROM analises_requests WHERE message_id = ?')

module.exports = {

    saveAnaliseMessage(userId, messageId) {
        insertStmt.run(messageId, userId)
    },

    getAnaliseMessage(messageId) {
        return selectMessageStmt.get(messageId)
    },

    deleteAnaliseMessage(messageId) {
        return deleteMessageStmt.get(messageId)
    }

}