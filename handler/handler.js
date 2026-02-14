const { REST, Routes, Events, MessageFlags } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = async (client) => {

    const commands = [];
    const foldersPath = path.join(process.cwd(), '/slashCommands')
    const commandFolders = fs.readdirSync(foldersPath)
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder)
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'))
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file)
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
                client.commands.set(command.data.name, command)
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    const rest = new REST().setToken(process.env.TOKEN);
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`)
            const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
            console.log(`Successfully reloaded ${data.length} application (/) commands.`)
        } catch (error) {
            console.error(error)
        }
    })()

    client.once(Events.ClientReady, (readyClient) => {
        client.on(Events.MessageCreate, async (message) => {
            if(message.author.bot) return
            
            if (message.interaction === null || message.interaction.type !== 2) {
                if (message.channelId === process.env.COMMAND_CHANNEL) {
                    message.delete()
                }
            }
        })
        client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand()) return

            if (interaction.commandName === 'boost' && interaction.channelId !== process.env.COMMAND_CHANNEL) {
                setTimeout(async () => {
                    interaction.deleteReply()
                }, 10000)
                return interaction.reply({
                    content: `Ação não permitida. Só é possível executar esse comando em <#${process.env.COMMAND_CHANNEL}>`,
                    ephemeral: true
                })
            }

            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: 'There was an error while executing this command!',
                        flags: MessageFlags.Ephemeral,
                    });
                } else {
                    await interaction.reply({
                        content: 'There was an error while executing this command!',
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }
        });
    })
    
}