const { db } = require('../database/db.js')

const insertStmt = db.prepare('INSERT INTO order_messages (message_id, linked_id, user_id) VALUES (?, ?, ?)')

const selectMessageStmt = db.prepare('SELECT * FROM order_messages WHERE message_id = ?')

const deleteMessageStmt = db.prepare('DELETE FROM order_messages WHERE message_id = ?')

const deleteLinkedMessageStmt = db.prepare('DELETE FROM order_messages WHERE linked_id = ?')

module.exports = {

    saveMessage(userId, messageId, linkedId) {
        insertStmt.run(messageId, linkedId, userId)
    },

    getMessage(messageId) {
        return selectMessageStmt.get(messageId)
    },

    deleteMessage(messageId, isLinkedMessage) {
        if (isLinkedMessage) {
            return deleteLinkedMessageStmt.get(messageId)
        } else {
            return deleteMessageStmt.get(messageId)
        }
    }

}