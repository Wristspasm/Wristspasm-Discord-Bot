const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const cron = require("node-cron");
const fs = require("fs");

async function checkGiveaways() {
  try {
    const giveaways = JSON.parse(fs.readFileSync("data/giveaways.json", "utf8"));
    if (giveaways === undefined) return;
    if (giveaways.length === 0) return;
    giveaways.forEach(async (giveaway) => {
      if (giveaway.ended) return;
      if (giveaway.endTimestamp >= Math.floor(Date.now() / 1000)) return;
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
          .setDisabled(false),
      );
      message.reply({
        content: `Congratulations to ${winners.join(", ")} for winning the giveaway!`,
        components: [claimRow],
      });
      const giveawayEmbed = new EmbedBuilder()
        .setColor(3447003)
        .setTitle("Giveaway")
        .addFields(
          {
            name: "Prize",
            value: `${giveaway.prize}`,
            inline: true,
          },
          {
            name: "Host",
            value: `<@${giveaway.host}>`,
            inline: true,
          },
          {
            name: "Entries",
            value: `${giveaway.users.length}`,
            inline: true,
          },
          {
            name: "Winners",
            value: `${giveaway.winners}`,
          },
          {
            name: "Ends At",
            value: `<t:${giveaway.endTimestamp}:f> (<t:${giveaway.endTimestamp}:R>)`,
          },
          {
            name: "Requirements",
            value: `Guild Member: ${giveaway.guildOnly ? "<:icons_Correct:1256841688895459348>" : "<:icons_Wrong:1256841707232690198>"}\nVerified: ${giveaway.verifiedOnly ? "<:icons_Correct:1256841688895459348>" : "<:icons_Wrong:1256841707232690198>"}`,
          },
        )
        .setFooter({
          text: `by @kathund. | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png",
        });

      giveaway.ended = true;
      fs.writeFileSync("data/giveaways.json", JSON.stringify(giveaways, null, 2));

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
          .setDisabled(false),
      );
      message.edit({ embeds: [giveawayEmbed], components: [row] });
    });
  } catch (error) {
    console.log(error);
  }
}

cron.schedule("* * * * *", checkGiveaways);
