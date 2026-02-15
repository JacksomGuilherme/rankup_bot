const { Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, StringSelectMenuBuilder } = require('discord.js')
const { montaCard } = require('../public/cards.js')

let rankings = [
    { label: 'Bronze 1', value: 'B1' },
    { label: 'Bronze 2', value: 'B2' },
    { label: 'Bronze 3', value: 'B3' },
    { label: 'Prata 1', value: 'P1' },
    { label: 'Prata 2', value: 'P2' },
    { label: 'Prata 3', value: 'P3' },
    { label: 'Ouro 1', value: 'O1' },
    { label: 'Ouro 2', value: 'O2' },
    { label: 'Ouro 3', value: 'O3' },
    { label: 'Platina 1', value: 'PL1' },
    { label: 'Platina 2', value: 'PL2' },
    { label: 'Platina 3', value: 'PL3' },
    { label: 'Diamante 1', value: 'D1' },
    { label: 'Diamante 2', value: 'D2' },
    { label: 'Diamante 3', value: 'D3' },
    { label: 'Champion 1', value: 'C1' },
    { label: 'Champion 2', value: 'C2' },
    { label: 'Champion 3', value: 'C3' },
    { label: 'Grand Champion 1', value: 'GC1' },
    { label: 'Grand Champion 2', value: 'GC2' },
]

function getRankingLabel(ranking) {
    return rankings.find(r => {
        return r.value === ranking
    }).label
}


const blankFieldInline = {
    name: "\u200B",
    value: "\u200B",
    inline: true
}

const blankFieldVertical = {
    name: "\u200B",
    value: "\u200B",
    inline: false
}

