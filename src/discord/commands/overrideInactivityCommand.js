const config = require("../../../config.json");
const {
  toFixed,
  addCommas,
  writeAt,
} = require("../../contracts/helperFunctions");
const { EmbedBuilder } = require("discord.js");
const { getUsername, getUUID } = require("../../contracts/API/PlayerDBAPI");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI");

module.exports = {
  name: "overrideinactivity",
  description: "Send an inactivity notice to the guild staff",
  options: [
    {
      name: "discord",
      description: "Discord User",
      type: 6,
      required: true,
    },
    {
      name: "minecraft",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
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
      if ((await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole) === false) throw new Error("You do not have permission to use this command.");

      const discord = interaction.options._hoistedOptions[0];

      let uuid = interaction.options.getString("minecraft");
      let username;
      if (/^[0-9a-fA-F]{8}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{12}$/.test(uuid) === false || /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid) === false) {
        username = uuid;
        uuid = await getUUID(uuid);
      } else {
        username = await getUsername(uuid);
      }

      if (uuid === undefined) throw new Error("Player data not found. Please contact an administrator.");

      const guild = await hypixelRebornAPI.getGuild("name", "WristSpasm");
      if (guild === undefined) throw new Error("Guild data not found. Please contact an administrator.");

      const member = guild.members.find((member) => member.uuid === uuid);
      if (member === undefined) throw new Error(`${username} are not in the guild.`);

      const time = interaction.options.getString("time") * 86400;
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
  
        const inactivityResponse = new EmbedBuilder()
          .setColor(5763719)
          .setAuthor({ name: "Inactivity request." })
          .setDescription(`Inactivity request for ${username} has been successfully created.`)
          .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: "https://imgur.com/tgwQJTX.png" });
        await interaction.followUp({ embeds: [inactivityResponse] });
  
        writeAt("data/inactivity.json", uuid, {
          username: username,
          uuid: uuid,
          discord: discord.user.tag,
          discord_id: discord.user.id,
          requested: toFixed(new Date().getTime() / 1000, 0),
          requested_formatted: new Date().toLocaleString(),
          expiration: expiration,
          expiration_formatted: new Date(expiration * 1000).toLocaleString(),
          reason: reason,
        });
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
