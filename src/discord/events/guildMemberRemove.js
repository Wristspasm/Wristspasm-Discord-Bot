const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setDescription(`**${member.user} left the server**`)
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
