const { SuccessEmbed } = require("../../contracts/embedHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const ms = require("ms");
const fs = require("fs");

module.exports = {
  name: "mute",
  description: "Mutes the given user for a given amount of time.",
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
      name: "time",
      description: "Time",
      type: 3,
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
    let [user, time] = [interaction.options.getUser("user"), interaction.options.getString("time")];
    const reason = interaction.options.getString("reason") || "No reason provided.";
    user = await interaction.guild.members.fetch(user.id);
    const unmuteTime = Math.floor((Date.now() + ms(time)) / 1000);
    user.timeout(ms(time), `${reason} | ${interaction.user.username}`);
    const caseData = JSON.parse(fs.readFileSync("data/cases.json", "utf-8"));
    caseData.push({
      moderator: interaction.user.id,
      user: user.id,
      action: "Mute",
      info: `Muted: ${time}\nUnmuted: <t:${unmuteTime}:f> (<t:${unmuteTime}:R>)`,
      reason: reason,
      timestamp: Date.now(),
      infraction: true,
    });
    let footer = "";
    const infractions = caseData.filter((c) => c.user === user.id && c.infraction === true);
    if (infractions.length === 2) {
      footer = `### **:warning:** This is <@${user.id}>'s **2nd** infraction. **:warning:**`;
    } else if (infractions.length === 3) {
      footer = `## **:exclamation:** This is <@${user.id}>'s **3rd** infraction. **:exclamation:**`;
    } else if (infractions.length >= 4) {
      footer = `# **:exclamation:** __This is <@${user.id}>'s **${infractions.length}th** infraction.__ **:exclamation:**`;
    } else {
      footer = `**This is <@${user.id}>'s 1st infraction.**`;
    }
    const logEmbed = new EmbedBuilder()
      .setTitle(`Case #${caseData.length}`)
      .setDescription(
        `### <@${user.id}> has been **Muted** by <@${interaction.user.id}>\n\nDurration: ${time}\nReason: ${reason}\nUnmute: <t:${unmuteTime}:f> (<t:${unmuteTime}:R>)\n${footer}`,
      );
    const logChannel = await interaction.guild.channels.cache.get(config.discord.channels.punishmentsChannel);
    const logMsg = await logChannel.send({ embeds: [logEmbed] });
    fs.writeFileSync("data/cases.json", JSON.stringify(caseData, null, 2));
    const embed = new SuccessEmbed(
      `Successfully muted **<@${user.id}>** for ${time}. They will be unmuted at <t:${unmuteTime}:f> (<t:${unmuteTime}:R>)\nLog: ${logMsg.url}`,
    );

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
