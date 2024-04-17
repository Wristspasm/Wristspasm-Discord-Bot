const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const WristSpasmError = require("../../contracts/errorHandler.js");
const { Embed } = require("../../contracts/embedHandler.js");
const { AttachmentBuilder } = require("discord.js");
const config = require("../../../config.json");

function getTimeStamp(unixTimeStamp) {
  return new Date(unixTimeStamp).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZoneName: "short",
    timeZone: "UTC",
  });
}

module.exports = {
  name: "close-ticket",
  description: "Close a support ticket.",
  moderatorOnly: true,
  options: [
    {
      name: "reason",
      description: "The reason for opening a ticket",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction) => {
    const reason = interaction.options.getString("reason") || "No Reason Provided";
    if (!interaction.channel.name.toLowerCase().startsWith("ticket-")) {
      throw new WristSpasmError("This is not a ticket channel");
    }

    const messages = await interaction.channel.messages.fetch();
    let TranscriptString = "";
    messages.forEach((msg) => {
      TranscriptString += `[${getTimeStamp(msg.createdTimestamp)}] | @${msg.author.username} (${msg.author.id}) | ${
        msg.content
      }\n`;
    });

    const firstMessage = interaction.channel.messages.fetchPinned().first();
    const ticketOwnerId = firstMessage.mentions.users.first().id;

    const transcriptFile = new AttachmentBuilder(
      Buffer.from(TranscriptString),
      `transcript-${interaction.channel.name}.txt`
    );

    const ticketCloseEmbed = new Embed(
      3447003,
      "Ticket Closed",
      `Ticket Opened by <@${ticketOwnerId}>\nTicket Closed by <@${interaction.user.id}>\n\nReason: ${reason}`,
      {
        text: `by @kathund. | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png",
      }
    );

    const transcriptChannel = interaction.guild.channels.cache.fetch(config.discord.channels.ticketsLogs);
    await transcriptChannel.send({ embeds: [ticketCloseEmbed], files: [transcriptFile] });
    await interaction.client.users.send(ticketOwnerId, { embeds: [ticketCloseEmbed], files: [transcriptFile] });

    await interaction.followUp({ content: "Ticket Closed", ephemeral: true });
    await delay(2000);
    await interaction.channel.delete();
  },
};
