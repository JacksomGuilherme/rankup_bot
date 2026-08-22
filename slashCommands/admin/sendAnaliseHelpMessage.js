const { SlashCommandBuilder, PermissionFlagsBits, Colors, MessageFlags } = require('discord.js')

const { montaCard } = require('../../public/cards.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help-analise')
        .setDescription('[Staff] Publica no canal de comandos as instruções do /analise')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const commandChannel = interaction.client.channels.cache.get(process.env.COMMAND_CHANNEL)

        if (!commandChannel) {
            return interaction.reply({
                content: 'Não encontrei o canal configurado em `COMMAND_CHANNEL`. Verifique o `.env`.',
                flags: MessageFlags.Ephemeral
            })
        }

        const embed = montaCard(
            '📋 Como pedir uma análise da sua partida',
            'Use o comando `/analise` aqui neste canal para enviar uma partida ranqueada e receber um retorno da staff.',
            Colors.Blue
        )

        embed.addFields(
            {
                name: 'Opções obrigatórias',
                value:
                    '**nick** – seu nick no jogo\n' +
                    '**rank** – seu rank competitivo atual\n' +
                    '**modo** – 1v1, 2v2 ou 3v3\n' +
                    '**mapa** – o mapa em que a partida foi jogada',
                inline: false
            },
            {
                name: 'Envie um dos dois',
                value:
                    '**replay** – anexe o arquivo `.replay` da partida\n' +
                    '**video** – ou envie o link do vídeo (YouTube ou Twitch)',
                inline: false
            },
            {
                name: 'Exemplo',
                value: '`/analise nick:Fulano rank:Diamante 2 modo:2v2 mapa:DFH Stadium video:https://youtu.be/exemplo`',
                inline: false
            }
        )

        embed.setFooter({ text: 'Após o envio, a staff vai analisar e responder por aqui.' })

        await commandChannel.send({ embeds: [embed] })

        return interaction.reply({
            content: `Instruções publicadas em <#${commandChannel.id}>.`,
            flags: MessageFlags.Ephemeral
        })
    }
}
