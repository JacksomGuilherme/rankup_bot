const { Client, GatewayIntentBits, Partials, Collection, Events } = require('discord.js');
require("dotenv").config();

const express = require('express');
const app = express();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent, // Required if you need to read message content
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
});

client.commands = new Collection()

client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

require('./handler/handler.js')(client)
require('./handler/interactions.js')(client)

app.use(express.json());

app.get('/event', (req, res) => {
  res.status(200).json({message:"Olá Mundo"})
});

app.listen(process.env.PORT || 3000, () => {
  console.log('API rodando 🚀');
});

client.login(process.env.TOKEN)

