const { SuccessEmbed, LogEmbed } = require("../../contracts/embedHandler.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "unmute",
  description: "Unmute the given user",
  moderatorOnly: true,
  ephemeral: true,
  options: [
    {
      name: "user",
      description: "User to mute",
      type: 6,
      required: true,
    },
    {
      name: "reason",
      description: "Reason",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction) => {
    let user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided.";
    user = await interaction.guild.members.fetch(user.id);
    user.timeout(null, `${reason} | ${interaction.user.username}`);
    const caseData = JSON.parse(fs.readFileSync("data/cases.json", "utf-8"));
    const muteCase = caseData
      .filter((x) => x.user === user.id && x.action === "Mute")
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    const caseId = caseData.findIndex((x) => x === muteCase);
    const embedLog = new LogEmbed(
      caseData.length + 1,
      interaction.user.id,
      user.id,
      "UnMute",
      `Mute Case ID: ${caseId + 1}\nUrl: ${muteCase.logUrl}`,
      reason,
    );
    const logChannel = await interaction.guild.channels.cache.get(config.discord.channels.punishmentsChannel);
    const logMsg = await logChannel.send({ embeds: [embedLog] });
    caseData.push({
      moderator: interaction.user.id,
      user: user.id,
      action: "UnwMute",
      info: `Mute Case ID: ${caseId + 1}\nUrl: ${muteCase.logUrl}`,
      reason: reason,
      logUrl: logMsg.url,
      timestamp: Date.now(),
    });
    fs.writeFileSync("data/cases.json", JSON.stringify(caseData, null, 2));

    const embed = new SuccessEmbed(`Successfully unmuted **<@${user.id}>**.\nLog: ${logMsg.url}`);
    await interaction.followUp({
      embeds: [embed],
    });
  },
};
