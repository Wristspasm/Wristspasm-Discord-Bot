const hypixel = require('../../contracts/API/HypixelRebornAPI');
const config = require('../../../config.json');

setInterval(async () => {
    try {
        if (typeof bot === 'undefined') return;
        if (bot?.username === undefined) return;

        const guild = await hypixel.getGuild("player", bot.username);
        client.channels.cache.get(config.discord.channels.guildMember).setName(`Guild Members: ${guild.members.length}/125`);
        client.channels.cache.get(config.discord.channels.guildLevel).setName(`Guild Level: ${guild.level}`);      
    } catch (error) {
        console.log(error);
    }
}, 30000);