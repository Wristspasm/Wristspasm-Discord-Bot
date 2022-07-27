const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const { MessageEmbed } = require('discord.js');
process.on('uncaughtException', function (err) {console.log(err.stack);});


module.exports = {
	data: new SlashCommandBuilder()
		.setName("verify")
		.setDescription("Link your Discord Account to Minecraft Account")
		.addStringOption(option => option.setName("ign").setDescription("Your username or UUID").setRequired(true)),

	async execute(interaction, client) {
		const ign = interaction.options.getString("ign");
		hypixel.getPlayer(ign).then(player => {
			let found = false;
			const discordTag = player.socialMedia.forEach(media => {
				if (media.link === interaction.user.tag) {found = true;}
			});
			if (found) {
				fs.writeFile(`data/${interaction.user.id}`, `${player.uuid}`, (err) => {
					if (err) {
						const exampleEmbed = new MessageEmbed()
							.setColor('#ff0000')
							.setAuthor({ name: 'An Error has occured!'})
							.setDescription(`${err}`)
							.setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
						interaction.reply({ embeds: [exampleEmbed] });
					}
					const exampleEmbed = new MessageEmbed()
						.setColor('#00FF00')
						.setAuthor({ name: 'Successfully linked!'})
						.setDescription(`Your account has been successfully linked to \`${ign}\``)
						.setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
					interaction.reply({ embeds: [exampleEmbed] });
					return;
				});
			} else {
				const exampleEmbed = new MessageEmbed()
					.setColor('#0099ff')
					.setAuthor({ name: 'Link with Hypixel Social Media', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' })
					.setDescription(`**Instructions:** \n1) Use your Minecraft client to connect to Hypixel. \n2) Once connected, and while in the lobby, right click "My Profile" inmyour hotbar. It is option #2. \n3) Click "Social Media" - this button is to the left of the Redstone block (the Status button). \n4) Click "Discord" - it is the second last option. \n5) Paste your Discord username into chat and hit enter. For reference: \`DuckySoLucky#5181\`\n6) You're done! Wait around 30 seconds and then try again.\n \n**Getting "The URL isn't valid!"?** \nHypixel has limitations on the characters supported in a Discord username. Try changing your Discord username temporarily to something without special characters, updating it in-game, and trying again.`)
					.setThumbnail('https://thumbs.gfycat.com/DentalTemptingLeonberger-size_restricted.gif') 
					.setTimestamp()
					.setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
				interaction.reply({ embeds: [exampleEmbed] });
			}

		}).catch(err => {
			const exampleEmbed = new MessageEmbed()
				.setColor('#ff0000')
				.setAuthor({ name: 'An Error has occured!'})
				.setDescription(`${err}`)
				.setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
			interaction.reply({ embeds: [exampleEmbed] });
		});
	}
}
	