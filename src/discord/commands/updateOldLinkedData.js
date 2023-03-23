const { writeAt } = require('../../contracts/helperFunctions');
const { EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');
const fs = require('fs');

// ! This command is only used once to update old verification data to the new format
// ! DO NOT Enable this command unless you know what you are doing
const DISABLED = true;

module.exports = {
    name: 'update-old-linked-data',
    description: 'Updates old verification data to the new format',
  
    execute: async (interaction) => {
        try {
            if ((await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole) === false) throw new Error("You do not have permission to use this command.");
            
            if (DISABLED) throw new Error("This command is disabled.");

            const oldData = JSON.parse(fs.readFileSync('data/oldDiscordLinked.json', 'utf8'))

            for (const [key, value] of Object.entries(oldData)) {
                await writeAt('data/discordLinked.json', `${key}`, `${value.data[0]}`)
                await writeAt('data/minecraftLinked.json', `${value.data[0]}`, `${key}`)
            }

            const successfullyLinked = new EmbedBuilder()
                .setColor(5763719)
                .setAuthor({ name: "Successfully updated!" })
                .setDescription(`Successfully updated old verification data to the new format`)
                .setFooter({
                    text: `by DuckySoLucky#5181 | /help [command] for more information`,
                    iconURL: "https://imgur.com/tgwQJTX.png",
                });

            await interaction.editReply({ embeds: [successfullyLinked] });
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