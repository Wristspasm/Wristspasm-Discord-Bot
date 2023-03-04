const { getUsername } = require("../../contracts/API/PlayerDBAPI");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "update-nicknames",
  description:
    "Updates nicknames of everyone linked to their Minecraft username.",
  options: [],

  execute: async (interaction, client) => {
    if (!interaction.member.permissions.has("ADMINISTRATOR"))
      return errorEmbed("You don't have permission to do that.", interaction);

    const failedLinks = [];

    const linked = fs.readFileSync("data/discordLinked.json");
    if (linked === undefined)
      return errorEmbed("Couldn't find linked data.", interaction);

    const linkedData = JSON.parse(linked);
    if (linkedData === undefined)
      return errorEmbed("Failed parsing linked data.", interaction);

    for (const [id, uuid] of Object.entries(linkedData)) {
      try {
        const member = await interaction.guild.members.fetch(id);

        if (member === undefined) {
          failedLinks.push({
            id: id,
            uuid: uuid,
            cause: "Couldn't find member.",
          });
          continue;
        }

        const username = await getUsername(uuid);

        if (username === undefined) {
          failedLinks.push({
            id: id,
            uuid: uuid,
            cause: "Couldn't find username.",
          });
          continue;
        }

        member.setNickname(username);

        const progress = Object.keys(linkedData).indexOf(id) + 1;
        const progressEmbed = new EmbedBuilder()
          .setColor(3066993)
          .setAuthor({ name: "Updating nicknames..." })
          .setDescription(
            `\`\`\`${progress}/${Object.keys(linkedData).length}\`\`\``
          );

        await interaction.editReply({ embeds: [progressEmbed] });
      } catch (error) {
        failedLinks.push({
          id: id,
          username: interaction.client.users.cache.get(id).username,
          uuid: uuid,
          cause: error.toString(),
        });
      }
    }

    const successEmbed = new EmbedBuilder()
      .setColor(3066993)
      .setAuthor({ name: "Successfully updated nicknames." })
      .setDescription(`\`\`\`${failedLinks.length} failed links.\`\`\``)
      .setFooter({
        text: `by DuckySoLucky#5181 | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.editReply({ embeds: [successEmbed] });

    console.log(failedLinks);
    const failedEmbed = new EmbedBuilder()
      .setColor(15548997)
      .setAuthor({ name: "Failed to update nicknames." })
      .setDescription(`\`\`\`${JSON.stringify(failedLinks)}\`\`\``)
      .setFooter({
        text: `by DuckySoLucky#5181 | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    if (failedLinks.length > 0) {
      await interaction.channel.send({ embeds: [failedEmbed] });
    }
  },
};

function errorEmbed(error, interaction) {
  const errorEmbed = new EmbedBuilder()
    .setColor(15548997)
    .setAuthor({ name: "An Error has occurred" })
    .setDescription(`\`\`\`${error.toString()}\`\`\``)
    .setFooter({
      text: `by DuckySoLucky#5181 | /help [command] for more information`,
      iconURL: "https://imgur.com/tgwQJTX.png",
    });

  return interaction.editReply({ embeds: [errorEmbed] });
}
