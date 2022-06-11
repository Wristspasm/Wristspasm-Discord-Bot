const cfg = require("../../config.json")

const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

const command = {
    data: new SlashCommandBuilder()
        .setName("gstats")
        .setDescription("Shows the guilds stats"),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel, player) {
        hypixel.getGuild("id", cfg.wristspasm_id).then(guild => {
            const embed = new Discord.MessageEmbed();
            embed.setColor("#ffff55");
            embed.setTitle("Wristspasm Guild Stats");
            embed.addField("Level", `${guild.level}`, true);
            embed.addField("GEXP", `${guild.experience}`, true);
            embed.addField("Member Count", `${guild.members.length}`, true);
            embed.addField("Weekly GEXP", `${guild.totalWeeklyGexp}`, true);
            embed.addField("Legacy Rank", `${guild.legacyRank}`, true);
            interaction.reply({ embeds: [ embed ] });
        }).catch(err => {
            console.error(err);
            interaction.reply(`There was an error while running this command, Console Error: \`${err}\``);
        })
    }
}

module.exports = command;
