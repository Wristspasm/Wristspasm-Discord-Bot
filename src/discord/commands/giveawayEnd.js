const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "giveaway-end",
  description: "Create a giveaway",
  moderatorOnly: true,
  defer: true,
  options: [
    {
      name: "id",
      description: "Giveaway id (Message id)",
      type: 3,
      required: true
    }
  ],

  execute: async (interaction) => {
    const giveawayData = JSON.parse(fs.readFileSync("data/giveaways.json", "utf-8"));
    const id = interaction.options.getString("id");
    const giveaway = giveawayData.find((x) => x.id === id);
    if (!giveaway) {
      return interaction.followUp({ content: "Giveaway not found!" });
    }
    if (giveaway.ended) {
      return interaction.followUp({ content: "Giveaway already ended!" });
    }
    const winners = [];
    for (let i = 0; i < giveaway.winners; i++) {
      const users = giveaway.users.filter((x) => x.winner === false);
      if (users.length === 0) break;
      const winner = users[Math.floor(Math.random() * users.length)];
      winners.push(`<@${winner.id}>`);
      giveaway.users.find((x) => x.id === winner.id).winner = true;
    }
    const channel = await guild.channels.fetch(giveaway.channel);
    const message = await channel.messages.fetch(giveaway.id);
    const claimRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Claim Giveaway")
        .setCustomId(`t.o.g.${giveaway.id}`)
        .setStyle(ButtonStyle.Success)
        .setDisabled(false)
    );
    message.reply({
      content: `Congratulations to ${winners.join(", ")} for winning the giveaway!`,
      components: [claimRow]
    });
    const giveawayEmbed = new EmbedBuilder()
      .setColor(3447003)
      .setTitle("Giveaway")
      .addFields(
        {
          name: "Prize",
          value: `${giveaway.prize}`,
          inline: true
        },
        {
          name: "Host",
          value: `<@${giveaway.host}>`,
          inline: true
        },
        {
          name: "Entries",
          value: `${giveaway.users.length}`,
          inline: true
        },
        {
          name: "Winners",
          value: `${winners.join(", ")}`
        },
        {
          name: "Ends At",
          value: `<t:${giveaway.endTimestamp}:f> (<t:${giveaway.endTimestamp}:R>)`
        },
        {
          name: "Requirements",
          value: `Guild Member: ${
            giveaway.guildOnly ? "<:icons_Correct:1249308284075376641>" : "<:icons_Wrong:1249307619739570218>"
          }\nVerified: ${
            giveaway.verifiedOnly ? "<:icons_Correct:1249308284075376641>" : "<:icons_Wrong:1249307619739570218>"
          }`
        }
      )
      .setFooter({
        text: `by @.kathund | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png"
      });
    giveaway.ended = true;
    fs.writeFileSync("data/giveaways.json", JSON.stringify(giveawayData, null, 2));

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Enter Giveaway")
        .setCustomId(`g.e.${giveaway.id}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setLabel("Edit")
        .setCustomId(`g.edit.${giveaway.id}`)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setLabel("Claim Giveaway")
        .setCustomId(`t.o.g.${giveaway.id}`)
        .setStyle(ButtonStyle.Success)
        .setDisabled(false)
    );
    message.edit({ embeds: [giveawayEmbed], components: [row] });

    await interaction.followUp({ content: "Giveaway Ended!" });
  }
};
