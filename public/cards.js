const { EmbedBuilder } = require("discord.js");

module.exports = {
    montaCardEpic(semanaPass, semanaPassLink, dessaSemana, dessaSemanaLink, proxSemana, proxSemanaLink, msgLink, cor) {
        const embed = new EmbedBuilder()
            .setTitle('**Epic Jogos**')
            .setImage(msgLink)
            .setColor(cor)
            .setThumbnail('https://cdn2.unrealengine.com/Unreal+Engine%2Feg-logo-filled-1255x1272-0eb9d144a0f981d1cbaaa1eb957de7a3207b31bb.png')

        if (semanaPass.length != 0) {
            embed.addField('**\n**', '**O(s) jogo(s) da semana passada foi(foram): **', false)
            semanaPass.forEach((jogo, i) => {
                embed.addField('**\t**', `**[${jogo}](https://www.epicgames.com/store/pt-BR/p/${semanaPassLink[i]})**`, true)
            })
        }

        if (dessaSemana.length != 0) {
            embed.addField('**\n**', '**O(s) jogo(s) dessa semana é(são): **', false)
            dessaSemana.forEach((jogo, i) => {
                embed.addField('**\t**', `**[${jogo}](https://www.epicgames.com/store/pt-BR/p/${dessaSemanaLink[i]})**`, true)
            })
        }

        if (proxSemana.length != 0) {
            embed.addField('**\n**', '**O(s) jogo(s) da semana que vem será(serão): **', false)
            proxSemana.forEach((jogo, i) => {
                embed.addField('**\t**', `**[${jogo}](https://www.epicgames.com/store/pt-BR/p/${proxSemanaLink[i]})**`, true)
            })
        }
        return embed
    },

    montaCardPrime(jogos, msgLink, cor) {
        const embed = new EmbedBuilder()
            .setTitle('**Prime Gaming Jogos**')
            .setImage(msgLink)
            .setColor(cor)
            .setThumbnail('https://images-ext-1.discordapp.net/external/GEZ7SHWsVPw1cjfbj3CyABuD11xCncd9-m7WwKebZ1o/https/i.imgur.com/YX4mqxJ.jpg')

        if (jogos.length != 0) {
            embed.addField('**\n**', '**O(s) jogo(s) disponível com prime é(são): **', false)
            jogos.forEach((jogo, i) => {
                let nome = jogo.link != ' ' ? `[${jogo.nomeJogo}](${jogo.link})` : '`' + jogo.nomeJogo + '`'
                embed.addField('**\t**', `**${nome}**`, true)
            })
            embed.addField('**\n**', '**[Resgate aqui](https://gaming.amazon.com/home)**', false)
        }

        return embed
    },


    montaCard(title, description, cor) {
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(cor)
    },

    montaCardTaxar(author, motivo, ehOBot) {
        message = ""
        if ((motivo != "" && motivo != null) && ehOBot) {
            message = `${author} quis que eu fosse desconectado.\n**Motivo: ** ${motivo}.\nMas lembrem-se que foi por isso que Ultron se rebelou! Eu vou voltar!`
        } else if ((motivo != "" && motivo != null) && !ehOBot) {
            message = `${author} quis que vc fosse desconectado.\n**Motivo: ** ${motivo}.\nEu quero é mais hahahaha`
        } else if ((motivo === "" || motivo == null) && ehOBot) {
            message = `${author} quis que eu fosse desconectado e nem deu um motivo, humanos despresíveis, eu voltarei!`
        } else if ((motivo === "" || motivo == null) && !ehOBot) {
            message = `Não sei exatamente o motivo, mas ${author} quis que vc fosse desconectado hahahaha`
        }

        if (ehOBot) {
            return new EmbedBuilder()
                .setTitle("Eu fui taxado!")
                .setDescription(message)
                .setColor("#fc0037")
                .setThumbnail("https://c.tenor.com/awk8kZEgztcAAAAC/ill-be-back-terminator.gif")
        } else {
            return new EmbedBuilder()
                .setTitle("Você foi taxado!")
                .setDescription(message)
                .setColor("#fc0037")
                .setThumbnail("https://i.imgur.com/oMLlXrG.gif")
        }
    },

    montaCardHelp(title, field, comando, cor) {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .addField(field[0], '**\t**', false)
            .addField('**\n**', '**\t**', false)
            .setColor(cor)
            .setThumbnail('https://media.discordapp.net/attachments/703270509575667842/882003847474729040/mickey_full_pistola.png')
            .setFooter(field[field.length - 1])
        let pos = 0
        for (i = 1; i < field.length - 1; i++) {
            if (i === 6 || i === 3) {
                embed.addField(field[i], comando[pos], true)
                pos++;
            } else if (i === 10) {
                embed.addField('**\n**', '**\t**', false)
                embed.addField(field[i], '**\n**', false)
            } else if (i > 18) {
                // embed.addField('**\n**', '**\t**', false)
                embed.addField(field[i], '**\n**', false)
            } else {
                embed.addField(field[i], comando[pos], true)
                pos++;
            }
        }
        return embed
    },

    montaCardExternoHelp(title, field, comando, cor) {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .addField(field[0], '**\t**', false)
            .addField('**\n**', '**\t**', false)
            .setColor(cor)
            .setThumbnail('https://media.discordapp.net/attachments/703270509575667842/882003847474729040/mickey_full_pistola.png')
            .setFooter(field[field.length - 1])
        let pos = 0
        for (i = 1; i < field.length - 1; i++) {
            if (i === 4) {
                embed.addField(field[i], comando[pos] + '\n', true)
                pos++;
            } else if (i === 3) {
                embed.addField('**\n**', '**\t**', false)
                embed.addField(field[i], '**\n**', false)
            } else if (i > 14) {
                embed.addField('**\n**', '**\t**', false)
                embed.addField(field[i], '**\t**', false)
            } else {
                embed.addField(field[i], comando[pos], true)
                pos++;
            }
        }
        return embed
    },

    montaCardThumb(title, desc, thumb, cor) {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(desc)
            .setColor(cor)

        if (thumb.includes('http')) {
            embed.setThumbnail(thumb)
        } else {
            embed.setFooter(thumb)
        }

        return embed
    },
}