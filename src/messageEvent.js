const cfg = require("../config.json");

const Discord = require("discord.js");

/**
 * @param {Discord.Message} message 
 */
async function messageEvent(message) {
	if (message.member.roles.cache.has(cfg.cursed_role_id) && message.channelId !== cfg.chain_channel_id) {
		if (message.content.toLowerCase().startsWith("i'm") || message.content.toLowerCase().startsWith("im")) {
			let msg = message.content.split(/ +/);
			msg.shift();
			msg = msg.join(" ");
			message.channel.send(`Hi ${msg}! I'm Dad!\n<@${message.author.id}>`);
		}
	} else if (message.channelId === cfg.chain_channel_id) {
		const messages = await message.channel.messages.fetch({limit: 2});
		if (message.content !== messages.last().content) {
			message.member.roles.add(message.guild.roles.cache.get(cfg.chain_breaker_role_id));
		}	
	}
}

module.exports = messageEvent;
