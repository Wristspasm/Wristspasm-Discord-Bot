const cfg = require("../config.json");

const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');

/**
 * 
 * @param {Discord.Client} client 
 * @param {Hypixel.Client} hypixel 
 */
function statChannels(client, hypixel) {

    const discordGuild = client.guilds.cache.get("600311056627269642");
    const guildMembersChannel = discordGuild.channels.cache.get("821560951677386762");
    const guildLevelChannel = discordGuild.channels.cache.get("821560990083842089");

    setInterval(() => {
        hypixel.getGuild("id", cfg.wristspasm_id).then(guild => {
            guildMembersChannel.setName(`Guild Members: ${guild.members.length}/125`);
            guildLevelChannel.setName(`Guild Level: ${guild.level}`);
        }).catch(console.error);
    }, 10000);

}


module.exports = statChannels;