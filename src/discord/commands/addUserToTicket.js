const WristSpasmError = require("../../contracts/errorHandler.js");

const permissions = [
  PermissionFlagsBits.ReadMessageHistory,
  PermissionFlagsBits.UseExternalEmojis,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.AttachFiles,
  PermissionFlagsBits.AddReactions,
  PermissionFlagsBits.EmbedLinks,
];

module.exports = {
  name: "add-user-to-ticket",
  description: "Add a user to the ticket.",
  moderatorOnly: true,
  options: [
    {
      name: "user",
      description: "The user to add to the ticket",
      type: 6,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const user = interaction.options.getUser("user");
    if (!interaction.channel.name.toLowerCase().startsWith("ticket-")) {
      throw new WristSpasmError("This is not a ticket channel");
    }

    await interaction.channel.permissionOverwrites.set([
      ...interaction.channel.permissionOverwrites.cache,
      {
        id: user.id,
        allow: permissions,
      },
    ]);

    await interaction.followUp({ content: `<@${user.id}> has been added to this ticket by <@${interaction.user.id}>` });
  },
};
