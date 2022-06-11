const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const { Player } = require("discord-player");

const command = {
    data: new SlashCommandBuilder()
        .setName("setapikey")
        .setDescription("(Admin Command) Change the API key")
        .addStringOption(option => option.setName("key").setDescription("API Key").setRequired(true)),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     * @param {Player} player
     */
    async execute(interaction, client, hypixel, player) {
        if (!interaction.memberPermissions.has("ADMINISTRATOR") && !interaction.member.roles.includes(interaction.guild.roles.cache.get(cfg.admin_role_id))) {
            interaction.reply("You do not have permission to use this command!");
            return;
        }

        const file = interaction.options.getString("file");
        fs.readFile("env.json", (err, data) => {
            if (err) throw err;

            data = JSON.parse(data);
            data.api_key = interaction.options.getString("key");
            data = JSON.stringify(data);
            fs.writeFile("env.json", data, (err, data) => {
                if (err) throw err;
                interaction.reply("Changed the API key, you should now delete this message");
            })
        });
    }
}

module.exports = command;
