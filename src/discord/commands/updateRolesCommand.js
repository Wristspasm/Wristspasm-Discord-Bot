const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "update-roles",
  description: "Updates roles of linked users",

  execute: async (interaction) => {
    try {
      if (interaction.member.permissions.has("ADMINISTRATOR") === false) {
        throw new Error("You don't have permission to use this command.");
      }

      const users = await guild.members.fetch();
      if (users === undefined) {
        throw new Error("No guild members found!");
      }

      const linked = fs.readFileSync("data/minecraftLinked.json", "utf8");
      if (linked === undefined) {
        throw new Error("No linked users found!");
      }

      const linkedUsers = JSON.parse(linked);
      if (linkedUsers === undefined) {
        throw new Error("Failed to parse Linked data!");
      }

      const linkedUsersArray = Object.values(linkedUsers);
      if (linkedUsersArray === undefined) {
        throw new Error("Failed to obtain keys of parsed Linked data!");
      }

      const updatedMembers = [];
      for (const userValue of users) {
        const user = userValue[1];
        const { username, id } = user.user;

        console.log(`Updated roles for ${username} (${id})`);

        const index = users.indexOf(userValue);

        const progressEmbed = new EmbedBuilder()
          .setColor(3066993)
          .setAuthor({ name: "Updating Roles..." })
          .setDescription(`Progress: \`${index}/${users.length}\` (\`${((index / users.length) * 100).toFixed(2)}%\`)`)
          .setFooter({
            text: `by @duckysolucky | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          });

        await interaction.editReply({ embeds: [progressEmbed] });

        const updateRolesCommand = require("./rolesCommand");
        await updateRolesCommand.execute(interaction, user, "verify");
        updatedMembers.push({ id: id });
      }

      const successEmbed = new EmbedBuilder()
        .setColor("4BB543")
        .setAuthor({ name: "Success!" })
        .setDescription(
          `Successfully updated role to \`${nRemoved}\` users!\n${updatedMembers
            .map((user) => `• <@${user.id}>`)
            .join("\n")}`
        )
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [successEmbed] });
    } catch (error) {
      console.error(error);

      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(`\`\`\`${error.toString()}\`\`\``)
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
