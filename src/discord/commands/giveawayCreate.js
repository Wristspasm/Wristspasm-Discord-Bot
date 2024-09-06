const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../../../config.json");
const ms = require("ms");
const fs = require("fs");

module.exports = {
  name: "giveaway-create",
  description: "Create a giveaway",
  moderatorOnly: true,
  defer: true,
  options: [
    {
      name: "prize",
      description: "Giveaway Prize",
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
    {
      name: "host",
      description: "Host of the giveaway",
      type: 6,
      required: false,
    },
    {
      name: "channel",
      description: "Channel to create the giveaway in",
      type: 7,
      required: false,
      channel_types: [0],
    },
    {
      name: "guild-only",
      description: "Whether the giveaway should be guild only",
      type: 5,
      required: false,
    },
    {
      name: "verified-only",
      description: "Whether the giveaway should be verified only",
      type: 5,
      required: false,
    },
  ],

  execute: async (interaction) => {
    const prize = interaction.options.getString("prize");
    const winners = interaction.options.getInteger("winners");
    const duration = interaction.options.getString("duration");
    const host = interaction.options.getUser("host") || interaction.user;
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const guildOnly = interaction.options.getBoolean("guild-only") || false;
    const verifiedOnly = interaction.options.getBoolean("verified-only") || false;

    const endTimestamp = Math.floor((Date.now() + ms(duration)) / 1000);
    const giveawayEmbed = new EmbedBuilder()
      .setColor(3447003)
      .setTitle("Giveaway")
      .addFields(
        {
          name: "Prize",
          value: `${prize}`,
          inline: true,
        },
        {
          name: "Host",
          value: `<@${host.id}>`,
          inline: true,
        },
        {
          name: "Entries",
          value: "0",
          inline: true,
        },
        {
          name: "Winners",
          value: `${winners}`,
        },
        {
          name: "Ends At",
          value: `<t:${endTimestamp}:f> (<t:${endTimestamp}:R>)`,
        },
        {
          name: "Requirements",
          value: `Guild Member: ${
            guildOnly ? "<:icons_Correct:1249308284075376641>" : "<:icons_Wrong:1249307619739570218>"
          }\nVerified: ${verifiedOnly ? "<:icons_Correct:1249308284075376641>" : "<:icons_Wrong:1249307619739570218>"}`,
        }
      )
      .setFooter({
        text: `by @kathund. | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png",
      });

    const giveawayData = JSON.parse(fs.readFileSync("data/giveaways.json", "utf-8"));
    const giveaway = await channel.send({ embeds: [giveawayEmbed] });
    await channel.send(`<@&${config.discord.roles.guildMemberRole}>`);
    giveawayData.push({
      host: host.id,
      winners,
      prize,
      endTimestamp,
      channel: giveaway.channel.id,
      id: giveaway.id,
      users: [],
      ended: false,
      guildOnly,
      verifiedOnly,
    });
    fs.writeFileSync("data/giveaways.json", JSON.stringify(giveawayData, null, 2));

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Enter Giveaway").setCustomId(`g.e.${giveaway.id}`).setStyle(ButtonStyle.Success),
      new ButtonBuilder().setLabel("Edit").setCustomId(`g.edit.${giveaway.id}`).setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setLabel("Claim Giveaway")
        .setCustomId(`t.o.g.${giveaway.id}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)
    );
    await giveaway.edit({ embeds: [giveawayEmbed], components: [row] });

    await interaction.followUp({ content: `Giveaway created! [View here](${giveaway.url})` });
  },
};
