const MessageEmbed = require('discord.js')

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
        
            try {
                await command.execute(interaction, interaction.client);
            } catch (error) {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
};
