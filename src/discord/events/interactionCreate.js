// eslint-disable-next-line
const Logger = require("../.././Logger");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      await interaction.deferReply({ ephemeral: false });

      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        Logger.discordMessage(`${interaction.user.username} - [${interaction.commandName}]`);

        bridgeChat = interaction.channelId;

        await command.execute(interaction);
      } catch (error) {
        console.log(error);
        
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }

    if (interaction.isButton()) {
      try {
        await interaction.deferReply({ ephemeral: true })

        // ? Apply Button
        if (interaction.customId.includes("guild.apply_button")) {
          const applyCommand = interaction.client.commands.get("apply");

          if (applyCommand === undefined) {
            throw new Error("Could not find apply command! Please contact an administrator.");
          }

          await applyCommand.execute(interaction);
        }

      } catch (error) {
        const errorEmbed = new EmbedBuilder()
          .setColor(15548997)
          .setAuthor({ name: 'An Error has occurred'})
          .setDescription(`\`\`\`${error.toString().replaceAll("[hypixel-api-reborn] ", "").replaceAll("Error: ", "")}\`\`\``)
          .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' });
          
        interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  },
};
