const DiscordPlayer = require('discord-player');

const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const messageEvent = require('../messageEvent');

const command = {
    data: new SlashCommandBuilder()
        .setName("stopsong")
        .setDescription("Stop the current playing song"),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     * @param {DiscordPlayer.Player} player
     */
    async execute(interaction, client, hypixel, player) {
        const queue = player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            interaction.reply("There is no song playing");
            return;
        }

        queue.destroy();

        interaction.reply("The music has been stopped :(");
    }
};

module.exports = command;