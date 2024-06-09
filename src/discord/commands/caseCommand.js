const { LogEmbed } = require("../../contracts/embedHandler.js");
const fs = require("fs");

module.exports = {
  name: "case",
  description: "Unmute the given user",
  moderatorOnly: true,
  ephemeral: true,
  options: [
    {
      name: "case-id",
      description: "The case id you want to look up",
      type: 4,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const caseData = JSON.parse(fs.readFileSync("data/cases.json", "utf-8"));
    const caseId = interaction.options.getInteger("case-id");
    const caseInfo = caseData[caseId - 1];
    if (!caseInfo) {
      return interaction.followUp({ content: "Case not found!" });
    }
    await interaction.followUp({
      content: `Case Url: ${caseInfo.logUrl}`,
    });
  },
};
