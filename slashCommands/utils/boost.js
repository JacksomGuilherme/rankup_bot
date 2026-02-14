const { SlashCommandBuilder, MessageFlags } = require('discord.js')
const { loadApprovals, saveApprovals } = require('../../public/approvals')

const { montaCardBoost, montaCardCotacao, montaCardFinal, montaCardTotal, calcularTotal, handleCancel } = require('../../controllers/boostController.js')

const approvals = loadApprovals()


module.exports = {
    data: new SlashCommandBuilder()
        .setName('boost')
        .addStringOption(option =>
            option
                .setName('nick')
                .setDescription('Seu nick no jogo')
                .setRequired(true)
                .setMaxLength(32)
        )
        .addStringOption(option =>
            option
                .setName('plataforma')
                .setDescription('Onde você joga')
                .setRequired(true)
                .addChoices(
                    { name: 'Steam', value: 'Steam' },
                    { name: 'Epic Games', value: 'Epic' }
                )
        )
        .setDescription('Wizard de cotação'),

    async execute(interaction) {

        await interaction.reply(montaCardBoost(interaction.user.id))
        let message = await interaction.fetchReply()

        const session = {
            step: 1,
            actualRank: null,
            targetRank: null,
            duo: false,
            reward: false,
            totalObject: null,
            totalCard: null,
            nick: interaction.options.get('nick').value,
            plataforma: interaction.options.get('plataforma').value
        }

        const stepHandlers = {
            1: handleStep1, //inicio
            2: handleStep2, //coletar ranking atual
            3: handleStep3, //coletar ranking destino
            4: handleStep4, //coletar extras (Jogar duo e reward)
            5: sendToDMAndStaff //enviar as mensagens
        }

        const collector = message.createMessageComponentCollector({
            time: 300_000,
            filter: i => i.user.id === interaction.user.id
        })

        collector.on('collect', async (i) => {

            if (i.user.id !== interaction.user.id) return

            if (i.isButton() && i.customId === 'cancel')
                return handleCancel(i, collector, interaction)

            const handler = stepHandlers[session.step]
            if (!handler) return

            try {
                await handler(i, session, interaction)
            } catch (err) {
                console.error(err)
            }
        })

        collector.on('end', async (_, reason) => {
            if (reason === 'time') {
                try {
                    await interaction.editReply({
                        content: 'Tempo esgotado.',
                        embeds: [],
                        components: []
                    })

                    setTimeout(async () => {
                        await interaction.deleteReply()
                    }, 5000)
                } catch { }
            }
        })
    }
}

async function handleStep1(i, session, interaction) {
    if (!i.isButton()) return

    session.step = 2
    await i.update(montaCardCotacao(interaction.user.id, true))
}

async function handleStep2(i, session, interaction) {

    if (i.isStringSelectMenu() && i.customId === 'actual_ranking') {
        session.actualRank = i.values[0]
        return i.deferUpdate()
    }

    if (i.isButton() && i.customId === 'next') {

        if (!session.actualRank)
            return i.update({ content: 'Escolha um rank antes de continuar!', flags: MessageFlags.Ephemeral })

        session.step = 3
        return i.update(
            montaCardCotacao(interaction.user.id, false, session.actualRank)
        )
    }
}

async function handleStep3(i, session, interaction) {

    if (i.isStringSelectMenu() && i.customId === 'actual_ranking') {
        session.targetRank = i.values[0]
        return i.deferUpdate()
    }

    if (i.isButton() && i.customId === 'next') {

        if (!session.targetRank)
            return i.update({ content:'Escolha um rank antes de continuar!', flags: MessageFlags.Ephemeral })

        session.step = 4
        return i.update(
            montaCardFinal(interaction.user.id, session.actualRank, session.targetRank)
        )
    }
}

async function handleStep4(i, session, interaction) {

    if (i.isStringSelectMenu()) {
        session.duo = i.values.includes('duo')
        session.reward = i.values.includes('reward')
        return i.deferUpdate()
    }

    if (i.isButton() && i.customId === 'calc') {
        session.totalObject = calcularTotal(
            session.actualRank,
            session.targetRank,
            session.duo,
            session.reward
        )

        session.totalCard = montaCardTotal(
            interaction.user.id,
            session.totalObject,
            session.targetRank,
            session.nick,
            session.plataforma
        )

        return i.update(session.totalCard)
    }

    if (i.isButton() && i.customId === 'send') {
        session.step = 5
        return sendToDMAndStaff(i, session, interaction)
    }
}

async function sendToDMAndStaff(i, session, interaction) {

    const dm = await interaction.user.createDM()

    const dmMsg = await dm.send({
        content: 'Caso queira cancelar sua requisição reaja com ❌',
        embeds: session.totalCard.embeds
    })

    await dmMsg.react('❌')

    const staffCh = interaction.client.channels.cache.get(process.env.STAFF_CHANNEL)
    const embed = session.totalCard.embeds[0]
    embed.setDescription(`Pedido de boost de <@${interaction.user.id}>`)

    const staffMsg = await staffCh.send({
        content: 'Reagir com ✅ concluir | ❌ cancelar',
        embeds: [embed]
    })

    await staffMsg.react('✅')
    await staffMsg.react('❌')

    approvals[dmMsg.id] = {
        linkedId: staffMsg.id,
        userId: interaction.user.id,
        status: "PENDING"
    }

    approvals[staffMsg.id] = {
        linkedId: dmMsg.id,
        userId: interaction.user.id,
        status: "PENDING"
    }

    saveApprovals(approvals)

    return i.update({
        content: 'Te enviei a cotação na DM! 📩',
        embeds: [],
        components: [],
        flags: MessageFlags.Ephemeral
    })
}