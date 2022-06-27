const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const hypixel = require('../handlers/Hypixel')
const { MessageEmbed } = require('discord.js');
process.on('uncaughtException', function (err) {console.log(err.stack);});


module.exports = {
	data: new SlashCommandBuilder()
        .setName("verifyoverride")
        .setDescription("(Admin Command) Override verify command")
        .addStringOption(option => option.setName("ign").setDescription("Username").setRequired(true))
        .addStringOption(option => option.setName("id").setDescription("Discord").setRequired(true)),

	async execute(interaction, client) {
        if (!interaction.memberPermissions.has("ADMINISTRATOR") && !interaction.member.roles.includes(interaction.guild.roles.cache.get(cfg.admin_role_id))) {
			const exampleEmbed = new MessageEmbed()
				.setColor('#ff0000')
				.setAuthor({ name: 'An Error has occured!'})
				.setDescription(`You do not have permission to use this command!`)
				.setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
			interaction.reply({ embeds: [exampleEmbed] });
            return;
        }

        const ign = interaction.options.getString("ign");
        const id = interaction.options.getString("id");

        hypixel.getPlayer(ign).then(player => {
            fs.writeFile(`data/${id}`, `${player.uuid}`, (err) => {
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
                    .setDescription(`\`${ign}\` has been successfully linked to \`${id}\``)
                    .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                interaction.reply({ embeds: [exampleEmbed] });
                return;
            });

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