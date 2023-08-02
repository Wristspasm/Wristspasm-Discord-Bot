const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "update-linked",
  description: "Removes role from unlinked users and sends them a DM to verify.",

  execute: async (interaction) => {
    if (interaction.member.roles.cache.has(config.discord.roles.commandRole) === false) {
      throw new WristSpasmError("You do not have permission to use this command.");
    }

    const users = await interaction.guild.members.fetch();
    if (users === undefined) {
      throw new WristSpasmError("No guild members found!");
    }

    const linked = fs.readFileSync("data/minecraftLinked.json", "utf8");
    if (linked === undefined) {
      throw new WristSpasmError("No linked users found!");
    }

    const linkedUsers = JSON.parse(linked);
    if (linkedUsers === undefined) {
      throw new WristSpasmError("Failed to parse Linked data!");
    }

    const linkedUsersArray = Object.values(linkedUsers);
    if (linkedUsersArray === undefined) {
      throw new WristSpasmError("Failed to obtain keys of parsed Linked data!");
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

    let nRemoved = 0;
    const usersRemoved = [];
    for (const userValue of users) {
      const user = userValue[1];
      const { username, id } = user.user;

      const userRoles = user.roles.cache.map((role) => role.id);

      if (userRoles.includes(linkedRole)) {
        const hasRole = linkedUsersArray.includes(id);

        if (hasRole === false) {
          const unlinkEmbed = new EmbedBuilder()
            .setAuthor({ name: "Your linked role has been removed" })
            .setThumbnail("https://imgur.com/fNByP9j.png")
            .setColor(15548997)
            .setDescription(
              `You have been unlinked from the WristSpasm Discord server!\nRecently we have had some issues with verification system and data wasn't stored correctly, You're one of the affected users. This was caused by the Hypixel Network API maintenance.\n\nPlease re-link your account by using the command \`/verify\` in the <#1072881326207795360> channel. If you're not part of the community anymore, feel free to ignore this message.\n\nIf you have any questions, please contact a staff member.`
            )
            .setFooter({
              text: `by @duckysolucky | /help [command] for more information`,
              iconURL: "https://imgur.com/tgwQJTX.png",
            });

          await user.roles.remove(linkedRole);

          // ? In case user has guildMemberRole, remove it
          if (userRoles.includes(guildMemberRole)) {
            await user.roles.remove(guildMemberRole);
          }

          const userDM = await user.createDM().catch(() => {
            console.log(`Faled to send DM to ${username} (${id}), skipping...`);
          });
          if (userDM === undefined) {
            console.log(`Failed to send DM to ${username} (${id}), skipping...`);
            continue;
          }

          await userDM.send({
            embeds: [unlinkEmbed],
          });

          console.log(`Successfully sent DM to ${username} (${id})`);

          nRemoved++;
          usersRemoved.push({
            username,
            id,
          });
        }
      }
    }

    const successEmbed = new EmbedBuilder()
      .setColor("4BB543")
      .setAuthor({ name: "Success!" })
      .setDescription(
        `Successfully removed role from \`${nRemoved}\` users!\n${usersRemoved
          .map((user) => `• <@${user.id}>`)
          .join("\n")}`
      )
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.editReply({ embeds: [successEmbed] });
  },
};
