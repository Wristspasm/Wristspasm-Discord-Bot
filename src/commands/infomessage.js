const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("infomessage")
        .setDescription("(Admin Command) send the info message"),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel) {

        if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
            interaction.reply("You must be Admin or higher to use this command!");
            return;
        }

        const rulesEmbed = new Discord.MessageEmbed();
        rulesEmbed.setColor("#ffff55");
        rulesEmbed.setTitle("Rules");
        rulesEmbed.setDescription("Follow the Discord ToS https://discord.com/terms/\nDon't do anything illegal according to the US law\nDo not advertise without permission from a Moderator or Admin (this does not apply in game)\nNo alt’s");

        const reqsEmbed = new Discord.MessageEmbed();
        reqsEmbed.setColor("#ffff55");
        reqsEmbed.setTitle("Guild Requirements")
        reqsEmbed.setDescription("**Novice**\n__Bedwars__ - 200 Stars OR 100 Stars and 3 FKDR\n__Skywars__ - 15 Stars OR 10 Stars and 2 KDR\n__Duels__ - 4,000 Wins OR 2,000 Wins and 2 WLR\n__UHC__ - 3 Stars\n__Skyblock__ - 25 Skill Average OR Dungeons Catacombs 20 OR 100 Million Networth\n\n**Elite**\n__Bedwars__ - 400 Stars OR 300 Stars and 5 FKDR\n__Skywars__ - 25 Stars OR 20 Stars and 4 KDR\n__Duels__ - 10,000 Wins OR 6,000 Wins and 4 WLR\n__UHC__ - 6 Starsn\n__Skyblock__ - 35 Skill Average OR Dungeons Catacombs 30 OR 300 Million Networth\n\n**You only need to fill one of the requirements (this goes for both novice and elite)**\n\n**GEXP Requirement** 50k per week");

        const verifyEmbed = new Discord.MessageEmbed();
        verifyEmbed.setColor("#ffff55");
        verifyEmbed.setTitle("How to verify your account");
        verifyEmbed.setDescription("**Step 1** Link your discord account on Hypixel https://hypixel.net/threads/guide-how-to-link-discord-to-your-hypixel-profile.3179351/\n**Step 2** use `/verify <IGN>` in <#600325477537939476>");

        interaction.channel.send({ embeds: [ rulesEmbed, reqsEmbed, verifyEmbed ] });
        interaction.reply("Info Message sent! Please delete this message.");
    }
}
