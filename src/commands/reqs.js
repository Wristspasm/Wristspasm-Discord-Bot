const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

const command = {
    data: new SlashCommandBuilder()
        .setName("reqs")
        .setDescription("Shows weather a player meets the requirements to join the guild")
        .addStringOption(option => option.setName("ign").setDescription("Players username or UUID").setRequired(true)),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel, player) {
        const ign = interaction.options.getString("ign");

        hypixel.getPlayer(ign).then(player => {

            const bwLvl = player.stats.bedwars.level;
            const bwFkdr = player.stats.bedwars.finalKDRatio;
            const swLvl = player.stats.skywars.level;
            const swKdr = player.stats.skywars.KDRatio;
            const duelsWins = player.stats.duels.wins;
            const duelsWlr = player.stats.duels.WLRatio;
            const uhcStars = player.stats.uhc.starLevel;

            let meetReqs = "No";
            if (bwLvl >= 200 || (bwLvl >= 100 && bwFkdr >= 3) || swLvl >= 15 || (swLvl >= 10 && swKdr >= 2) || duelsWins >= 4000 || (duelsWins >= 2000 && duelsWlr >= 2) || uhcStars >= 3) meetReqs = "As Novice";
            if (bwLvl >= 400 || (bwLvl >= 300 && bwFkdr >= 5) || swLvl >= 25 || (swLvl >= 20 && swKdr >= 4) || duelsWins >= 10000 || (duelsWins >= 6000 && duelsWlr >= 4) || uhcStars >= 6) meetReqs = "As Elite";

            const statsEmbed = new Discord.MessageEmbed();
            statsEmbed.setColor("#ffff55");
            statsEmbed.setTitle(`Requirements Check for '${player.nickname}'`);
            statsEmbed.addField("BW Stars", `\`${bwLvl}\``, true);
            statsEmbed.addField("SW Stars", `\`${swLvl}\``, true);
            statsEmbed.addField("Duels Wins", `\`${duelsWins}\``, true);
            statsEmbed.addField("UHC Stars", `\`${uhcStars}\``, true);
            statsEmbed.addField("Meets Reqs?", `${meetReqs}`, false);
            interaction.reply({ embeds: [statsEmbed] });

        }).catch(err => {
            console.error(err);
            interaction.reply(`There was an error while running this command, Console Error: \`${err}\``);
        });
    }
}

module.exports = command;
