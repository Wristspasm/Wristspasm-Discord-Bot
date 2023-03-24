const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage) {
    if (oldMessage.author.bot) return;

    if (oldMessage.content === newMessage.content) return;

    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setDescription(
        `**Message edited in ${oldMessage.channel} [Message](${oldMessage.url})**`
      )
      .setAuthor({
        name: oldMessage.author.tag,
        iconURL: oldMessage.author.displayAvatarURL(),
      })
      .addFields(
        { name: "Before", value: oldMessage.content, inline: false },
        { name: "After", value: newMessage.content, inline: false }
      )
      .setFooter({
        text: `by DuckySoLucky#5181 | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    const channel = oldMessage.guild.channels.cache.get("1070775096463073335");

    channel.send({ embeds: [embed] });
  },
};
