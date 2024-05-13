const { getUsername } = require("../../contracts/API/mowojangAPI.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "update-nicknames",
  description: "Updates usernames of linked users.",
  options: [],
  moderatorOnly: true,

  execute: async (interaction) => {

    const linkedData = fs.readFileSync("data/linked.json");
    if (linkedData === undefined) {
      throw new WristSpasmError("No linked users found!");
    }

    const linked = JSON.parse(linkedData);
    if (linked === undefined) {
      throw new WristSpasmError("Failed to parse Linked data!");
    }

    const updatedUsers = [];
    const failedUsers = [];
    for (const [uuid, id] of Object.entries(linked)) {
      const [username, user] = await Promise.all([
        getUsername(uuid),
        interaction.guild.members.fetch(id).catch(() => {}),
      ]);

      printProgress(interaction, linked, uuid, id, username);

      updateUsername(user, username, id, failedUsers, updatedUsers);
    }

    const successEmbed = new EmbedBuilder()
      .setColor(3066993)
      .setAuthor({ name: "Updated usernames" })
      .setDescription(`Successfully updated usernames for \`${updatedUsers.length}\` users.`)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.editReply({ embeds: [successEmbed] });

    if (updatedUsers.length > 0) {
      printUpdatedUsernames(interaction, updatedUsers);
    }

    if (failedUsers > 0) {
      printFailedNicknames(interaction, failedUsers);
    }
  },
};

async function printProgress(interaction, linked, uuid, id, username) {
  const index = Object.keys(linked).indexOf(uuid);
  const total = Object.keys(linked).length;
  const percentage = ((index / total) * 100).toFixed(2);
  const progressEmbed = new EmbedBuilder()
    .setColor(3066993)
    .setAuthor({ name: "Updating nicknames..." })
    .setDescription(
      `Updating <@${id}>'s nickname (\`${username}\`)\n\nProgress: **${index}** / ${total} (\`${percentage}%\`)`
    )
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png",
    });

  await interaction.editReply({ embeds: [progressEmbed] });
}

async function updateUsername(user, username, id, failedUsers, updatedUsers) {
  if (user === undefined || user.nickname === username || user.user.username === username) {
    return;
  }

  if (user.roles.cache.has(config.discord.roles.commandRole)) {
    console.log(user);
    console.log(`Skipping ${username} (${id}) because they have the "Muted" role.`);
    return;
  }

  await user.setNickname(username).catch(() => {
    // console.log(`Failed to update username for ${username} (${id}), skipping...`);

    failedUsers.push(id);

    return;
  });

  updatedUsers.push(id);
  // console.log(`Updated username for ${username} (${id})`);
}

async function printUpdatedUsernames(interaction, updatedUsers) {
  const updatedNicknamesEmbed = new EmbedBuilder()
    .setColor(3066993)
    .setAuthor({ name: "Updated nicknames" })
    .setDescription(`${updatedUsers.map((id) => `- <@${id}>\n`).join("")}`)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png",
    });

  await interaction.followUp({ embeds: [updatedNicknamesEmbed] });
}

async function printFailedNicknames(interaction, failedUsers) {
  const failedNicknamesEmbed = new EmbedBuilder()
    .setColor(15158332)
    .setAuthor({ name: "Failed to update nicknames" })
    .setDescription(`${failedUsers.map((id) => `- <@${id}>\n`).join("")}`)
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png",
    });

  await interaction.followUp({ embeds: [failedNicknamesEmbed] });
}
