const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');

const command = {
    data: new SlashCommandBuilder()
        .setName("repo")
        .setDescription("Get the bot repository"),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel, player) {
        const embed = new Discord.MessageEmbed();
        embed.setColor("#5555ff");
        embed.setTitle("Wristspasm Bot Repository");
        embed.setDescription("https://github.com/Wristspasm/Wristspasm");
        interaction.reply({ embeds: [embed] });
    }
}

module.exports = command;
