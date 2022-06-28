const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Interaction, Client } = require('discord.js');
const fs = require("fs");
const cfg = require("../../config.json");
process.on('uncaughtException', function (err) {console.log(err.stack);});

module.exports = {
	data: new SlashCommandBuilder()
    .setName("setapikey")
    .setDescription("(Admin Command) Change the API key")
    .addStringOption(option => option.setName("key").setDescription("API Key").setRequired(true)),

    /**
     * 
     * @param {Interaction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {
        if (!interaction.memberPermissions.has("ADMINISTRATOR") && !interaction.member.roles.includes(interaction.guild.roles.cache.get(cfg.admin_role_id)) && interaction.member.user.id != cfg.member_ids.calculus && interaction.member.user.id != cfg.member_ids.ducky) {
			const exampleEmbed = new MessageEmbed()
				.setColor('#ff0000')
				.setAuthor({ name: 'An Error has occured!'})
				.setDescription(`You do not have permission to use this command!`)
				.setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
			interaction.reply({ embeds: [exampleEmbed] });
            return;
        }

        fs.readFile("config.json", (err, data) => {
            if (err) {
                const exampleEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setAuthor({ name: 'An Error has occured!'})
                    .setDescription(`${err}`)
                    .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                interaction.reply({ embeds: [exampleEmbed] });
            }

            data = JSON.parse(data);
            console.log(data.minecraft.apiKey)
            data.api_key = interaction.options.getString("apiKey");
            data = JSON.stringify(data);
            fs.writeFile("config.json", data, (err, data) => {
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
                    .setAuthor({ name: 'API has been successfully changed!'})
                    .setDescription(`Api has been successfully changed to the \`${interaction.options.getString("key")}\``)
                    .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                interaction.reply({ embeds: [exampleEmbed] }).then(exampleEmbed => {
                    exampleEmbed.delete({ timeout: 3000 })
                });//f0cc904f-34b8-4a8f-b77c-67530162eaa1
            })
        });
}
}