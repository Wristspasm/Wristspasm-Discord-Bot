const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');

/**
 * 
 * @param {Discord.Client} client 
 * @param {Hypixel.Client} hypixel 
 */
module.exports = (client, hypixel) => {

    const discordGuild = client.guilds.cache.get("600311056627269642");
    const guildMembersChannel = discordGuild.channels.cache.get("821560951677386762");
    const guildLevelChannel = discordGuild.channels.cache.get("821560990083842089");
    const guildWeeklyExpChannel = discordGuild.channels.cache.get("903085205051555850");

    setInterval(() => {
        hypixel.getGuild("name", "Wristspasm").then(guild => {
            guildMembersChannel.setName(`Guild Members: ${guild.members.length}/125`);
            guildLevelChannel.setName(`Guild Level: ${guild.level}`);
            guildWeeklyExpChannel.setName(`Weekly GEXP: ${guild.totalWeeklyGexp}`);
        }).catch(console.error);
    }, 10000);

}