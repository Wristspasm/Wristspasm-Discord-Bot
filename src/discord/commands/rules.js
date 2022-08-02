const { SlashCommandBuilder } = require('@discordjs/builders');
process.on('uncaughtException', function (err) {console.log(err.stack)})
const { MessageEmbed } = require('discord.js')
const config = require('../../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
    .setName("information")
    .setDescription("."),

    async execute(interaction, client, member) {
        if ((await member).roles.cache.has(config.discord.commandRole)) {
            const commandMessage = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Wrist Spasm Guild Information')
                .setDescription(`
                **Requirements**\n
                **Novice**
                Bedwars - 200 Stars
                Skywars - 15 Stars
                Duels - 2,500 Wins
                Skyblock - 2,500 Senither Weight\n
                **Elite**
                Bedwars - 400 Stars
                Skywars - 25 Stars
                Duels - 10,000 Wins
                Skyblock - 4,000 Senither Weight\n
                **Guild Experience**
                Guild Experience Requirements is 50,000 Experience per week (4 hours of playtime). 
                If You are taking a break or going to vacation, please use \`/inactivity\` command, so we are aware. break **CANNOT** be more than 14 days.
                When these checks happen anyone who has not meet the requirement will be kicked, however you are still allowed to apply to join back.\n
                **Who are we?**
                The guild 'WristSpasm' was created back in 2018, Since then the guild has been being growing and rising gaining new members, experience and a lot of fun!
                By that time we've achieved a lot of goals.
                We are mainly looking for active players who will be friendly and take a part in the community.
                Around the guild you can find players who play any games from skyblock to bedwars.\n
                **Why Wrist Spasm?**
                Here are some reasons why you should join infinity!
                We're currently #79 Guild on Hypixel Network.
                You can meet up new friends and find a team easily and quickly!
                You will always have someone to talk with!
                `)
               .setThumbnail('https://cdn.discordapp.com/icons/600311056627269642/75aa2f84c75fe2cf2aba97483f788b89.png?size=4096')
                .setFooter({ text: 'WristSpasm | Developed by DuckySoLucky#5181' })
            await interaction.reply({ embeds: [commandMessage] })
        } else {
            await interaction.reply({ content: 'You do not have permission to run this command.', ephemeral: true })
        }
    }
}