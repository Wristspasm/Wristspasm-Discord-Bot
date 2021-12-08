const cfg = require("../../config.json");

const DiscordPlayer = require('discord-player');
const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');

const command = {
    data: new SlashCommandBuilder()
        .setName("playsong")
        .setDescription("Play a song in your voice channel")
        .addStringOption(option => option.setName("song").setDescription("Song link").setRequired(true)),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     * @param {DiscordPlayer.Player} player
     */
    async execute(interaction, client, hypixel, player) {
        const song = interaction.options.getString("song");

        const res = await player.search(song, {
            requestedBy: interaction.member,
            searchEngine: DiscordPlayer.QueryType.AUTO
        });

        if (!res || !res.tracks.length) {
            interaction.reply("No Results found");
            return;
        }

        const queue = player.createQueue(interaction.guild, {
            metadata: interaction.channel
        });

        try {
            const member = client.guilds.cache.get(cfg.guild_id).members.cache.get(interaction.user.id);
            if (!queue.connection) await queue.connect(member.voice.channel)
        } catch {
            player.deleteQueue(interaction.guildId);
            interaction.reply("Was unable to join voice channel");
            return;
        }

        if (res.playlist) {
            queue.addTrack(res.tracks);
        } else { 
            queue.addTrack(res.tracks[0]);
        }

        if (!queue.playing) await queue.play();

        interaction.reply(`Now playing your ${res.playlist ? "playlist" : "track"}`);
    }
};

module.exports = command;