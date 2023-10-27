const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "sync-linked-data",
  description: "Syncs Linked files with each other.",

  execute: async (interaction, followUp = false) => {
    if (interaction.user.id !== "486155512568741900") {
      throw new WristSpasmError("You don't have permission to use this command.");
    }

    const users = await interaction.guild.members.fetch();
    if (users === undefined) {
      throw new WristSpasmError("No guild members found!");
    }

    const linkedData = fs.readFileSync("data/discordLinked.json", "utf8");
    if (linkedData === undefined) {
      throw new WristSpasmError("No linked users found!");
    }

    const linked = JSON.parse(linkedData);
    if (linked === undefined) {
      throw new WristSpasmError("Failed to parse Linked data!");
    }

    const output = {};
    for (const [id, uuid] of Object.entries(linked)) {
      output[uuid] = id;
    }

    fs.writeFileSync("data/minecraftLinked.json", JSON.stringify(output, null, 2));

    const successEmbed = new EmbedBuilder()
      .setColor(3066993)
      .setAuthor({ name: "Success!" })
      .setDescription(`Linked data has been synced!`)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    if (followUp === true) {
      successEmbed.setDescription(`Link data has been successfuly synced.`);
      
      return await interaction.followUp({ embeds: [successEmbed] });
    }

    await interaction.editReply({ embeds: [successEmbed] });
  },
};
