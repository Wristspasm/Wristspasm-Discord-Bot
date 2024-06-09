const { getUUID, getUsername } = require("../../contracts/API/mowojangAPI.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
const fs = require("fs");

module.exports = {
  name: "linked",
  description: "Get an username / discord profile of specified user.",
  options: [
    {
      name: "discord",
      description: "The Discord user to get the username of.",
      type: 6,
      required: false,
    },
    {
      name: "name",
      description: "The Minecraft username to get the Discord profile of.",
      type: 3,
      required: false,
    },
  ],
  moderatorOnly: true,

  execute: async (interaction) => {
    const linked = fs.readFileSync("data/linked.json", "utf8");
    if (linked === undefined) {
      throw new WristSpasmError("No linked users found!");
    }

    const linkedUsers = JSON.parse(linked);
    if (linkedUsers === undefined) {
      throw new WristSpasmError("Failed to parse Linked data!");
    }

    const playerData = fs.readFileSync("data/playerData.json", "utf8");
    if (playerData === undefined) {
      throw new WristSpasmError("No player data found!");
    }

    const playerDataParsed = JSON.parse(playerData);
    if (playerDataParsed === undefined) {
      throw new WristSpasmError("Failed to parse player data!");
    }

    let uuid, discordUserID;
    if (interaction.options.get("discord") !== null) {
      discordUserID = interaction.options.get("discord").value;

      uuid = linkedUsers[discordUserID];
      if (uuid === undefined) {
        throw new WristSpasmError("No linked user found!");
      }
    } else if (interaction.options.get("name") !== null) {
      const minecraftUsername = interaction.options.get("name").value;

      uuid = await getUUID(minecraftUsername);
    } else {
      throw new WristSpasmError("You haven't specified a user!");
    }

    const minecraftUsername = uuid ? await getUsername(uuid) : interaction.options.get("name").value;
    const discordUser = uuid
      ? Object.keys(linkedUsers).find((key) => linkedUsers[key] === uuid)
      : interaction.options.get("discord").value;

    const extra = getExtraData(playerDataParsed, uuid);

    const embed = new EmbedBuilder()
      .setTitle("Linked User")
      .setDescription(`**Discord**: <@${discordUser}>\n**Minecraft**: \`${minecraftUsername}\` (\`${uuid}\`) ${extra}`)
      .setColor(3066993)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.editReply({ embeds: [embed] });
  },
};

function getExtraData(playerDataParsed, uuid) {
  if (playerDataParsed[uuid] === undefined) return "";

  const joined = playerDataParsed[uuid].joined;
  const lastLogin = Math.floor(playerDataParsed[uuid].lastLogin / 1000);
  const left = playerDataParsed[uuid].left;
  const lastLogout = Math.floor(playerDataParsed[uuid].lastLogout / 1000);
  const online = playerDataParsed[uuid].online;
  const playtime = moment.duration(Math.floor(playerDataParsed[uuid].playtime / 1000), "seconds").humanize();
  const messages = playerDataParsed[uuid].messages;

  return `\n**Joined**: ${joined}\n**Last Login**: <t:${lastLogin}:R>\n**Left**: ${left}\n**Last Logout**: <t:${lastLogout}:R>\n**Online**: ${
    online ? "Yes" : "No"
  }\n**Playtime**: ${playtime}\n**Messages**: ${messages}`;
}
