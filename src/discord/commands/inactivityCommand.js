const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI");
const { toFixed, writeAt } = require("../../contracts/helperFunctions");
const { getUsername } = require("../../contracts/API/PlayerDBAPI");
const config = require("../../../config.json");
const {
  Events,
  ModalBuilder,
  EmbedBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "inactivity",
  description: "Send an inactivity notice to the guild staff",

  execute: async (interaction) => {
    try {
      const linked = JSON.parse(fs.readFileSync("data/discordLinked.json", "utf8"));
      if (linked === undefined) throw new Error("No verification data found. Please contact an administrator.");

      const uuid = linked[interaction.user.id];
      if (uuid === undefined) throw new Error("You are no verified. Please verify using /verify.");
      const username = await getUsername(linked[interaction.user.id]);

      const guild = await hypixelRebornAPI.getGuild("name", "WristSpasm");
      if (guild === undefined) throw new Error("Guild data not found. Please contact an administrator.");

      const member = guild.members.find((member) => member.uuid === uuid);
      if (member === undefined) throw new Error("You are not in the guild.");

      const modal = new ModalBuilder().setCustomId("inactivityform").setTitle("Inactivity Form");

      const time = new TextInputBuilder()
        .setCustomId("inactivitytime")
        .setLabel("How long will you be inactive for (in Days)?")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Number of days");

      const reason = new TextInputBuilder()
        .setCustomId("inactivityreason")
        .setLabel("Why are you going to be offline (optional)?")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

      const inactivitytime = new ActionRowBuilder().addComponents(time);
      const inactivityreason = new ActionRowBuilder().addComponents(reason);

      // Add inputs to the modal
      modal.addComponents(inactivitytime, inactivityreason);

      // Show the modal to the user
      await interaction.showModal(modal);
    } catch (error) {
      console.log(error);

      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(
          `\`\`\`${error.toString().replaceAll("[hypixel-api-reborn] ", "").replaceAll("Error: ", "")}\`\`\``
        )
        .setFooter({
          text: `by DuckySoLucky#5181 | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
