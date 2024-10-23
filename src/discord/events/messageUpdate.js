const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage) {
    if (oldMessage.author.bot) return;

    if (oldMessage.content === newMessage.content) return;

    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setDescription(`**Message edited in ${oldMessage.channel} [Message](${oldMessage.url})**`)
      .setAuthor({
        name: oldMessage.author.tag,
        iconURL: oldMessage.author.displayAvatarURL()
      })
      .addFields(
        { name: "Before", value: oldMessage.content, inline: false },
        { name: "After", value: newMessage.content, inline: false }
      )
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png"
      });

    const channel = oldMessage.guild.channels.cache.get(config.discord.channels.discordLogsChannel);

    channel.send({ embeds: [embed] });
  }
};
