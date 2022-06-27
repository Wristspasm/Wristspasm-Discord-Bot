class StateHandler {
    constructor(discord) {
      this.discord = discord
    }
  
    async onReady() {
      this.discord.app.log.discord('Client ready, logged in as ' + this.discord.client.user.tag)
      this.discord.client.user.setActivity('/g join WristSpasm', { type: 'PLAYING' })
  
    }
  }
  
  async function getWebhook(discord, channelID) {
    let channel = discord.client.channels.cache.get(channelID)
  
    let webhooks = await channel.fetchWebhooks()
    if (webhooks.first()) {
      return webhooks.first()
    } else {
      var res = await channel.createWebhook(discord.client.user.username, {
        avatar: discord.client.user.avatarURL(),
      })
      return res
    }
  }
  
  module.exports = StateHandler