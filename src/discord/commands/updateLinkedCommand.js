const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "update-linked",
  description: "Removes role from unlinked users and sends them a DM to verify.",
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

    const linkedRole = config?.discord?.roles?.linkedRole;
    if (linkedRole === undefined) {
      throw new WristSpasmError("Failed to obtain `linkedRole` ID from config!");
    }

    const guildMemberRole = config?.discord?.roles?.guildMemberRole;
    if (guildMemberRole === undefined) {
      throw new WristSpasmError("Failed to obtain `guildMemberRole` ID from config!");
    }

    const usersRemoved = [];
    for (const userValue of users) {
      const user = userValue[1];
      const { username, id } = user.user;

      const userRoles = user.roles.cache.map((role) => role.id);
      if (userRoles.includes(linkedRole) && linkedUsers.find((x) => x.id === id) === false) {
        await sendDM(user, linkedRole, userRoles, guildMemberRole, username, id, usersRemoved);
      }
    }

    const successEmbed = new EmbedBuilder()
      .setColor("4BB543")
      .setAuthor({ name: "Success!" })
      .setDescription(
        `Successfully removed role from \`${usersRemoved.length}\` users!\n${usersRemoved
          .map((user) => `• <@${user}>\n`)
          .join("")}`
      )
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.editReply({ embeds: [successEmbed] });
  },
};

async function sendDM(user, linkedRole, userRoles, guildMemberRole, username, id, usersRemoved) {
  console.log(`Sending DM to ${username} (${id})`);
  const unlinkEmbed = new EmbedBuilder()
    .setAuthor({ name: "Your linked role has been removed" })
    .setThumbnail("https://imgur.com/fNByP9j.png")
    .setColor(15548997)
    .setDescription(
      `You have been unlinked from the WristSpasm Discord server!\n\nTo link simply execute the \`/verify\` command within the <#1072881326207795360> channel. If you are no longer part of our community, you can disregard this message.\n\nShould you require assistance or have any inquiries, please don't hesitate to reach out to a staff member.`
    )
    .setFooter({
      text: `by @duckysolucky | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png",
    });

  await user.roles.remove(linkedRole);

  if (userRoles.includes(guildMemberRole)) {
    await user.roles.remove(guildMemberRole);
  }

  const userDM = await user.createDM().catch(() => {
    console.log(`Faled to send DM to ${username} (${id}), skipping...`);
  });

  if (userDM === undefined) {
    console.log(`Failed to send DM to ${username} (${id}), skipping...`);
    return;
  }

  await userDM.send({
    embeds: [unlinkEmbed],
  });

  console.log(`Successfully sent DM to ${username} (${id})`);

  usersRemoved.push(username);
}
