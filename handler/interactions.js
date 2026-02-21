const { Events } = require('discord.js');
const { getMessage, deleteMessage } = require('../repositories/orders.repository.js');

module.exports = (client) => {
    client.on(Events.MessageReactionAdd, async (reaction, user) => {
        if (reaction.partial) await reaction.fetch()

        let reactionMsgId = reaction.message.id
        let reactedOnDM = reaction.message.channel.type == 1

        const entry = getMessage(reactionMsgId)

        if (!entry) return

        const emoji = reaction.emoji.name
        let status

        if (emoji === '✅') status = 'Concluida ✅'
        if (emoji === '❌') status = 'Cancelada ❌'
        if (!status) return

        try {
            if (reactedOnDM) {
                await removerMensagens(client, reaction, reactionMsgId, entry.linked_id, entry.user_id, process.env.STAFF_CHANNEL, status)
            } else {
                await removerMensagens(client, reaction, entry.linked_id, reactionMsgId, entry.user_id, process.env.STAFF_CHANNEL, status)
            }
        } finally {
            deleteOrderPair(entry)
        }

    })
}

async function removerMensagens(client, reaction, messageId, linkedMessageId, userId, channelId, status) {
    const userMessage = await client.users.fetch(userId);
    const dmChannel = await userMessage.createDM()
    let message
    try {
        message = await dmChannel.messages.fetch(messageId)
        message.delete()
        dmChannel.send({
            content: `<@${userId}> sua solicitação foi ${status}`,
            embeds: [],
            components: []
        })
    } catch (error) {
        if (error.code === 10008)
            console.log('Mensagem na DM do usuário não existe')
    }

    const staffCh = reaction.client.channels.cache.get(channelId)

    try {
        message = await staffCh.messages.fetch(linkedMessageId)
        message.reactions.removeAll().catch((error) => console.error('Failed to clear reactions:', error));
        message.edit({
            content: `Solicitação de <@${userId}> foi ${status}`,
            embeds: [],
            components: []
        })
    } catch (error) {
        if (error.code === 10008)
            console.log('Mensagem no Canal da staff não existe')
    }
}

function deleteOrderPair(entry) {
    deleteMessage(entry.linked_id, true)
    deleteMessage(entry.message_id, false)
}