const CommunicationBridge = require('../contracts/CommunicationBridge')
const { getUsername } = require('../contracts/API/PlayerDBAPI')
const StateHandler = require('./handlers/StateHandler')
const ErrorHandler = require('./handlers/ErrorHandler')
const eventNotifier = require('./other/eventNotifier')
const ChatHandler = require('./handlers/ChatHandler')
const CommandHandler = require('./CommandHandler')
const config = require('../../config.json')
const mineflayer = require('mineflayer')
const Filter = require('bad-words')
const Logger = require('../Logger')
const filter = new Filter()
let minecraftUsername


class MinecraftManager extends CommunicationBridge {
  constructor(app) {
    super()

    this.app = app

    this.stateHandler = new StateHandler(this)
    this.errorHandler = new ErrorHandler(this)
    this.chatHandler = new ChatHandler(this, new CommandHandler(this))
  }

  connect() {
    global.bot = this.createBotConnection()
    this.bot = bot

    this.errorHandler.registerEvents(this.bot)
    this.stateHandler.registerEvents(this.bot)
    this.chatHandler.registerEvents(this.bot)
  }

  createBotConnection() {
    return mineflayer.createBot({
      host: "mc.hypixel.net",
      port: 25565,
      version: "1.12.2",
      auth: "microsoft",
    })
  }

  async onBroadcast({ member, channel, username, message, replyingTo  }) { 
    /*
     ! NOTE: (To dev)
     TODO: REWRITE THIS PART ON GUILD REVAMP
     ? Remove on guild Discord Revamp ^^

     * if (linked?.[member?.id]?.data[0]) 
    */
    Logger.broadcastMessage(`${minecraftUsername ? minecraftUsername : username}: ${message}`, 'Minecraft')
    if(config.discord.filterMessages){
      if (this.bot.player !== undefined) {
        if (channel == config.discord.officerChannel) {this.bot.chat(filter.clean(`/oc ${replyingTo ? `${minecraftUsername ? minecraftUsername : username} replying to ${replyingTo} »` : `${minecraftUsername ? minecraftUsername : username} »`} ${message}`))}
        else { this.bot.chat(filter.clean(`/gc ${replyingTo ? `${minecraftUsername ? minecraftUsername : username} replying to ${replyingTo} »` : `${minecraftUsername ? minecraftUsername : username} »`} ${message}`))}
      }
    } else{
      if (this.bot.player !== undefined) {
        if (channel == config.discord.officerChannel) {this.bot.chat(`/oc ${replyingTo ? `${minecraftUsername ? minecraftUsername : username} replying to ${replyingTo} »` : `${minecraftUsername ? minecraftUsername : username} »`} ${message}`)}
        else { this.bot.chat(`/gc ${replyingTo ? `${minecraftUsername ? minecraftUsername : username} replying to ${replyingTo} »` : `${minecraftUsername ? minecraftUsername : username} »`} ${message}`)}
      }
    }
  }
}

module.exports = MinecraftManager
