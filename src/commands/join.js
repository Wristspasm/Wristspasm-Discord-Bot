const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

const command = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Request to join the guild"),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel, player) {
        fs.readFile(`data/${interaction.user.id}`, (err, data) => {
            if (err) {
                console.error(err);
                interaction.reply("You must link your account with `/verfiy` before you can request to join the guild!");
                return;
            }

            hypixel.getPlayer(`${data}`).then(player => {
                let bwLvl = player.stats.bedwars.level;
                let swLvl = player.stats.skywars.level;
                let duelsWins = player.stats.duels.wins;
                let uhcStars = player.stats.uhc.starLevel;

                let meetReqs = "No";
                if (bwLvl >= 100 || swLvl >= 10 || duelsWins >= 4000 || uhcStars >= 3) meetReqs = "As Novice";
                if (bwLvl >= 300 || swLvl >= 15 || duelsWins >= 10000 || uhcStars >= 6) meetReqs = "As Elite";

                const statsEmbed = new Discord.MessageEmbed();
                statsEmbed.setColor("#ffff55");
                statsEmbed.setTitle("Guild join Request");
                statsEmbed.addField("IGN", `${player.nickname}`, false);
                statsEmbed.addField("Discord", `<@${interaction.user.id}>`, false);
                statsEmbed.addField("BW Stars", `\`${bwLvl}\``, true);
                statsEmbed.addField("SW Stars", `\`${swLvl}\``, true);
                statsEmbed.addField("Duels Wins", `\`${duelsWins}\``, true);
                statsEmbed.addField("UHC Stars", `\`${uhcStars}\``, true);
                statsEmbed.addField("Meets Reqs?", `${meetReqs}`, false);
                client.channels.cache.get("902775441272737842").send({ embeds: [statsEmbed] });
                interaction.reply("A join request has been sent to the guild staff");
            }).catch(err => {
                console.error(err)
                interaction.reply(`There was an error while running this command, Console Error: \`${err}\``);
                return;
            });

        });
    }
}

module.exports = command;
