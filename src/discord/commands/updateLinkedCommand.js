const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "update-linked",
  description: "Removes linked role from users who are not linked",
  options: [],

  execute: async (interaction) => {
    try {
      interaction.guild.members.fetch({ 
        withPresences: true,
        force: true
      }).then(async (members) => {
        console.log(members)
      })
      .catch((error) => {
        console.log(error)
      })

    } catch (error) {
        console.log(error)
        const errorEmbed = new EmbedBuilder()
            .setColor(15548997)
            .setAuthor({ name: "An Error has occurred" })
            .setDescription(`\`\`\`${error.toString().replaceAll("[hypixel-api-reborn] ", "").replaceAll("Error: ", "")}\`\`\``)
            .setFooter({
                text: `by DuckySoLucky#5181 | /help [command] for more information`,
                iconURL: "https://imgur.com/tgwQJTX.png",
            });

        await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
