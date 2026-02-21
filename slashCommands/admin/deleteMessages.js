const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Comando para apagar mensagens')
        .addStringOption(option =>
            option
                .setName('msg_id')
                .setDescription('ID da mensagem que será apagada')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('channel_id')
                .setDescription('ID do canal onde quer apagar a mensagem')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('channel_type')
                .setDescription('Tipo do canal onde quer apagar a mensagem')
                .setRequired(true)
                .addChoices(
                    { name: 'Direct', value: 'DM' },
                    { name: 'Canal', value: 'C' }
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const messageId = interaction.options.getString('msg_id')
        const channelId = interaction.options.getString('channel_id')
        const type = interaction.options.getString('channel_type')

        try {
            if (type === "DM") {
                const user = interaction.user

                const dmChannel = await user.createDM()

                const message = await dmChannel.messages.fetch(messageId)

                await message.delete()
            } else {
                const channel = await interaction.client.channels.fetch(channelId)

                const message = await channel.messages.fetch(messageId)

                await message.delete()
            }
            await interaction.reply("Mensagem removida com sucesso!")
        } catch (error) {
            await interaction.reply("Mensagem não encontrada")
        }

    }
}