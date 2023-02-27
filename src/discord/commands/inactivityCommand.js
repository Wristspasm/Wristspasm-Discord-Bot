const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI");
const { toFixed, writeAt } = require("../../contracts/helperFunctions");
const { getUsername } = require("../../contracts/API/PlayerDBAPI");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const fs = require('fs')

module.exports = {
  name: "inactivity",
  description: "Send an inactivity notice to the guild staff",
  options: [
    {
      name: "time",
      description: "How long will you be inactive for (in Days)",
      type: 3,
      required: true,
    },
    {
      name: "reason",
      description: "Why are you going to be offline (optional)?",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction) => {
    try {
      const linked = JSON.parse(fs.readFileSync('data/discordLinked.json', 'utf8'));
      if (linked === undefined) throw new Error("No verification data found. Please contact an administrator.");

      const uuid = linked[interaction.user.id];
      if (uuid === undefined) throw new Error("You are no verified. Please verify using /verify.");
      const username = await getUsername(linked[interaction.user.id]);

      const guild = await hypixelRebornAPI.getGuild("name", "WristSpasm");
      if (guild === undefined) throw new Error("Guild data not found. Please contact an administrator.");

      const member = guild.members.find((member) => member.uuid === uuid);
      if (member === undefined) throw new Error("You are not in the guild.");

      const time = interaction.options.getString("time") * 86400;
      if (time >= 14 * 86400) throw new Error("You can only request inactivity for 14 days or less. Please contact an administrator if you need to be inactive for longer.");

      const reason = interaction.options.getString("reason") || "None";
      const expiration = toFixed(new Date().getTime() / 1000 + time, 0);

      const inactivityEmbed = new EmbedBuilder()
        .setColor(5763719)
        .setAuthor({ name: "Inactivity request." })
        .setThumbnail(`https://www.mc-heads.net/avatar/${username}`)
        .setDescription(
          `\`Username:\` ${username}\n\`Requested:\` <t:${toFixed(
            new Date().getTime() / 1000,
            0
          )}>\n\`Expiration:\` <t:${toFixed(
            expiration,
            0
          )}:R>\n\`Reason:\` ${reason}`
        )
        .setFooter({
          text: `by DuckySoLucky#5181 | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      const channel = interaction.client.channels.cache.get(config.discord.channels.inactivity);
      if (channel === undefined) throw new Error("Inactivity channel not found. Please contact an administrator.");
      await channel.send({ embeds: [inactivityEmbed] });

      writeAt("data/inactivity.json", uuid, {
        username: username,
        uuid: uuid,
        discord: interaction.user.tag,
        discord_id: interaction.user.id,
        requested: toFixed(new Date().getTime() / 1000, 0),
        requested_formatted: new Date().toLocaleString(),
        expiration: expiration,
        expiration_formatted: new Date(expiration * 1000).toLocaleString(),
        reason: reason,
      });

      const inactivityResponse = new EmbedBuilder()
        .setColor(5763719)
        .setAuthor({ name: "Inactivity request." })
        .setDescription(`Inactivity request has been successfully sent to the guild stafff.`)
        .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: "https://imgur.com/tgwQJTX.png" });

      await interaction.followUp({ embeds: [inactivityResponse] });

    } catch (error) {
      console.log(error)

      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: 'An Error has occurred'})
        .setDescription(`\`\`\`${error.toString().replaceAll("[hypixel-api-reborn] ", "").replaceAll("Error: ", "")}\`\`\``)
        .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
