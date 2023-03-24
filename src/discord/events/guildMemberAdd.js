const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const embed = new EmbedBuilder()
      .setColor("#4BB543")
      .setDescription(`**${member.user} joined the server**`)
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
