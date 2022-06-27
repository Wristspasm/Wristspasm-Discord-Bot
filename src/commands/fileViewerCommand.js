const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require("fs");
process.on('uncaughtException', function (err) {console.log(err.stack);});

module.exports = {
	data: new SlashCommandBuilder()
    .setName("file")
    .setDescription("(Admin Command) View the contents of a file")
    .addStringOption(option => option.setName("file").setDescription("File name").setRequired(true)),

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

        const file = interaction.options.getString("file");
        fs.readFile(`data/${file}`, (err, data) => {
            if (err) {
                const exampleEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setAuthor({ name: 'An Error has occured!'})
                    .setDescription(`${err}`)
                    .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                interaction.reply({ embeds: [exampleEmbed] });
            }

            const fileData = `File contents of \`data/${file}\`\n\`\`\`${data}\`\`\``;

            if (fileData.length <= 2000) {
                interaction.reply(fileData);
            } else {
                interaction.reply({ files: [ `data/${file}` ] });
            }
        });
    }
}