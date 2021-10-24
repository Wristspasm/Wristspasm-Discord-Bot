const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder().setName("reqs").setDescription("Shows weather a player meets the requirements ot join the guild"),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {string[]} args 
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, args, client, hypixel) {
        if (args.length < 2) {
            throw "Missing Arguments";
        }

        await hypixel.getPlayer(args[1]).then(player => {

            let bwLvl = player.stats.bedwars.level;
            let swLvl = player.stats.skywars.level;
            let duelsWins = player.stats.duels.wins;
            let uhcStars = player.stats.uhc.starLevel;

            let meetReqs = "No";
            if (bwLvl >= 100 || swLvl >= 10 || duelsWins >= 2000 || uhcStars >= 3) meetReqs = "As Novice";
            if (bwLvl >= 300 || swLvl >= 15 || duelsWins >= 6000 || uhcStars >= 6) meetReqs = "As Elite";

            const statsEmbed = new Discord.MessageEmbed();
            statsEmbed.setColor("#ffff55");
            statsEmbed.setTitle(`Requirements Check for ${player.nickname}`);
            statsEmbed.addField("BW Stars", `${bwLvl}`, true);
            statsEmbed.addField("SW Stars", `${swLvl}`, true);
            statsEmbed.addField("Duels Wins", `${duelsWins}`, true);
            statsEmbed.addField("UHC Stars", `${uhcStars}`, true);
            statsEmbed.addField("Meets Reqs?", `${meetReqs}`, false);
            await interaction.reply(statsEmbed);

        }).catch(err => {
            throw err;
        });
    }
}