module.exports = {
    montaCardBoost(userId) {
        const embed = montaCard(
            'Boost de Conta',
            `Olá <@${userId}>! 
Irei coletar algumas informações para te dar o valor para seu boost de conta ok?`,
            Colors.Red
        )
            .addFields(
                {
                    name: '💰 Valores',
                    value: `O valor para cada rank é de **R$ 10,00**.
O valor para alcançar GC2 é **R$10,00** mais caro.
O valor para reward GC é **R$10,00**.
Caso queira que o Mauteii boost a conta jogando junto com você, será cobrado o dobro do valor.`
                }
            )
            .setFooter({ text: 'Clique no botão abaixo para iniciar a cotação do seu boost.' })

        const rows = []

        rows.push(new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('boost_budget')
                .setLabel('Iniciar Cotação')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Cancelar')
                .setStyle(ButtonStyle.Secondary)
        ))

        return {
            embeds: [embed],
            components: rows,
            flags: MessageFlags.Ephemeral
        }
    },

    montaCardCotacao(userId, atual, actualRank) {
        let description = `<@${userId}> `
        let rankPlaceHolder = 'Qual seu ranking atual?'

        if (atual) {
            description += 'selecione seu ranking atual:'
        } else {
            description += 'selecione o ranking que quer chegar:'
            rankPlaceHolder = 'Qual ranking quer chegar?'
        }

        const embed = montaCard(
            'Cotação',
            description,
            Colors.Red
        )

        let rankingsAux = rankings
        if (!atual) {
            const index = rankingsAux.findIndex(r => r.value === actualRank)
            rankingsAux = rankingsAux.slice(index + 1)
        }

        const rows = []

        rows.push(new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('actual_ranking')
                .setPlaceholder(rankPlaceHolder)
                .addOptions(rankingsAux)
        ))

        rows.push(new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Próximo')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Cancelar')
                .setStyle(ButtonStyle.Secondary)
        ))


        return { embeds: [embed], components: rows, flags: MessageFlags.Ephemeral }
    },

    montaCardFinal(userId, actualRank, targetRank) {
        let description = `<@${userId}> confirme os rankings:`

        const embed = montaCard(
            'Cotação',
            description,
            Colors.Red
        )

        embed.addFields(
            {
                name: "Ranking atual:",
                value: getRankingLabel(actualRank),
                inline: true
            },
            {
                name: "Ranking final:",
                value: getRankingLabel(targetRank),
                inline: true
            }
        )

        const rows = []

        const options = []

        if (targetRank !== "GC2" && targetRank !== "GC3" &&
            (targetRank.substring(0, 1) === 'C' || targetRank.substring(0, 1) === 'G')) {
            options.push({
                label: 'Duo Boost (jogar junto)',
                description: 'Valor dobra',
                value: 'duo'
            })
        }

        if (targetRank.substring(0, 2) === 'GC') {
            options.push({
                label: 'Reward de GC',
                description: 'R$ 10,00',
                value: 'reward'
            })
        }

        if (options.length > 0) {
            embed.setFooter({ text: 'Caso queira adicionar um serviço extra verifique os disponíveis abaixo' })

            rows.push(new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('extras')
                    .setPlaceholder('Escolha os extras desejados')
                    .setMinValues(0)
                    .setMaxValues(options.length)
                    .addOptions(options)
            ))
        }

        rows.push(new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('calc')
                .setLabel('Calcular')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Cancelar')
                .setStyle(ButtonStyle.Secondary)
        ))


        return { embeds: [embed], components: rows, flags: MessageFlags.Ephemeral }
    },

    montaCardTotal(userId, totalObject, targetRank, nick, plataforma) {
        let description = `<@${userId}> aqui está o total da sua cotação de boost:`

        const embed = montaCard(
            'Cotação',
            description,
            Colors.Red
        )

        embed.addFields(
            {
                name: "Nick",
                value: nick,
                inline: true
            },
            {
                name: "Plataforma",
                value: plataforma,
                inline: true
            },
            blankFieldInline
        )

        embed.addFields(blankFieldVertical)

        embed.addFields(
            {
                name: "Ranking atual:",
                value: totalObject.actualRanking,
                inline: true
            },
            {
                name: "Ranking final:",
                value: totalObject.targetRanking,
                inline: true
            },
            blankFieldInline
        )
        embed.addFields(
            {
                name: "Duo Boost (jogar junto)",
                value: totalObject.duo ? "Sim" : "Não",
                inline: true
            }
        )
        if (targetRank.substring(0, 2) === "GC") {
            embed.addFields(
                {
                    name: "Reward de GC",
                    value: totalObject.reward ? "Sim" : "Não",
                    inline: true
                }
            )
        }

        embed.addFields(blankFieldVertical)

        embed.addFields(
            {
                name: "Total de serviços",
                value: `R$ ${totalObject.total},00`
            }
        )

        const rows = []

        rows.push(new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('send')
                .setLabel('Enviar')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Cancelar')
                .setStyle(ButtonStyle.Secondary)
        ))


        return { embeds: [embed], components: rows, flags: MessageFlags.Ephemeral }
    },

    handleCancel(i, collector, interaction) {
        collector.stop()

        setTimeout(async () => {
            interaction.deleteReply()
        }, 5000)

        return i.update({
            content: 'Cotação cancelada.',
            embeds: [],
            components: []
        })
    },

    calcularTotal(actualRank, targetRank, duoBoost, reward) {
        const order = [
            'B1', 'B2', 'B3',
            'P1', 'P2', 'P3',
            'O1', 'O2', 'O3',
            'PL1', 'PL2', 'PL3',
            'D1', 'D2', 'D3',
            'C1', 'C2', 'C3',
            'GC1', 'GC2'
        ]

        const startIndex = order.indexOf(actualRank)
        const endIndex = order.indexOf(targetRank)

        const ranksToClimb = endIndex - startIndex

        if (ranksToClimb <= 0) {
            return null
        }

        let total = ranksToClimb * 10

        if (targetRank === 'GC2') {
            total += 10
        }

        if (reward) total += 10
        
        if (duoBoost) total *= 2

        return {
            actualRanking: getRankingLabel(actualRank),
            targetRanking: getRankingLabel(targetRank),
            duo: duoBoost,
            reward: reward,
            total
        }
    },
}