const hypixel = require("../../contracts/API/HypixelRebornAPI");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const { writeAt } = require("../../contracts/helperFunctions");
const { getUUID } = require("../../contracts/API/PlayerDBAPI");

module.exports = {
  name: "overrideverify",
  description: "Connect your Discord account to Minecraft",
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
    {
      name: "user",
      description: "Discord User",
      type: 6,
      required: true,
    },
  ],

  execute: async (interaction, client) => {
    const username = interaction.options.getString("name");
    const id = interaction.options._hoistedOptions[1].value;
    if (
      (await interaction.guild.members.fetch(interaction.user)).roles.cache.has(
        config.discord.commandRole
      )
    ) {
      try {
        (await interaction.guild.members.fetch(id)).roles.add(
          interaction.guild.roles.cache.get(config.discord.linkedRole)
        );

        const uuid = await getUUID(username);
        await writeAt("data/discordLinked.json", `${id}.data`, [`${uuid}`]);
        await writeAt("data/minecraftLinked.json", `${uuid}.data`, [`${id}`]);
        const successfullyLinked = new EmbedBuilder()
          .setColor(5763719)
          .setAuthor({ name: "Successfully linked!" })
          .setDescription(
            `\`${username}\` has been successfully linked to \`${
              (await interaction.guild.members.fetch(id)).user.username
            }#${
              (await interaction.guild.members.fetch(id)).user.discriminator
            }\``
          )
          .setFooter({
            text: `by DuckySoLucky#5181 | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          });
        await interaction.followUp({ embeds: [successfullyLinked] });
      } catch (error) {
        const errorEmbed = new EmbedBuilder()
          .setColor(15548997)
          .setAuthor({ name: "An Error has occurred" })
          .setDescription(error)
          .setFooter({
            text: `by DuckySoLucky#5181 | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          });
        interaction.followUp({ embeds: [errorEmbed] });
      }
    } else {
      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(`You do not have permission to run this command.`)
        .setFooter({
          text: `by DuckySoLucky#5181 | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });
      interaction.followUp({ embeds: [errorEmbed] });
    }
  },
};
