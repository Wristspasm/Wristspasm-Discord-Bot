const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const { writeAt } = require("../../contracts/helperFunctions");
const { getUUID, getUsername } = require("../../contracts/API/PlayerDBAPI");

module.exports = {
  name: "overrideverify",
  description: "Connect your Discord account to Minecraft",
  options: [
    {
      name: "name",
      description: "Minecraft Username or UUID",
      type: 3,
      required: true,
    },
    {
      name: "user",
      description: "Discord User",
      type: 6,
      required: true,
    },
  ],

  execute: async (interaction) => {
    try {
      if (
        (await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole) ===
        false
      )
        throw "You do not have permission to use this command.";

      let uuid = interaction.options.getString("name");
      const id = interaction.options._hoistedOptions[1].user.id;
      let username;

      if (
        /^[0-9a-fA-F]{8}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{12}$/.test(uuid) === false ||
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid) === false
      ) {
        username = uuid;
        uuid = await getUUID(uuid);
      } else {
        username = await getUsername(uuid);
      }

      const minecraftLinked = require("../../../data/minecraftLinked.json");
      Object.keys(minecraftLinked).map((uuid) => {
        if (minecraftLinked[uuid] === id) delete minecraftLinked[uuid];
      });
      fs.writeFileSync("data/minecraftLinked.json", JSON.stringify(minecraftLinked, null, 2));

      await Promise.all([
        writeAt("data/discordLinked.json", `${id}`, `${uuid}`),
        writeAt("data/minecraftLinked.json", `${uuid}`, `${id}`),
      ]);

      await interaction.guild.members.fetch(id).then((member) => member.roles.add(linkedRole));
      await interaction.guild.members.fetch(id).then((member) => member.setNickname(username));

      //if ((await interaction.guild.members.fetch(id)).roles.highest.rawPosition > (await interaction.guild.members.fetch(interaction.client.user.id)).roles.highest.rawPosition === false) {

      const successfullyLinked = new EmbedBuilder()
        .setColor(5763719)
        .setAuthor({ name: "Successfully linked!" })
        .setDescription(
          `\`${username}\` has been successfully linked to \`${
            (await interaction.guild.members.fetch(id)).user.username
          }#${(await interaction.guild.members.fetch(id)).user.discriminator}\``
        )
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.followUp({ embeds: [successfullyLinked] });

      const updateRolesCommand = require("./rolesCommand");
      await updateRolesCommand.execute(interaction, await interaction.guild.members.fetch(id), "verify");
    } catch (error) {
      console.log(error);

      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(
          `\`\`\`${error.toString().replaceAll("[hypixel-api-reborn] ", "").replaceAll("Error: ", "")}\`\`\``
        )
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
