const { Events } = require('discord.js');
const { deleteAnaliseMessage, getAnaliseMessage } = require('../repositories/analises.repository');

module.exports = (client) => {
    client.on(Events.MessageReactionAdd, async (reaction, user) => {
        if (user.bot) return

        if (reaction.partial) await reaction.fetch()

        let reactionMsgId = reaction.message.id

        let message = getAnaliseMessage(reactionMsgId)

        const emoji = reaction.emoji.name
        let status

        if (emoji === '✅') status = 'Concluida ✅'
        if (emoji === '❌') status = 'Cancelada ❌'
        if (!status) return

        try {
            await removerMensagens(client, reaction, reactionMsgId, process.env.STAFF_CHANNEL, status, message.user_id)
        } catch(err){
            console.error(err)
        } finally {
            deleteAnaliseMessage(reactionMsgId)
        }

    })
}

async function removerMensagens(client, reaction, messageId, channelId, status, userId) {
    const staffCh = reaction.client.channels.cache.get(channelId)

    try {
        let message = await staffCh.messages.fetch(messageId)
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
