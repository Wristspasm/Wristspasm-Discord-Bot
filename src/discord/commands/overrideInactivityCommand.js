const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { toFixed, writeAt } = require("../../contracts/helperFunctions.js");
const { getUUID } = require("../../contracts/API/mowojangAPI.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "overrideinactivity",
  description: "Send an inactivity notice to the guild staff",
  moderatorOnly: true,
  defer: true,
  options: [
    {
      name: "discord",
      description: "Discord User",
      type: 6,
      required: true,
    },
    {
      name: "minecraft",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
    {
      name: "time",
      description: "How long will you be inactive for (in Days)",
      type: 4,
      required: true,
    },
    {
      name: "reason",
      description: "Why are you going to be offline (optional)?",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction) => {
    const discord = interaction.options._hoistedOptions[0];
    const username = interaction.options.getString("minecraft");

    const uuid = await getUUID(username);
    if (uuid === undefined) {
      throw new WristSpasmError("Player data not found. Please contact an administrator.");
    }

    const guild = await hypixelRebornAPI.getGuild("name", "WristSpasm");
    if (guild === undefined) {
      throw new WristSpasmError("Guild data not found. Please contact an administrator.");
    }

    const member = guild.members.find((member) => member.uuid === uuid);
    if (member === undefined) {
      throw new WristSpasmError(`${username} are not in the guild.`);
    }

    const time = interaction.options.getInteger("time") * 86400;
    const expiration = toFixed(new Date().getTime() / 1000 + time, 0);
    const reason = interaction.options.getString("reason") || "None";

    const channel = interaction.client.channels.cache.get(config.discord.channels.inactivity);
    if (channel === undefined) {
      throw new WristSpasmError("Inactivity channel not found. Please contact an administrator.");
    }

    const inactivityEmbed = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Inactivity request." })
      .setThumbnail(`https://www.mc-heads.net/avatar/${username}`)
      .setDescription(
        `\`Username:\` ${username}\n\`Requested:\` <t:${toFixed(
          new Date().getTime() / 1000,
          0,
        )}>\n\`Expiration:\` <t:${toFixed(expiration, 0)}:R>\n\`Reason:\` ${reason}`,
      )
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await channel.send({ embeds: [inactivityEmbed] });

    const inactivityResponse = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Inactivity request." })
      .setDescription(`Inactivity request for ${username} has been successfully created.`)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.followUp({ embeds: [inactivityResponse] });

    writeAt("data/inactivity.json", uuid, {
      username: username,
      uuid: uuid,
      discord: discord.user.tag,
      discord_id: discord.user.id,
      requested: toFixed(new Date().getTime() / 1000, 0),
      requested_formatted: new Date().toLocaleString(),
      expiration: expiration,
      expiration_formatted: new Date(expiration * 1000).toLocaleString(),
      reason: reason,
    });
  },
};
