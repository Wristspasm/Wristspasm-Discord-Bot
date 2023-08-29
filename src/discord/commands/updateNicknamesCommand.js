const { getUsername } = require("../../contracts/API/PlayerDBAPI.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "update-nicknames",
  description: "Updates usernames of linked users.",
  options: [],

  execute: async (interaction) => {
    if (interaction.member.roles.cache.has(config.discord.roles.commandRole) === false) {
      throw new WristSpasmError("You do not have permission to use this command.");
    }

    const linkedData = fs.readFileSync("data/minecraftLinked.json");
    if (linkedData === undefined) {
      throw new WristSpasmError("No linked users found!");
    }

    const linked = JSON.parse(linkedData);
    if (linked === undefined) {
      throw new WristSpasmError("Failed to parse Linked data!");
    }

    let linkedUsers = 0;
    const updatedUsers = [],
      failedUsers = [];
    for (const [uuid, id] of Object.entries(linked)) {
      const [username, user] = await Promise.all([
        getUsername(uuid),
        interaction.guild.members.fetch(id).catch(() => {}),
      ]);

      const index = Object.keys(linked).indexOf(uuid);
      const total = Object.keys(linked).length;

      const progressEmbed = new EmbedBuilder()
        .setColor(3066993)
        .setAuthor({ name: "Updating nicknames..." })
        .setDescription(`Progress: \`${index}/${total}}\` (\`${((index / total) * 100).toFixed(2)}%\`)`)
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [progressEmbed] });

      if (user === undefined) continue;
      if (user.nickname === username) continue;
      if (user.user.username === username) continue;

      const oldUsername = user.nickname || user.user.username;
      await user.setNickname(username).catch(() => {
        console.log(`Failed to update username for ${username} (${id}), skipping...`);
        failedUsers.push({
          oldUsername: oldUsername,
          id: id,
        });

        return;
      });

      linkedUsers++;

      updatedUsers.push({
        oldUsername: oldUsername,
        id: id,
      });

      console.log(`Updated username for ${username} (${id})`);
    }

    const successEmbed = new EmbedBuilder()
      .setColor(3066993)
      .setAuthor({ name: "Successfully updated nicknames." })
      .setDescription(`Updated usernames for \`${linkedUsers}\` users.`)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.editReply({ embeds: [successEmbed] });

    const updatedNicknamesEmbed = new EmbedBuilder()
      .setColor(3066993)
      .setAuthor({ name: "Updated nicknames" })
      .setDescription(
        `**Updated usernames:**\n${updatedUsers.map((user) => `- \`${user.oldUsername}\` => <@${user.id}>`).join(`\n`)}`
      )
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.followUp({ embeds: [updatedNicknamesEmbed] });

    const failedNicknamesEmbed = new EmbedBuilder()
      .setColor(15158332)
      .setAuthor({ name: "Failed to update nicknames" })
      .setDescription(
        `**Failed to update usernames:**\n${failedUsers
          .map((user) => `- \`${user.oldUsername}\` => <@${user.id}>`)
          .join(`\n`)}`
      )
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.followUp({ embeds: [failedNicknamesEmbed] });
  },
};
