const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ms = require("ms");
const fs = require("fs");

module.exports = {
  name: "giveaway-create",
  description: "Create a giveaway",
  moderatorOnly: true,
  options: [
    {
      name: "prize",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
    {
      name: "winners",
      description: "Number of winners",
      type: 4,
      required: true,
    },
    {
      name: "duration",
      description: "Duration of the giveaway",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const prize = interaction.options.getString("prize");
    const winners = interaction.options.getInteger("winners");
    const duration = interaction.options.getString("duration");
    const endTimestamp = Math.floor(Date.now() + ms(duration) / 1000);
    const giveawayEmbed = new EmbedBuilder()
      .setColor(3447003)
      .setTitle("Giveaway")
      .addFields(
        {
          name: "Prize",
          value: prize,
        },
        {
          name: "Winners",
          value: winners,
        },
        {
          name: "Ends At",
          value: `<t:${endTimestamp}:f> (<t:${endTimestamp}:R>)`,
        },
      );

    const giveawayData = JSON.parse(fs.readFileSync("data/giveaways.json", "utf-8"));
    const giveaway = await interaction.channel.send({ embeds: [giveawayEmbed] });
    giveawayData.push({
      host: interaction.user.id,
      winners,
      prize,
      endTimestamp,
      channel: giveaway.channel.id,
      id: giveaway.id,
      users: [],
      ended: false,
    });
    fs.writeFileSync("data/giveaways.json", JSON.stringify(giveawayData, null, 2));

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Enter Giveaway").setCustomId(`g.e.${giveaway.id}`).setStyle(ButtonStyle.Success),
    );
    await giveaway.edit({ embeds: [giveawayEmbed], components: [row] });

    await interaction.followUp({ content: `Giveaway created! [View here](${giveaway.url})` });
  },
};
