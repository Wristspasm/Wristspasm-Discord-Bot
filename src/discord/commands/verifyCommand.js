
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require ('../../../config.json')
const { MessageEmbed } = require('discord.js')
const { writeAt } = require("json-crate")
const fs = require("fs")


module.exports = {
	data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("(Bridge Bot) Connect your Discord account to Minecraft.")
    .addStringOption(option => option.setName("username").setDescription("Minecraft Username").setRequired(true)),

    async execute(interaction, client, member) {

        const username = interaction.options.getString("username");
		hypixel.getPlayer(username).then(async player => {
			let found = false;
			player.socialMedia.forEach(media => {if (media.link === interaction.user.tag) {found = true}})
			if (found) {
                try {
                    (await member).roles.add(interaction.guild.roles.cache.get(config.discord.linkedRole))
                    
                    await writeAt('data/discordLinked.json', `${interaction.user.id}.data`, 
                        [
                            `${player.uuid}`
                        ])
                    
					await writeAt('data/minecraftLinked.json', `${player.uuid}.data`, 
                        [
                            `${interaction.user.id}`
                        ])

                    const successfullyLinked = new MessageEmbed()
						.setColor('#00FF00')
						.setAuthor({ name: 'Successfully linked!'})
						.setDescription(`Your account has been successfully linked to \`${username}\``)
						.setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
					interaction.reply({ embeds: [ successfullyLinked ] });
                    
                } catch (error) {
                    console.log(error)
                    const errorEmbed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setAuthor({ name: 'An Error has occurred!'})
                        .setDescription(`Please report an error to the Staff.`)
                        .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
                    interaction.reply({ embeds: [errorEmbed] });  
                }
			} else {
				const verificationTutorialEmbed = new MessageEmbed()
					.setColor('#0099ff')
					.setAuthor({ name: 'Link with Hypixel Social Media', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' })
					.setDescription(`**Instructions:** \n1) Use your Minecraft client to connect to Hypixel. \n2) Once connected, and while in the lobby, right click "My Profile" inmyour hotbar. It is option #2. \n3) Click "Social Media" - this button is to the left of the Redstone block (the Status button). \n4) Click "Discord" - it is the second last option. \n5) Paste your Discord username into chat and hit enter. For reference: \`${interaction.user.tag}\`\n6) You're done! Wait around 30 seconds and then try again.\n \n**Getting "The URL isn't valid!"?** \nHypixel has limitations on the characters supported in a Discord username. Try changing your Discord username temporarily to something without special characters, updating it in-game, and trying again.`)
					.setThumbnail('https://thumbs.gfycat.com/DentalTemptingLeonberger-size_restricted.gif') 
					.setTimestamp()
					.setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
				interaction.reply({ content: 'Your Minecraft\'s linked account does not match with the Discord.', embeds: [ verificationTutorialEmbed] });
			}

		}).catch(err => {
			const errorEmbed = new MessageEmbed()
				.setColor('#ff0000')
				.setAuthor({ name: 'An Error has occurred!'})
				.setDescription(`This username does not exist.`)
				.setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
			interaction.reply({ embeds: [errorEmbed] });
		});
    }
}