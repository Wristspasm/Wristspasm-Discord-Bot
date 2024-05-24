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
      message.reply({ content: `Congratulations to ${winners.join(", ")} for winning the giveaway!` });
      const giveawayEmbed = new EmbedBuilder()
        .setColor(3447003)
        .setTitle("Giveaway")
        .addFields(
          {
            name: "Prize",
            value: giveaway.prize,
            inline: true,
          },
          {
            name: "Winners",
            value: winners,
            inline: true,
          },
          {
            name: "Ends At",
            value: `<t:${giveaway.endTimestamp}:f> (<t:${giveaway.endTimestamp}:R>)`,
            inline: true,
          },
          {
            name: "Host",
            value: `<@${giveaway.host.id}>`,
            inline: false,
          }
        );

      giveaway.ended = true;
      fs.writeFileSync("data/giveaways.json", JSON.stringify(giveaways, null, 2));

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Enter Giveaway")
          .setCustomId(`g.e.${giveaway.id}`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
        new ButtonBuilder()
          .setLabel("Claim Giveaway")
          .setCustomId(`t.o.g.${giveaway.id}`)
          .setStyle(ButtonStyle.Primary)
          .setDisabled(false)
      );
      message.edit({ embeds: [giveawayEmbed], components: [row] });
    });
  } catch (error) {
    console.log(error);
  }
}

cron.schedule("* * * * *", checkGiveaways);
