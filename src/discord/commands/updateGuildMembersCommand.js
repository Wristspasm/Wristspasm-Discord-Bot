const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "update-guild-members",
  description: "Removes role from players which have left the guild, they receive a DM to reapply.",
  options: [],
  moderatorOnly: true,

  execute: async (interaction) => {
    const users = await interaction.guild.members.fetch();
    if (users === undefined) {
      throw new WristSpasmError("No guild members found!");
    }

    const linked = fs.readFileSync("data/linked.json", "utf8");
    if (linked === undefined) {
      throw new WristSpasmError("No linked users found!");
    }

    const linkedUsers = JSON.parse(linked);
    if (linkedUsers === undefined) {
      throw new WristSpasmError("Failed to parse Linked data!");
    }

    if (config === undefined) {
      throw new WristSpasmError("Failed to obtain config!");
    }

    const guildMemberRole = config?.discord?.roles?.guildMemberRole;
    if (guildMemberRole === undefined) {
      throw new WristSpasmError("Failed to obtain `guildMemberRole` ID from config!");
    }

    const guild = await hypixelRebornAPI.getGuild("player", bot.username);
    const guildMembers = guild.members.map((member) => member.uuid);
    if (guildMembers === undefined) {
      throw new WristSpasmError("Failed to obtain guild members!");
    }

    const usersRemoved = [];
    for (const userValue of users) {
      const user = userValue[1];
      const { username, id } = user.user;
      const uuid = linkedUsers[id];

      const userRoles = user.roles.cache.map((role) => role.id);
      if (userRoles.includes(guildMemberRole) === false) {
        continue;
      }

      const hasRole = linkedUsers.find((x) => x.id === user.id);
      if (hasRole === true && guildMembers.includes(uuid) === false) {
        await sendDM(user, guildMemberRole, username, id, usersRemoved);
      }
    }

    const successEmbed = new EmbedBuilder()
      .setColor(3066993)
      .setAuthor({ name: "Successfully updated Guild Members" })
      .setDescription(
        `Removed <@&600313217603993617> role from \`${usersRemoved.length}\` users\n${usersRemoved
          .map((user) => `- <@${user}>\n`)
          .join("")}`,
      )
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.editReply({ embeds: [successEmbed] });
  },
};

async function sendDM(user, guildMemberRole, username, id, usersRemoved) {
  console.log(`${username} (<@${id}>) has Guild Member role but is not in the guild`);

  const removedGuildMemberRoleEmbed = new EmbedBuilder()
    .setAuthor({ name: "Your Guild Member role has been removed" })
    .setThumbnail("https://imgur.com/fNByP9j.png")
    .setColor(15548997)
    .setDescription(
      `Your role as a Guild Member has been revoked within the WristSpasm Discord server. This action has been taken as you are no longer affiliated with the Guild. We appreciate your time with us and hope you had a positive experience.\n\nIf you wish to rejoin, please don't hesitate to reapply in the <#1072874886005014568> channel. If you are no longer a part of our community, you can disregard this message.\n\nFor any inquiries or concerns, please reach out to a staff member.`,
    )
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png",
    });

  await user.roles.remove(guildMemberRole);

  const userDM = await user.createDM().catch(() => {
    console.log(`Failed to create DM with ${username} (${id}), skipping...`);
  });

  if (userDM === undefined) {
    console.log(`Failed to send DM to ${username} (${id}), skipping...`);
    return;
  }

  await userDM.send({
    embeds: [removedGuildMemberRoleEmbed],
  });

  usersRemoved.push(id);
}
