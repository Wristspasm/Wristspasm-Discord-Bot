process.on('uncaughtException', function (err) {console.log(err.stack)})
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName("check")
        .setDescription("Check if you input meets requirements for the guild.")
        .addStringOption(option => option.setName("ign").setDescription("Players username or UUID").setRequired(true)),

	async execute(interaction, client) {
        const ign = interaction.options.getString("ign");
        hypixel.getPlayer(`${ign}`).then(player => {
            let bwLvl = player.stats.bedwars.level;
            let swLvl = player.stats.skywars.level;
            let duelsWins = player.stats.duels.wins;
            let uhcStars = player.stats.uhc.starLevel;

            let meetReqs = "No";
            if (bwLvl >= 100 || swLvl >= 10 || duelsWins >= 4000 || uhcStars >= 3) meetReqs = "As Novice";
            if (bwLvl >= 300 || swLvl >= 15 || duelsWins >= 10000 || uhcStars >= 6) meetReqs = "As Elite";

            const statsEmbed = new MessageEmbed()
                .setColor("#ffff55")
                .setTitle("Guild join Request")
                .addField("Username", `${player.nickname}`)
                .setThumbnail(`https://www.mc-heads.net/avatar/${player.nickname}`) 
                .addField("BW Stars", `\`${bwLvl}\``, true)
                .addField("\u200B", "\u200B", true)
                .addField("SW Stars", `\`${swLvl}\``, true)
                .addField("Duels Wins", `\`${duelsWins}\``, true )
                .addField("UHC Stars", `\`${uhcStars}\``, true )
                .addField("Meets Reqs", `${meetReqs}`)
                interaction.reply({ embeds: [statsEmbed] });
        }).catch(err => {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setAuthor({ name: 'An Error has occured!'})
                .setDescription(`${err}`)
                .setFooter({ text: '?? Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
            interaction.reply({ embeds: [errorEmbed] });
        });
    }
}
