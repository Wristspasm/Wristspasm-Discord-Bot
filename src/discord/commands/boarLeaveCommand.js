const { SuccessEmbed } = require("../../contracts/embedHandler.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const { readFileSync, writeFileSync } = require("fs");

module.exports = {
  name: "boar-ping-leave",
  description: "Stop getting pinged with boars",
  defer: true,

  execute: async (interaction) => {
    const boarData = readFileSync("data/boar.json");
    if (!boarData) {
      throw new WristSpasmError("The boar data file does not exist. Please contact an administrator.");
    }

    let boar = JSON.parse(boarData);
    if (!boar) {
      throw new WristSpasmError("The boar data file is malformed. Please contact an administrator.");
    }
    boar = boar.filter((user) => user !== interaction.user.id);
    writeFileSync("data/boar.json", JSON.stringify(boar, null, 2));
    const embed = new SuccessEmbed("You will no longer be pinged for boar", {
      text: `by @.kathund | /help [command] for more information`,
      iconURL: "https://i.imgur.com/uUuZx2E.png"
    });
    await interaction.followUp({ embeds: [embed] });
  }
};
