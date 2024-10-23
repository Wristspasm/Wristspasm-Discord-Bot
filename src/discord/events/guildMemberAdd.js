const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const embed = new EmbedBuilder()
      .setColor("#4BB543")
      .setDescription(`**${member.user} joined the server**`)
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL()
      })
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png"
      });

    const channel = member.guild.channels.cache.get(config.discord.channels.discordLogsChannel);

    channel.send({ embeds: [embed] });
  }
};
