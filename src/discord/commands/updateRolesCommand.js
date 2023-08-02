const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "update-roles",
  description: "Updates roles of linked users",

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

    const updatedMembers = [];
    for (const [id, user] of users.filter((user) => user.roles.cache.has(config.discord.roles.linkedRole))) {
      const username = user.user.username;

      console.log(`Updating roles for ${username}...`);

      const index = updatedMembers.length + 1;
      const totalMembers = users.filter((user) => user.roles.cache.has(config.discord.roles.linkedRole)).size;

      const progressEmbed = new EmbedBuilder()
        .setColor(3066993)
        .setAuthor({ name: "Updating Roles..." })
        .setDescription(`Progress: \`${index}/${totalMembers}\` (\`${((index / totalMembers) * 100).toFixed(2)}%\`)`)
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [progressEmbed] });

      if (index >= 69) {
        const updateRolesCommand = require("./rolesCommand.js");
        await updateRolesCommand.execute(interaction, user, "verify");
      }

      updatedMembers.push({ id: id });
      console.log(`Updated roles for ${username}!`);
    }

    const successEmbed = new EmbedBuilder()
      .setColor("4BB543")
      .setAuthor({ name: "Success!" })
      .setDescription(
        `Successfully updated role to \`${updatedMembers.length}\` users!\n${updatedMembers
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
