const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { SuccessEmbed, ErrorEmbed } = require("../../contracts/embedHandler.js");
module.exports = {
  name: "embed",
  description: "Embed Builder",
  ephemeral: true,
  defer: true,
  options: [
    {
      name: "preset",
      description: "Select a preset",
      type: 3,
      required: false,
      choices: [
        {
          name: "Made by DuckySoLucky",
          value: "duckysolucky",
        },
        {
          name: "Made by Kathund",
          value: "kathund",
        },
        {
          name: "Made by george_filos",
          value: "george_filos",
        },
        {
          name: "Success Embed",
          value: "success",
        },
        {
          name: "Error Embed",
          value: "error",
        },
      ],
    },
    {
      name: "message-import",
      description: "Import a message to edit | Only discord links",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction) => {
    const preset = interaction.options.getString("preset") || null;
    let messageImport = interaction.options.getString("message-import") || null;

    const editMessageButton = new ButtonBuilder()
      .setLabel("Edit Message")
      .setCustomId("e.e.m")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("<:icons_edit:1249307514680512512>");
    const addEmbedButton = new ButtonBuilder()
      .setLabel("Add Embed")
      .setCustomId("e.a.e")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("<:icons_createchannels:1249307311143653407>");
    const editEmbedButton = new ButtonBuilder()
      .setLabel("Edit Embed")
      .setCustomId("e.e.e")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("<:icons_edit:1249307514680512512>");
    const deleteEmbedButton = new ButtonBuilder()
      .setLabel("Delete Embed")
      .setCustomId("e.d.e")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("<:icons_busy:1249309744259268620>");
    const importJsonButton = new ButtonBuilder()
      .setLabel("Import JSON")
      .setCustomId("e.j.i")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("<:icons_Download:1249306613727367198>");
    const exportJsonButton = new ButtonBuilder()
      .setLabel("Export JSON")
      .setCustomId("e.j.e")
      .setStyle(ButtonStyle.Secondary);
    const resetButton = new ButtonBuilder()
      .setLabel("Reset")
      .setCustomId("e.reset")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("<:icons_delete:1249309581490786372>");
    const sendButton = new ButtonBuilder()
      .setLabel("Send")
      .setCustomId("e.send")
      .setStyle(ButtonStyle.Success)
      .setEmoji("<:icons_Correct:1249308284075376641>");
    const quitButton = new ButtonBuilder()
      .setLabel("Quit")
      .setCustomId("e.quit")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("<:icons_Wrong:1249307619739570218>");

    let content = "";
    const embeds = [];

    if (preset === "duckysolucky") {
      embeds.push(
        new EmbedBuilder().setColor(3447003).setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        }),
      );
    } else if (preset === "kathund") {
      embeds.push(
        new EmbedBuilder().setColor(3447003).setFooter({
          text: `by @kathund. | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png",
        }),
      );
    } else if (preset === "george_filos") {
      embeds.push(
        new EmbedBuilder().setColor(3447003).setFooter({
          text: `by @george_filos | /help [command] for more information`,
          iconURL: "https://cdn.discordapp.com/avatars/177083022305263616/4ee1d5f278a36a61aa9164b9263c8722.webp",
        }),
      );
    } else if (preset === "success") {
      embeds.push(new SuccessEmbed("Success Embed"));
    } else if (preset === "error") {
      embeds.push(new ErrorEmbed("Error Embed"));
    }

    if (messageImport) {
      if (!messageImport) {
        return await interaction.followUp({ content: "Please provoid a message link" });
      }
      if (!messageImport.includes("https://")) {
        return await interaction.followUp({ content: "Invalid message link" });
      }
      if (messageImport.startsWith("https://canary.discord.com")) {
        messageImport = messageImport.replace("canary.", "");
      }
      if (messageImport.startsWith("https://ptb.discord.com")) {
        messageImport = messageImport.replace("ptb.", "");
      }
      if (!messageImport.startsWith("https://discord.com/channels/")) {
        return await interaction.followUp({ content: "Invalid message link | Link must be a discord message link" });
      }
      const messageLinkSplit = messageImport.split("/");
      const messageId = messageLinkSplit.pop();
      const channelId = messageLinkSplit.pop();
      const channel = await interaction.client.channels.fetch(channelId);
      const message = await channel.messages.fetch(messageId);
      content = message.content;
      message.embeds.forEach((embed) => embeds.push(new EmbedBuilder(embed)));
    }

    if (embeds.length === 0) {
      editEmbedButton.setDisabled(true);
      deleteEmbedButton.setDisabled(true);
    }
    await interaction.followUp({
      content,
      embeds,
      components: [
        new ActionRowBuilder().addComponents(editMessageButton),
        new ActionRowBuilder().addComponents(addEmbedButton, editEmbedButton, deleteEmbedButton),
        new ActionRowBuilder().addComponents(importJsonButton, exportJsonButton),
        new ActionRowBuilder().addComponents(resetButton, sendButton, quitButton),
      ],
    });
  },
};
