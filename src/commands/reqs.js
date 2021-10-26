const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reqs")
        .setDescription("Shows weather a player meets the requirements ot join the guild")
        .addStringOption(option => option.setName("ign").setDescription("Players in game name")),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel) {
        let ign;
        // fs.readFile(`data/${interaction.user.id}`, (err, data) => {
        //     if (!err) {
        //         ign = `${data}`;
        //     }
        // });
        // if (interaction.options.getString("ign").length > 0) {
            ign = interaction.options.getString("ign");
        // }

        hypixel.getPlayer(ign).then(player => {

            let bwLvl = player.stats.bedwars.level;
            let swLvl = player.stats.skywars.level;
            let duelsWins = player.stats.duels.wins;
            let uhcStars = player.stats.uhc.starLevel;

            let meetReqs = "No";
            if (bwLvl >= 100 || swLvl >= 10 || duelsWins >= 2000 || uhcStars >= 3) meetReqs = "As Novice";
            if (bwLvl >= 300 || swLvl >= 15 || duelsWins >= 6000 || uhcStars >= 6) meetReqs = "As Elite";

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
            interaction.reply(`${err}`);
        });
    }
}
