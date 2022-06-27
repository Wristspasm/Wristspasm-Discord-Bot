const config = require("../../config.json");
const hypixel = require('../handlers/Hypixel');

const { Client } = require("discord.js")

/**
 * 
 * @param {Client} client 
 */
function statsChannel(client) {
    setInterval(() => {
        hypixel.getGuild("id", config.minecraft.guild_id).then(guild => {
            client.channels.cache.get(config.channels.guildMember).setName(`Guild Members: ${guild.members.length}/125`);
            client.channels.cache.get(config.channels.guildLevel).setName(`Guild Level: ${guild.level}`);
        }).catch(console.error);
    }, 10000);
}

module.exports = statsChannel;