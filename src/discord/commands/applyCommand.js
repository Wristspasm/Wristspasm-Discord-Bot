const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "apply",
  description: "Request to join the guild.",

  execute: async (interaction) => {
    const linked = JSON.parse(fs.readFileSync("data/linked.json", "utf8"));
    if (linked === undefined) {
      throw new WristSpasmError("No verification data found. Please contact an administrator.");
    }

    const uuid = linked.find((x) => x.id === interaction.user.id)?.uuid;
    if (uuid === undefined) {
      throw new WristSpasmError("You are no verified. Please verify using /verify.");
    }

    const [player, { profile }] = await Promise.all([
      hypixelRebornAPI.getPlayer(uuid, { guild: true }),
      getLatestProfile(uuid),
    ]);

    const skyblockLevel = (profile?.leveling?.experience || 0) / 100 ?? 0;
    const bwLevel = player.stats.bedwars.level;

    const meetRequirements =
      skyblockLevel > config.minecraft.guildRequirements.requirements.skyblockLevel ||
      bwLevel > config.minecraft.guildRequirements.requirements.bedwarsStars;
    if (meetRequirements === false) {
      throw new WristSpasmError(
        `You do not meet the requirements to join the guild. Please try again once you meet the requirements.`,
      );
    }

    const applicationEmbed = new EmbedBuilder()
      .setColor(2067276)
      .setAuthor({ name: "Guild Application." })
      .setDescription(`Guild Application has been successfully sent to the guild staff.`)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.followUp({ embeds: [applicationEmbed] });

    const description = player.socialMedia
      .map((socialMedia) => `**${socialMedia.name}**: \`${socialMedia.link}\`\n`)
      .join("");

    // this is a mess, cba to make it better
    const fields = [];
    fields.push({ name: "Rank", value: `\`${player.rank ?? "None"}\``, inline: true });
    const playersGuild =
      player.guild?.name !== undefined
        ? `[${player.guild.name}](https://plancke.io/hypixel/guild/name/${encodeURIComponent(player.guild.name)})`
        : "None";
    fields.push({
      name: "Guild",
      value: playersGuild,
      inline: true,
    });
    fields.push({ name: "Level", value: `\`${player.level}\``, inline: true });
    fields.push({ name: "First Login", value: `<t:${Math.floor(player.firstLogin / 1000)}:R>`, inline: true });
    fields.push({ name: "Last Seen", value: `<t:${Math.floor(player.lastLogin / 1000)}:R>`, inline: true });
    fields.push({ name: "Karma", value: `\`${player.karma.toLocaleString()}\``, inline: true });
    fields.push({ name: "Skyblock LvL", value: `\`${skyblockLevel}\``, inline: true });
    fields.push({ name: "Bedwars Lvl", value: `\`${bwLevel}\``, inline: true });
    fields.push({
      name: "SkyCrypt",
      value: `[Click](https://sky.shiiyu.moe/stats/${player.nickname})`,
      inline: true,
    });

    const statsEmbed = new EmbedBuilder()
      .setColor(2067276)
      .setTitle(`${player.nickname}`)
      .setURL(`https://plancke.io/hypixel/player/stats/${player.uuid}`)
      .setThumbnail(`https://visage.surgeplay.com/full/512/${player.uuid}.png`)
      .setFields(fields)
      .setDescription(`${description}`)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    interaction.client.channels.cache.get(config.discord.channels.joinRequests).send({ embeds: [statsEmbed] });
  },
};
