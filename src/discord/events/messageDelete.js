const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "messageDelete",
  async execute(message) {
    if (message.author.bot) return;

    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setDescription(`**Message sent by ${message.author} deleted in ${message.channel}**`)
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL()
      })
      .addFields({ name: "Message", value: message.content, inline: false })
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png"
      });

    const channel = message.guild.channels.cache.get(config.discord.channels.discordLogsChannel);

    channel.send({ embeds: [embed] });
  }
};
