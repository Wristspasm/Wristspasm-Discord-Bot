const { EmbedBuilder /*, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle*/ } = require("discord.js");
const WristSpasmError = require("../../contracts/errorHandler.js");

module.exports = {
  name: "embed",
  description: "test",

  execute: async (interaction) => {
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      throw new WristSpasmError(
        "You do not have permission to use this command. You need the `ADMINISTRATOR` permission."
      );
    }

    /*
      // ? #rules
      const rulesEmbed = new EmbedBuilder()
        .setThumbnail("https://imgur.com/fNByP9j.png")
        .setColor(0x0099ff)
        .setDescription(
          `**WristSpasm Guild Rules**\n\n**Rule #1: Rudeness/Slurs**\nThis rule includes making rude comments to another user. This can range from calling someone names to being racist. Rudeness in any form is not accepted and you will be punished.\n\n**Rule #2: Spamming**\nSpamming similar messages continuously is not allowed. A message should only be sent once and limit the amount of messages you send during a conversation. You do not need 5 different messages for each word of a sentence. Please use the designated <#907487880061014047> channel provided for those messages.\n\n**Rule #3: Bot Commands**\nThis rule means that you should not post commands that a bot replies to in public chats. Please use the designated <#600325477537939476> channel provided for those commands.\n\n**Rule #4: Inappropriate Behaviour**\nBehaving in an inappropriate manner. This can include drug use references, sexual content or any childish remarks. Violent remarks are also not allowed, especially if it is a threat to another user.\n\n**Rule #5: Media**\nThis rule entails the posting of media in the discord. All media (either images or videos) should be posted in our designated <#725727134190141490> channel. Under no circumstance will posting NSFW content be allowed.\n\n**Rule #6: Threats**\nNo threats will be tolerated in the WristSpasm guild discord or guild chat. We take this very seriously and will not hesitate to punish anyone who proceeds to do this. Threats include: DDos, Dox or violent threats. We will ban for any negative threats though.\n\n**Rule #7: Posting Dangerous Links**\nPosting links that will steal personal information from another user or installs malware onto their device is not permitted. You will receive serious punishment if caught.\n\n**Rule #8: Disruption of the guild**\nAttempting to find loopholes to break the rules for example creating alternative accounts to evade a punishment is not allowed. We will update rules so that any attempted loophole does not happen again.\n\n**Rule #9: Advertising**\nTrying to promote other discords is not allowed. This is to protect everyone's privacy and data. Please stick to advertising your social medias in the <#601572483380019200>\n`
        );

      await interaction.client.channels.cache.get("1003356938546983043").send({ embeds: [rulesEmbed] });

      // ? #information
      const welcomeEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setThumbnail("https://imgur.com/fNByP9j.png")
        .setDescription(
          `**Welcome to WristSpasm**\nHypixel Guild, WristSpasm, is a friendly and active guild that was created on September 3rd, 2018, for a group of friends. With time, the guild has grown and is now ranked #59 on the overall guild leaderboard. In addition to our friendly and active community, we also have a custom guild bot with many Quality of Life commands to enhance the guild experience for our members.`
        );

      const applyEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setDescription(
          `**Thinking of applying?**\nGreat! We love to see new people in our guild. If you think you have what it takes to join us, then create a request to apply. It only few seconds!\n\nBefore you apply, make sure that you have read and made sure that you meet our requirements. You will be instantly denied if you do not meet them. Check the requirements out at <#1072874886005014568>\n\n[**CLICK HERE TO APPLY**](<#1072874886005014568>)`
        );

      const rolesEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setDescription(
          `**Our Guild Roles**\nIn WristSpasm, we have lots of roles that members can obtain as recognition for their hard work.\n\n**Discord Roles**\n<@&1003353024720277504> - Verified rank\n<@&1085930785464389653> - Elite rank\n<@&695343999783010417> - Discord Server Booster\n\n**Guild Roles**\n<@&600311804979183618> - Guild Master\n<@&1072872961750597703> - Wrist Spasm Discord Bot\n<@&633073051784708099> - Administrator\n<@&987936050649391194> - Developer\n<@&700177102925987850> - Moderator\n<@&700177445957140521> - Trial-Moderator\n<@&600313217603993617> - Guild Member\n<@&903248083176001597> - OG Guild Member\n`
        );

      const reqsEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setDescription(
          `**__WristSpasm Application__**\n\nWelcome to WristSpasm! If you are looking to apply, read the info below to make sure you meet our requirements! Please read through this carefully before proceeding to apply\n`
        )
        .setThumbnail("https://imgur.com/fNByP9j.png")
        .setDescription(
          `**__WristSpasm Requirements__**\n\n**General Requirements**\n・Basic understanding of **English**\n・Earn at least **50k** weekly Guild experience (**Important**)\n・Be active in guild chat\n\n**Base Requirements**\n<:bedwars:1011934347470848031> **Bedwars**\n・Level 100 \n<:skyblock:1011934351820337173> **Skyblock**\n・SkyBlock Level 80\n\n**Elite Requirements**\n<:bedwars:1011934347470848031> **Bedwars**\n・Level 400 \n<:skyblock:1011934351820337173> **Skyblock**\n・SkyBlock Level 200\n`
        );

      await interaction.client.channels.cache
        .get("1072874842690424907")
        .send({ embeds: [welcomeEmbed, applyEmbed, rolesEmbed, reqsEmbed] });

      // ? #apply-here
      const gReqs = new EmbedBuilder()
        .setColor(0x0099ff)
        .setDescription(
          `**__WristSpasm Application__**\n\nWelcome to WristSpasm! If you are looking to apply, read the info below to make sure you meet our requirements! Please read through this carefully before proceeding to apply\n`
        )
        .setThumbnail("https://imgur.com/fNByP9j.png")
        .setDescription(
          `**__WristSpasm Requirements__**\n\n**General Requirements**\n・Basic understanding of **English**\n・Earn at least **50k** weekly Guild experience (**Important**)\n・Be active in guild chat\n\n**Game Requirements**\n<:bedwars:1011934347470848031> **Bedwars**\n・100 Stars \n<:skyblock:1011934351820337173> **Skyblock**\n・SkyBlock Level 80\n`
        );

      const applyE = new EmbedBuilder()
        .setColor(0x0099ff)
        .setDescription(
          `**__WristSpasm Application__**\n\nWelcome to WristSpasm! If you are looking to apply, read the info below to make sure you meet our requirements! Please read through this carefully before proceeding to apply\n`
        )
        .setDescription(
          `**__WARNING__**\nMake sure you have read the requirements carefully before proceeding.\n\n**CLICK THE BUTTON BELOW TO APPLY**`
        );

      const applyButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("guild.apply_button").setLabel("Apply").setStyle(ButtonStyle.Success)
      );
      */

    const guildBotInformationMain = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("<:hypixel:1099643612209348718> Wrist Spasm Guild Bot Information")
      .setDescription(
        `This powerful bot is built upon the foundation of the [Hypixel Discord Chat Bridge](https://github.com/DuckySoLucky/hypixel-discord-chat-bridge) and is tailored specifically for the WristSpasm Guild. It serves as a two-way chat bridge between Hypixel guild chat and Discord, ensuring seamless communication between the two platforms.`
      )
      .setThumbnail("https://imgur.com/fNByP9j.png");

    const guildBotInformationEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Guild Bot Information")
      .setDescription(
        `<:minecraft:1136253283145613344> **Minecraft Commands**:\n- \`!bedwars [player]\`: View BedWars stats of a player.\n- \`!skywars [player]\`: View SkyWars stats of a player.\n- \`!slayer [player]\`: View Slayer stats of a player.\n- \`!skills [player]\`: View Skills of a player.\n- \`!level [player]\`: View Skyblock Level of a player.\n- \`!networth [player]\`: View Networth of a player.\n- ... and more! Use \`!help\` to see all available commands.\n\n<:discord:1136253305740341278> **Discord Commands**:\n- \`/online\`: View currently online members.\n- \`/info\`: View information regarding bot.\n- \`/roles\`: Sync your Discord account's roles with in game stats.\n- ... and more! Use \`/help\` to see all available commands.\n\n<:skyblock:1011934351820337173> **Skyblock Features**:\n- Render armor, equipment, pets, and other in-game items.\n- Receive notifications for Skyblock events and updates.\n- Various Quality of Life commands.\n- and more!\n\n:bell: **Event Notifier**:\nThe bot sends remindes before various Skyblock events.\n\n:star2: **Frag Bot**:\nThe bot includes a frag bot that allows you to run dungeons alone! Just party the bot and it will automatically accept your party invite and you can start the dungeon. The bot will leave the party after few seconds.`
      )
      .setFooter({
        text: "by @duckysolucky | /help [command] for more information",
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.client.channels.cache
      .get("1136244921716711555")
      .send({ embeds: [guildBotInformationMain, guildBotInformationEmbed] });
  },
};
