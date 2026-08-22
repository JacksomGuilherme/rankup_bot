const { Colors, EmbedBuilder } = require('discord.js')
const { montaCard } = require('../public/cards.js')

module.exports = {

    /**
     * Monta o embed enviado para o canal da staff com os dados da partida
     * enviada para análise, incluindo o replay anexado (se houver) ou o
     * link do vídeo informado pelo usuário.
     */
    montaCardAnaliseStaff(user, nick, rank, modo, mapa, replay, video) {
        const embed = montaCard(
            '🎮 Nova solicitação de análise',
            `Pedido de análise de partida enviado por <@${user.id}>.`,
            Colors.Blue
        )

        embed.addFields(
            { name: 'Nick', value: nick, inline: true },
            { name: 'Rank', value: rank, inline: true },
            { name: 'Modo', value: modo, inline: true },
            { name: 'Mapa', value: mapa, inline: true }
        )

        if (replay) {
            embed.addFields({ name: 'Replay', value: `[${replay.name}](${replay.url})`, inline: false })
        }

        if (video) {
            embed.addFields({ name: 'Vídeo', value: video, inline: false })
        }

        embed.setTimestamp()

        return embed
    },

    /**
     * Monta o embed de confirmação enviado de volta para o usuário que
     * solicitou a análise.
     */
    montaCardAnaliseConfirmacao(nick, rank, modo, mapa, replay, video) {
        const embed = montaCard(
            'Análise enviada! ✅',
            `Fique atento no chat <#${process.env.SUBS_CHANNEL}>, lá a staff irá te chamar quando for sua vez de ser analisado(a)!.`,
            Colors.Green
        )

        embed.addFields(
            { name: 'Nick', value: nick, inline: true },
            { name: 'Rank', value: rank, inline: true },
            { name: 'Modo', value: modo, inline: true },
            { name: 'Mapa', value: mapa, inline: true },
            { name: 'Material enviado', value: replay ? `Replay: ${replay.name}` : `Link: ${video}`, inline: false }
        )

        return embed
    }
}
