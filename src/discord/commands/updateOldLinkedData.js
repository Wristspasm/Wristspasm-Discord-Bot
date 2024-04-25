const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

// ! This command is only used once to update old verification data to the new format
// ! DO NOT Enable this command unless you know what you are doing
const DISABLED = true;

module.exports = {
  name: "update-old-linked-data",
  description: "Updates old verification data to the new format",
  moderatorOnly: true,

  execute: async (interaction) => {
    if (DISABLED === true) {
      throw new WristSpasmError("This command is disabled.");
    }
    const oldData = JSON.parse(fs.readFileSync("data/discordLinked.json", "utf8"));
    if (oldData === undefined) {
      throw new WristSpasmError("No old linked users found!");
    }

    const newData = [];
    const dupes = [];
    Object.keys(oldData).forEach((key) => {
      if (newData.find((x) => x.uuid === oldData[key])) {
        dupes.push({ id: key, uuid: oldData[key] });
      } else {
        newData.push({
          id: key,
          uuid: oldData[key],
        });
      }
    });
    fs.writeFileSync("data/linked.json", JSON.stringify(newData, null, 2));

    const successfullyLinked = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Successfully updated!" })
      .setDescription(`Successfully updated old verification data to the new format`)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.editReply({ embeds: [successfullyLinked] });
  },
};
