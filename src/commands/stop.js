const DiscordPlayer = require('discord-player');
const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("(Admin Command) Stops the nodejs process"),

     /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     * @param {DiscordPlayer.Player} player
     */
    async execute(interaction, client, hypixel, player) {
        if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
            interaction.reply("You do not have permission to use this command")
            return;
        }

        process.exit();
    }
}