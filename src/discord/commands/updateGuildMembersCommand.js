const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "update-guild-members",
  description: "Removes role from players which have left the guild, they receive a DM to reapply.",
  options: [],

  execute: async (interaction) => {
    const user = interaction.member;
    if (
      config.discord.commands.checkPerms === true &&
      !(user.roles.cache.has(config.discord.commands.commandRole) || config.discord.commands.users.includes(user.id))
    ) {
      throw new WristSpasmError("You do not have permission to use this command.");
    }

    const users = await interaction.guild.members.fetch();
    if (users === undefined) {
      throw new WristSpasmError("No guild members found!");
    }

    const linked = fs.readFileSync("data/discordLinked.json", "utf8");
    if (linked === undefined) {
      throw new WristSpasmError("No linked users found!");
    }

    const linkedUsers = JSON.parse(linked);
    if (linkedUsers === undefined) {
      throw new WristSpasmError("Failed to parse Linked data!");
    }

    const linkedUsersArray = Object.keys(linkedUsers);
    if (linkedUsersArray === undefined) {
      throw new WristSpasmError("Failed to obtain keys of parsed Linked data!");
    }

    if (config === undefined) {
      throw new WristSpasmError("Failed to obtain config!");
    }

    const guildMemberRole = config?.discord?.roles?.guildMemberRole;
    if (guildMemberRole === undefined) {
      throw new WristSpasmError("Failed to obtain `guildMemberRole` ID from config!");
    }

    const guildMembers = (await hypixelRebornAPI.getGuild("player", bot.username)).members.map((member) => member.uuid);

    let nRemoved = 0;
    const usersRemoved = [];
    for (const userValue of users) {
      const user = userValue[1];
      const { username, id } = user.user;
      const uuid = linkedUsers[id];

      const userRoles = user.roles.cache.map((role) => role.id);

      if (userRoles.includes(guildMemberRole)) {
        const hasRole = linkedUsersArray.includes(id);
        if (hasRole === true && guildMembers.includes(uuid) === false) {
          console.log(`${username} (<@${id}>) has Guild Member role but is not in the guild`);

          const removedGuildMemberRoleEmbed = new EmbedBuilder()
            .setAuthor({ name: "Your Guild Member role has been removed" })
            .setThumbnail("https://imgur.com/fNByP9j.png")
            .setColor(15548997)
            .setDescription(
              `Your Guild Member role has been removed from the WristSpasm Discord server!\nThis was done because you're not part of the Guild anymore. Thanks for staying with us and we hope you enjoyed.\n\nFeel free to apply again in <#1072874886005014568> channel. If you're not part of the community anymore, feel free to ignore this message.\n\nIf you have any questions, please contact a staff member.`
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
            continue;
          }

          await userDM.send({
            embeds: [removedGuildMemberRoleEmbed],
          });

          nRemoved++;
          usersRemoved.push({
            username,
            id,
          });
        }
      }
    }

    const successEmbed = new EmbedBuilder()
      .setColor(3066993)
      .setAuthor({ name: "Successfully updated Guild Members" })
      .setDescription(
        `Removed Guild Member role from \`${nRemoved}\` users\n${usersRemoved
          .map((user) => `- <@${user.id}>`)
          .join("\n")}`
      )
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.editReply({ embeds: [successEmbed] });
  },
};
