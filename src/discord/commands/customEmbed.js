
const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    name: 'embed',
    description: 'test',
  
    execute: async (interaction, client) => {
        await interaction.followUp({ content: 'Nothing to see here :eyes:', ephemeral: true })
        // ? #rules
        /*const rulesEmbed = new EmbedBuilder()
            .setThumbnail('https://imgur.com/fNByP9j.png')
            .setColor(0x0099FF)
            .setDescription(`**WristSpasm Guild Rules**\n\n**Rule #1: Rudeness/Slurs**\nThis rule includes making rude comments to another user. This can range from calling someone names to being racist. Rudeness in any form is not accepted and you will be punished.\n\n**Rule #2: Spamming**\nSpamming similar messages continuously is not allowed. A message should only be sent once and limit the amount of messages you send during a conversation. You do not need 5 different messages for each word of a sentence. Please use the designated <#907487880061014047> channel provided for those messages.\n\n**Rule #3: Bot Commands**\nThis rule means that you should not post commands that a bot replies to in public chats. Please use the designated <#600325477537939476> channel provided for those commands.\n\n**Rule #4: Inappropriate Behaviour**\nBehaving in an inappropriate manner. This can include drug use references, sexual content or any childish remarks. Violent remarks are also not allowed, especially if it is a threat to another user.\n\n**Rule #5: Media**\nThis rule entails the posting of media in the discord. All media (either images or videos) should be posted in our designated <#725727134190141490> channel. Under no circumstance will posting NSFW content be allowed.\n\n**Rule #6: Threats**\nNo threats will be tolerated in the WristSpasm guild discord or guild chat. We take this very seriously and will not hesitate to punish anyone who proceeds to do this. Threats include: DDos, Dox or violent threats. We will ban for any negative threats though.\n\n**Rule #7: Posting Dangerous Links**\nPosting links that will steal personal information from another user or installs malware onto their device is not permitted. You will receive serious punishment if caught.\n\n**Rule #8: Disruption of the guild**\nAttempting to find loopholes to break the rules for example creating alternative accounts to evade a punishment is not allowed. We will update rules so that any attempted loophole does not happen again.\n\n**Rule #9: Advertising**\nTrying to promote other discords is not allowed. This is to protect everyone's privacy and data. Please stick to advertising your social medias in the <#601572483380019200>\n`)

        await client.channels.cache.get('1003356938546983043').send({ embeds: [rulesEmbed] })*/

        // ? #information
        /*const welcomeEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setThumbnail('https://imgur.com/fNByP9j.png')
            .setDescription(`**Welcome to WristSpasm**\nWristSpasm was created on the 3rd September 2018 for a group of friends. Now in 2022, we are #78 on the overall guild leaderboard.`)
        
        const applyEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setDescription(`**Thinking of applying?**\nGreat! We love to see new people in our guild. If you think you have what it takes to join us, then create a request to apply. It only few seconds!\n\nBefore you apply, make sure that you have read and made sure that you meet our requirements. You will be instantly denied if you do not meet them. Check the requirements out at <#1011928466955980870>\n\n[**CLICK HERE TO APPLY**](https://discord.com/channels/600311056627269642/1011928466955980870)`)
        
            
        const rolesEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setDescription(`**Our Guild Roles**\nIn WristSpasm, we have lots of roles that members can obtain as recognition for their hard work.\n\n**Discord Roles**\n<@&1003353024720277504> - The discord for linked players\n<@&903345611863126126> - Novice rank\n<@&903878793859575818> - Elite rank\n<@&695343999783010417> - Discord Server Booster\n<@&863928821215657995> - Hypixel Network Youtuber\n<@&903345849512394752> - Part of Skyblock Nerds\n\n**Guild Roles**\n<@&600311804979183618> - Guild Master\n<@&815855355741470751> - Wrist Spasm Discord Bot\n<@&633073051784708099> - Administrator\n<@&700177102925987850> - Moderator\n<@&700177445957140521> - Trial-Moderator\n<@&987936050649391194> - Developer\n<@&600313217603993617> - WristSpasm Guild Member\n\n**Extra Roles**\n<@&953150787704455198> - Former Guild Staff\n<@&903248083176001597> - OG Guild Member\n`)
            
        await client.channels.cache.get('902686223473188875').send({ embeds: [welcomeEmbed, applyEmbed, rolesEmbed] })*/

        // ? #apply-here
        /*const Embed = new EmbedBuilder()
            .setColor(  )
            .setDescription(`**__WristSpasm Application__**\n\nWelcome to WristSpasm! If you are looking to apply, read the info below to make sure you meet our requirements! Please read through this carefully before proceeding to apply\n`)
            .setThumbnail('https://imgur.com/fNByP9j.png')
            .setDescription(`**__WristSpasm Requirements__**\n\n**General Requirements**\n・Hypixel Level 75\n・Basic Understanding of** English**\n・Earn at least **50k** weekly Guild experience (Important)\n・Be active in guild chat\n\n**Game Requirements**\n<:bedwars:1011934347470848031> **Bedwars**\n・200 Stars or 100 Stars and 2 FKDR\n<:skywars:1011934350016794625> **SkyWars**\n・15 Stars or 10 Stars and 2 KDR\n<:duels:1011934354521456682> **Duels**\n・2,500 Wins or 1,500 Wins and 2 WLR\n<:skyblock:1011934351820337173> **Skyblock**\n・2,500 Senither Weight\n`)
            .setDescription(`**__WARNING__**\n**Anyone that opens a ticket for no reason, will be punished.**\nMake sure you have read the requirements carefully before proceeding\n\n**CLICK THE BUTTON IN THE MESSAGE BELOW TO APPLY**`)

        const applyButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('guild.apply_button')
                .setLabel('Apply')
                .setStyle(ButtonStyle.Success),
            );

        await client.channels.cache.get('1011928466955980870').send({ embeds: [Embed], components: [applyButton] })*/
  
    },
  };


