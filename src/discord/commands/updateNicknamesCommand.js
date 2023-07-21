const { getUsername } = require("../../contracts/API/PlayerDBAPI");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "update-nicknames",
  description: "Updates usernames of linked users.",
  options: [],

  execute: async (interaction) => {
    try {
      if (interaction.member.permissions.has("ADMINISTRATOR") === false) {
        throw new Error("You don't have permission to use this command.");
      }

      const linkedData = fs.readFileSync("data/minecraftLinked.json");
      if (linkedData === undefined) {
        throw new Error("No linked users found!");
      }

      const linked = JSON.parse(linkedData);
      if (linked === undefined) {
        throw new Error("Failed to parse Linked data!");
      }

      let linkedUsers = 0,
        updatedUsers = [];
      for (const [uuid, id] of Object.entries(linked)) {
        const [username, user] = await Promise.all([
          getUsername(uuid),
          interaction.guild.members.fetch(id).catch(() => {}),
        ]).catch(() => {
          console.log(error);
        });

        const index = Object.keys(linked).indexOf(uuid);

        const progressEmbed = new EmbedBuilder()
          .setColor(3066993)
          .setAuthor({ name: "Updating nicknames..." })
          .setDescription(
            `Progress: \`${index}/${Object.keys(linked).length}\` (\`${(
              (index / Object.keys(linked).length) *
              100
            ).toFixed(2)}%\`)`
          )
          .setFooter({
            text: `by @duckysolucky | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          });

        await interaction.editReply({ embeds: [progressEmbed] });

        if (user === undefined) continue;
        if (user.nickname === username) continue;
        if (user.user.username === username) continue;

        const oldUsername = user.nickname || user.user.username;
        user.setNickname(username).catch(() => {});
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

      await interaction.followUp({
        content: `**Updated usernames:**\n${updatedUsers.map((user) => `- ${user.oldUsername} => <@${user.id}>\n`)}`,
      });
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
