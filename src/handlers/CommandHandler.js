const fs = require('fs')
const config = require('../../config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const DiscordMaanger = require('../DiscordManager')

class CommandHandler {
  constructor(discord) {
    this.discord = discord
    
    const commands = [];
    const _commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'));
    
    for (const file of _commandFiles) {
      const command = require(`../commands/${file}`);
      commands.push(command.data.toJSON());
    }
    const rest = new REST({ version: '9' }).setToken(config.discord.token);
    
    rest.put(Routes.applicationGuildCommands(config.discord.clientID, config.discord.serverID), { body: commands }).catch(console.error);
  }

  handle(message) {
    /*if (!message.content.startsWith(this.prefix)) {
      return false
    }

    let args = message.content.slice(this.prefix.length).trim().split(/ +/)
    let commandName = args.shift().toLowerCase()

    let command = this.commands.get(commandName)
      || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) {
      return false
    }

    if ((command.name != 'help' && !this.isCommander(message.member)) || (command.name != 'online' && !this.isCommander(message.member)) || (command.name == 'override' && !this.isOwner(message.author))) {
      return message.channel.send({
        embed: {
          description: `You don't have permission to do that.`,
          color: 'DC143C'
        }
      })
    }

    this.discord.app.log.discord(`[${command.name}] ${message.content}`)
    command.onCommand(message)

    return true
  }

  isCommander(member) {
    return member.roles.cache.find(r => r.id == this.discord.app.config.discord.commandRole)
  }

  isOwner(member) {
    return member.id == this.discord.app.config.discord.ownerId*/
  }
}

module.exports = CommandHandler