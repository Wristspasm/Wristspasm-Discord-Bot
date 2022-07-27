const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const command = {
    data: new SlashCommandBuilder()
        .setName("homosexuality")
        .setDescription("Wanna know how homo you are?")
        .addUserOption(option => option.setName("user").setDescription("Self explanitory").setRequired(false)),

     /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     * @param {DiscordPlayer.Player} player
     */
    async execute(interaction, client) {
        let id;
        let img;
        if (interaction.options.getUser("user") == null) {
            id = interaction.user.id;
            img = interaction.user.avatarURL();
        } else {
            id = interaction.options.getUser("user").id;
            img = interaction.options.getUser("user").avatarURL();
        }

        let homo = 0;
        fs.readFile(`data/homo/${id}`, async (err, data) => {
            if (err) {
                homo = Math.floor(Math.random() * 101);
                fs.writeFile(`data/homo/${id}`, `${homo}`, err => {
                    if (err) throw err;
                });
                const embed = new Discord.MessageEmbed();
                embed.setTitle("Homosexuality Test Results");
                embed.setColor("LUMINOUS_VIVID_PINK");
                embed.setThumbnail(img);
                embed.addField("Subject", `<@${id}>`, true);
                embed.addField("Result", `${homo}%`, true);
                interaction.reply({ embeds: [ embed ] });
            } else {
                homo = Number.parseInt(data);
                const embed = new Discord.MessageEmbed();
                embed.setTitle("Homosexuality Test Results");
                embed.setColor("LUMINOUS_VIVID_PINK");
                embed.setThumbnail(img);
                embed.addField("Subject", `<@${id}>`, true);
                embed.addField("Result", `${homo}%`, true);
                embed.setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                interaction.reply({ embeds: [ embed ] });
            }
        });
    }
}

module.exports = command;
