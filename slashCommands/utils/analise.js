const { SlashCommandBuilder, MessageFlags } = require('discord.js')

const { montaCardAnaliseStaff, montaCardAnaliseConfirmacao } = require('../../controllers/analiseController.js')
const { validarReplay, validaUrlVideo } = require('../../utils/replayValidator.js')
const { saveAnaliseMessage } = require('../../repositories/analises.repository.js')

// Ajuste essa lista se quiser incluir/remover ranks.
const rankChoices = [
    'Bronze 1', 'Bronze 2', 'Bronze 3',
    'Prata 1', 'Prata 2', 'Prata 3',
    'Ouro 1', 'Ouro 2', 'Ouro 3',
    'Platina 1', 'Platina 2', 'Platina 3',
    'Diamante 1', 'Diamante 2', 'Diamante 3',
    'Champion 1', 'Champion 2', 'Champion 3',
    'Grand Champion 1', 'Grand Champion 2', 'Grand Champion 3',
    'Supersonic Legend'
].map(rank => ({ name: rank, value: rank }))

// Ajuste essa lista conforme o pool de mapas competitivos vigente.
const mapChoices = [
    'DFH Stadium', 'Mannfield', 'Champions Field', 'Neo Tokyo',
    'Urban Central', 'Beckwith Park', 'Utopia Coliseum', 'Wasteland',
    'Farmstead', 'Salty Shores', 'Deadeye Canyon', 'Forbidden Temple',
    'Rivals Arena', 'Neon Fields', 'Estadio Vida', 'AquaDome',
    'Starbase ARC', 'Sovereign Heights', 'Throwback Stadium'
].map(mapa => ({ name: mapa, value: mapa }))

module.exports = {
    data: new SlashCommandBuilder()
        .setName('analise')
        .setDescription('Envie uma partida ranqueada para análise da staff')
        .addStringOption(option =>
            option
                .setName('nick')
                .setDescription('Seu nick no jogo')
                .setRequired(true)
                .setMaxLength(32)
        )
        .addStringOption(option =>
            option
                .setName('rank')
                .setDescription('Seu rank competitivo atual')
                .setRequired(true)
                .addChoices(...rankChoices)
        )
        .addStringOption(option =>
            option
                .setName('modo')
                .setDescription('Modo de jogo da partida')
                .setRequired(true)
                .addChoices(
                    { name: '1v1 (Duelo)', value: '1v1' },
                    { name: '2v2 (Doubles)', value: '2v2' },
                    { name: '3v3 (Standard)', value: '3v3' }
                )
        )
        .addStringOption(option =>
            option
                .setName('mapa')
                .setDescription('Mapa em que a partida foi jogada')
                .setRequired(true)
                .addChoices(...mapChoices)
        )
        .addAttachmentOption(option =>
            option
                .setName('replay')
                .setDescription('Arquivo de replay (.replay) da partida')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('video')
                .setDescription('Link do vídeo da partida (YouTube, Twitch, etc.)')
                .setRequired(false)
        ),

    async execute(interaction) {
        const nick = interaction.options.getString('nick')
        const rank = interaction.options.getString('rank')
        const modo = interaction.options.getString('modo')
        const mapa = interaction.options.getString('mapa')
        const replay = interaction.options.getAttachment('replay')
        const video = interaction.options.getString('video')

        if (!replay && !video) {
            return interaction.reply({
                content: '**Você precisa anexar o replay ou enviar um link de vídeo da partida.**',
                flags: MessageFlags.Ephemeral
            })
        }

        await interaction.reply({
            content: 'Recebi sua partida, validando o arquivo... 🔎',
            flags: MessageFlags.Ephemeral
        })

        if (replay) {
            const { valido, motivo } = await validarReplay(replay)

            if (!valido) {
                return interaction.editReply({
                    content: `**Não foi possível aceitar o replay:** ${motivo}\nSe preferir, envie o link do vídeo da partida em vez do arquivo.`
                })
            }
        }

        if (video) {
            const { valido, motivo } = await validaUrlVideo(video)
            
            if (!valido) {
                return interaction.editReply({
                    content: `**Não foi possível aceitar o link do video:** ${motivo}.`
                })
            }
        }

        const staffCh = interaction.client.channels.cache.get(process.env.STAFF_CHANNEL)

        if (staffCh) {
            const staffMsg = await staffCh.send({
                content: 'Reagir com ✅ concluir | ❌ cancelar',
                embeds: [montaCardAnaliseStaff(interaction.user, nick, rank, modo, mapa, replay, video)]
            })
            await staffMsg.react('✅')
            await staffMsg.react('❌')
            saveAnaliseMessage(interaction.user.id, staffMsg.id)
        }

        return interaction.editReply({
            content: null,
            embeds: [montaCardAnaliseConfirmacao(nick, rank, modo, mapa, replay, video)]
        })
    }
}
