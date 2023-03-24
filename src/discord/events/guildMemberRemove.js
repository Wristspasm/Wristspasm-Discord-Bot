const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setDescription(`**${member.user} left the server**`)
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL(),
      })
      .setFooter({
        text: `by DuckySoLucky#5181 | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    const channel = member.guild.channels.cache.get("1070775096463073335");

    channel.send({ embeds: [embed] });
  },
};
