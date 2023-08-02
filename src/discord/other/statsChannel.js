const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const config = require("../../../config.json");
const Logger = require("./logger.js");

setInterval(async () => {
  try {
    const guild = await hypixel.getGuild("player", bot?.username ?? "WristSpasmBOT");
    const guildMembersChannel = await client.channels.cache.get(config.discord.channels.guildMember);
    const guildLevelChannel = await client.channels.cache.get(config.discord.channels.guildLevel);

    if (
      guildMembersChannel.name === `👥 Guild Members: ${guild.members.length}` &&
      guildLevelChannel.name === `⭐ Guild Level: ${guild.level}`
    ) {
      return;
    }

    await guildMembersChannel.setName(`👥 Guild Members: ${guild.members.length}`);
    await guildLevelChannel.setName(`⭐ Guild Level: ${guild.level}`);
    Logger.discordMessage(`[STATS CHANNELS] Updated stats channels.`);
  } catch (error) {
    console.log(error);
  }
}, 10000);
