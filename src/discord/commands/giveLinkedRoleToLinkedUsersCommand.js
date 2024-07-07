const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "give-linked-users-role",
  description: "Give linked users a role.",
  moderatorOnly: true,
  defer: true,

  execute: async (interaction) => {
    const users = await interaction.guild.members.fetch();
    if (users === undefined) {
      throw new WristSpasmError("No guild members found!");
    }

    const linked = fs.readFileSync("data/linked.json", "utf8");
    if (linked === undefined) {
      throw new WristSpasmError("No linked users found!");
    }

    const linkedUsers = JSON.parse(linked);
    if (linkedUsers === undefined) {
      throw new WristSpasmError("Failed to parse Linked data!");
    }

    for (const user of linkedUsers) {
      const discUser = await interaction.guild.members.fetch(user.id).catch(() => {});
      if (discUser === undefined) {
        continue;
      }

      discUser.roles.add(config.discord.roles.linkedRole);
      console.log(`Added role to ${discUser.user.username}`);
    }

    const embed = new EmbedBuilder()
      .setTitle("Success!")
      .setDescription("Added role to all linked users.")
      .setColor("#00ff00")
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.followUp({ embeds: [embed] });
  },
};
