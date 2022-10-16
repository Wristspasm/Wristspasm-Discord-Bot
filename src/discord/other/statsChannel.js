const hypixel = require('../../contracts/API/HypixelRebornAPI');
const config = require('../../../config.json');

setInterval(async () => {
    try {
        const guild = await hypixel.getGuild("id", config.minecraft.guildID);
        client.channels.cache.get(config.channels.guildMember).setName(`Guild Members: ${guild.members.length}/125`);
        client.channels.cache.get(config.channels.guildLevel).setName(`Guild Level: ${guild.level}`);      
    } catch (error) {
        console.log(error);
    }
}, 10000);