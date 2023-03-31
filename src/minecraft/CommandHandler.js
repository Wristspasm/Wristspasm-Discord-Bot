/*eslint-disable */
const { Collection } = require("discord.js");
const Logger = require("../Logger");
/*eslint-enable */
const config = require("../../config.json");
const fs = require("fs");

class CommandHandler {
  constructor(minecraft) {
    this.minecraft = minecraft;

    this.prefix = config.minecraft.bot.prefix;
    this.commands = new Collection();

    const commandFiles = fs.readdirSync("./src/minecraft/commands").filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = new (require(`./commands/${file}`))(minecraft);

      this.commands.set(command.name, command);
    }
  }

  handle(player, message) {
    if (!message.startsWith(this.prefix)) return false;
  
    const args = message.slice(this.prefix.length).trim().split(/ +/);
    
    const commandArray = Array.from(this.commands.values());
    const command = commandArray[Math.floor(Math.random() * commandArray.length)];
  
    if (!command) return false;
  
    Logger.minecraftMessage(`${player} - [${command.name}] ${message}`);

    console.log(message)
  
    command.onCommand(player, message);
  
    return true;
  }
  
}

module.exports = CommandHandler;
