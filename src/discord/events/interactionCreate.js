const {
  // eslint-disable-next-line no-unused-vars
  CommandInteraction,
  ActionRowBuilder,
  TextInputBuilder,
  InteractionType,
  TextInputStyle,
  ButtonBuilder,
  EmbedBuilder,
  ModalBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { ErrorEmbed, Embed, SuccessEmbed } = require("../../contracts/embedHandler.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { getUsername } = require("../../contracts/API/mowojangAPI.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const { writeAt } = require("../../contracts/helperFunctions.js");
const config = require("../../../config.json");
const Logger = require("../.././Logger.js");
const fs = require("fs");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (command === undefined) {
          return;
        }

        if (command.defer === true) {
          if (command.ephemeral === true) {
            await interaction.deferReply({ ephemeral: true });
          } else {
            await interaction.deferReply({ ephemeral: false });
          }
        }

        if (command.moderatorOnly === true && isModerator(interaction) === false) {
          throw new WristSpasmError("You don't have permission to use this command.");
        }

        if (command.requiresBot === true && isBotOnline() === false) {
          throw new WristSpasmError("Bot doesn't seem to be connected to Hypixel. Please try again.");
        }

        Logger.discordMessage(`${interaction.user.username} - [${interaction.commandName}]`);
        await command.execute(interaction);
      }

      const editMessageButton = new ButtonBuilder()
        .setLabel("Edit Message")
        .setCustomId("e.e.m")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("<:icons_edit:1249307514680512512>");
      const addEmbedButton = new ButtonBuilder()
        .setLabel("Add Embed")
        .setCustomId("e.a.e")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("<:icons_createchannels:1249307311143653407>");
      const editEmbedButton = new ButtonBuilder()
        .setLabel("Edit Embed")
        .setCustomId("e.e.e")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("<:icons_edit:1249307514680512512>");
      const deleteEmbedButton = new ButtonBuilder()
        .setLabel("Delete Embed")
        .setCustomId("e.d.e")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("<:icons_busy:1249309744259268620>");
      const importJsonButton = new ButtonBuilder()
        .setLabel("Import JSON")
        .setCustomId("e.j.i")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("<:icons_Download:1249306613727367198>");
      const exportJsonButton = new ButtonBuilder()
        .setLabel("Export JSON")
        .setCustomId("e.j.e")
        .setStyle(ButtonStyle.Secondary);
      const resetButton = new ButtonBuilder()
        .setLabel("Reset")
        .setCustomId("e.reset")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("<:icons_delete:1249309581490786372>");
      const sendButton = new ButtonBuilder()
        .setLabel("Send")
        .setCustomId("e.send")
        .setStyle(ButtonStyle.Success)
        .setEmoji("<:icons_Correct:1249308284075376641>");
      const quitButton = new ButtonBuilder()
        .setLabel("Quit")
        .setCustomId("e.quit")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("<:icons_Wrong:1249307619739570218>");
      const homeButton = new ButtonBuilder()
        .setLabel("Home")
        .setCustomId("e.home")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("<:icons_bank:1249665226245279764>");

      if (interaction.isButton()) {
        if (!interaction.customId.startsWith("e.")) {
          await interaction.deferReply({ ephemeral: true });
        }

        // ? Apply Button
        if (interaction.customId.includes("guild.apply_button")) {
          const applyCommand = interaction.client.commands.get("apply");

          if (applyCommand === undefined) {
            throw new WristSpasmError("Could not find apply command! Please contact an administrator.");
          }

          await applyCommand.execute(interaction);
        } else if (interaction.customId.startsWith("t.c.")) {
          const ticketCloseCommand = interaction.client.commands.get("close-ticket");
          if (ticketCloseCommand === undefined) {
            throw new WristSpasmError("Could not find close-ticket command! Please contact an administrator.");
          }
          await ticketCloseCommand.execute(interaction);
        } else if (interaction.customId.startsWith("t.o.")) {
          const ticketOpenCommand = interaction.client.commands.get("open-ticket");
          if (ticketOpenCommand === undefined) {
            throw new WristSpasmError("Could not find open-ticket command! Please contact an administrator.");
          }
          if (interaction.customId.startsWith("t.o.g.")) {
            await ticketOpenCommand.execute(interaction, null, interaction.customId.split("t.o.g.")[1]);
          } else {
            await ticketOpenCommand.execute(interaction, interaction.customId.split("t.o.")[1]);
          }
        } else if (interaction.customId.startsWith("g.e.")) {
          const giveawayData = JSON.parse(fs.readFileSync("data/giveaways.json", "utf-8"));
          if (giveawayData.find((x) => x.id === interaction.customId.split("g.e.")[1])) {
            const giveaway = giveawayData.find((x) => x.id === interaction.customId.split("g.e.")[1]);
            if (giveaway.host === interaction.user.id) {
              return await interaction.followUp({ content: "You cannot enter your own giveaway.", emphemeral: true });
            }
            const userIndex = giveaway.users.findIndex((user) => user.id === interaction.user.id);
            if (userIndex !== -1) {
              const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setLabel("Leave Giveaway")
                  .setCustomId(`g.l.${giveaway.id}`)
                  .setStyle(ButtonStyle.Danger),
              );

              return await interaction.followUp({
                content: "You have already entered the giveaway.",
                components: [row],
                ephemeral: true,
              });
            }

            if (giveaway.guildOnly === true && !isGuildMember(interaction)) {
              return await interaction.editReply({ content: "This giveaway is for guild members only." });
            }

            if (giveaway.verifiedOnly === true && !isVerified(interaction)) {
              return await interaction.editReply({ content: "This giveaway is for verified members only." });
            }

            giveaway.users.push({ id: interaction.user.id, winner: false, claimed: false });
            const giveawayEmbed = new EmbedBuilder()
              .setColor(3447003)
              .setTitle("Giveaway")
              .addFields(
                {
                  name: "Prize",
                  value: `${giveaway.prize}`,
                  inline: true,
                },
                {
                  name: "Host",
                  value: `<@${giveaway.host}>`,
                  inline: true,
                },
                {
                  name: "Entries",
                  value: `${giveaway.users.length}`,
                  inline: true,
                },
                {
                  name: "Winners",
                  value: `${giveaway.winners}`,
                },
                {
                  name: "Ends At",
                  value: `<t:${giveaway.endTimestamp}:f> (<t:${giveaway.endTimestamp}:R>)`,
                },
              )
              .setFooter({
                text: `by @kathund. | /help [command] for more information`,
                iconURL: "https://i.imgur.com/uUuZx2E.png",
              });
            const message = await interaction.guild.channels.cache.get(giveaway.channel).messages.fetch(giveaway.id);
            await message.edit({ embeds: [giveawayEmbed] });
            fs.writeFileSync("data/giveaways.json", JSON.stringify(giveawayData, null, 2));
            return await interaction.editReply({ content: "You have successfully entered the giveaway." });
          }
        } else if (interaction.customId.startsWith("g.l.")) {
          const giveawayData = JSON.parse(fs.readFileSync("data/giveaways.json", "utf-8"));
          const giveawayId = interaction.customId.split("g.l.")[1];
          if (giveawayData.find((x) => x.id === giveawayId)) {
            const giveaway = giveawayData.find((x) => x.id === giveawayId);
            const userIndex = giveaway.users.findIndex((user) => user.id === interaction.user.id);
            if (userIndex === -1) {
              return await interaction.editReply({ content: "You are not in the giveaway." });
            }
            giveaway.users.splice(userIndex, 1);
            const giveawayEmbed = new EmbedBuilder()
              .setColor(3447003)
              .setTitle("Giveaway")
              .addFields(
                {
                  name: "Prize",
                  value: `${giveaway.prize}`,
                  inline: true,
                },
                {
                  name: "Host",
                  value: `<@${giveaway.host}>`,
                  inline: true,
                },
                {
                  name: "Entries",
                  value: `${giveaway.users.length}`,
                  inline: true,
                },
                {
                  name: "Winners",
                  value: `${giveaway.winners}`,
                },
                {
                  name: "Ends At",
                  value: `<t:${giveaway.endTimestamp}:f> (<t:${giveaway.endTimestamp}:R>)`,
                },
              )
              .setFooter({
                text: `by @kathund. | /help [command] for more information`,
                iconURL: "https://i.imgur.com/uUuZx2E.png",
              });
            const message = await interaction.guild.channels.cache.get(giveaway.channel).messages.fetch(giveaway.id);
            await message.edit({ embeds: [giveawayEmbed] });
            fs.writeFileSync("data/giveaways.json", JSON.stringify(giveawayData, null, 2));
            return await interaction.editReply({ content: "You have successfully left the giveaway." });
          }
        }

        if (interaction.customId.startsWith("e.")) {
          const embedBuilderCase = interaction.customId.substring(2);
          if (embedBuilderCase.startsWith("em")) {
            const embedColorButton = new ButtonBuilder()
              .setLabel("Color")
              .setCustomId(`e.em.color.${embedBuilderCase.split("em.select.")[1]}`)
              .setStyle(ButtonStyle.Primary);
            const embedDescriptionButton = new ButtonBuilder()
              .setLabel("Description")
              .setCustomId(`e.em.description.${embedBuilderCase.split("em.select.")[1]}`)
              .setStyle(ButtonStyle.Primary);
            const embedEditFieldsButton = new ButtonBuilder()
              .setLabel("Edit Fields")
              .setCustomId(`e.em.editFields.${embedBuilderCase.split("em.select.")[1]}`)
              .setStyle(ButtonStyle.Primary);
            const embedFooterImageButton = new ButtonBuilder()
              .setLabel("Footer Image")
              .setCustomId(`e.em.footerImage.${embedBuilderCase.split("em.select.")[1]}`)
              .setStyle(ButtonStyle.Primary);
            const embedFooterButton = new ButtonBuilder()
              .setLabel("Footer")
              .setCustomId(`e.em.footer.${embedBuilderCase.split("em.select.")[1]}`)
              .setStyle(ButtonStyle.Primary);
            const embedImageButton = new ButtonBuilder()
              .setLabel("Image")
              .setCustomId(`e.em.image.${embedBuilderCase.split("em.select.")[1]}`)
              .setStyle(ButtonStyle.Primary);
            const embedThumbnailButton = new ButtonBuilder()
              .setLabel("Thumbnail")
              .setCustomId(`e.em.thumbnail.${embedBuilderCase.split("em.select.")[1]}`)
              .setStyle(ButtonStyle.Primary);
            const embedTitleButton = new ButtonBuilder()
              .setLabel("Title")
              .setCustomId(`e.em.title.${embedBuilderCase.split("em.select.")[1]}`)
              .setStyle(ButtonStyle.Primary);
            if (embedBuilderCase.startsWith("em.select")) {
              await interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    embedColorButton,
                    embedDescriptionButton,
                    embedEditFieldsButton,
                    embedFooterImageButton,
                    embedFooterButton,
                  ),
                  new ActionRowBuilder().addComponents(
                    embedImageButton,
                    embedThumbnailButton,
                    embedTitleButton,
                    homeButton,
                    quitButton,
                  ),
                ],
              });
            }
            if (embedBuilderCase.startsWith("em.color")) {
              const embedIndex = embedBuilderCase.split("em.color.")[1];
              await interaction.showModal(
                new ModalBuilder()
                  .setCustomId(`e.e.em.color.${embedIndex}`)
                  .setTitle("Edit Color")
                  .addComponents(
                    new ActionRowBuilder().addComponents(
                      new TextInputBuilder()
                        .setCustomId("color")
                        .setLabel("color")
                        .setPlaceholder("input color")
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short),
                    ),
                  ),
              );
            } else if (embedBuilderCase.startsWith("em.description")) {
              const embedIndex = embedBuilderCase.split("em.description.")[1];
              await interaction.showModal(
                new ModalBuilder()
                  .setCustomId(`e.e.em.description.${embedIndex}`)
                  .setTitle("Edit description")
                  .addComponents(
                    new ActionRowBuilder().addComponents(
                      new TextInputBuilder()
                        .setCustomId("description")
                        .setLabel("description")
                        .setPlaceholder("description")
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph),
                    ),
                  ),
              );
            } else if (embedBuilderCase.startsWith("em.image")) {
              const embedIndex = embedBuilderCase.split("em.image.")[1];
              await interaction.showModal(
                new ModalBuilder()
                  .setCustomId(`e.e.em.image.${embedIndex}`)
                  .setTitle("Edit image")
                  .addComponents(
                    new ActionRowBuilder().addComponents(
                      new TextInputBuilder()
                        .setCustomId("image")
                        .setLabel("image")
                        .setPlaceholder("image")
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short),
                    ),
                  ),
              );
            } else if (embedBuilderCase.startsWith("em.thumbnail")) {
              const embedIndex = embedBuilderCase.split("em.thumbnail.")[1];
              await interaction.showModal(
                new ModalBuilder()
                  .setCustomId(`e.e.em.thumbnail.${embedIndex}`)
                  .setTitle("Edit thumbnail")
                  .addComponents(
                    new ActionRowBuilder().addComponents(
                      new TextInputBuilder()
                        .setCustomId("thumbnail")
                        .setLabel("thumbnail")
                        .setPlaceholder("thumbnail")
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short),
                    ),
                  ),
              );
            } else if (embedBuilderCase.startsWith("em.title")) {
              const embedIndex = embedBuilderCase.split("em.title.")[1];
              await interaction.showModal(
                new ModalBuilder()
                  .setCustomId(`e.e.em.title.${embedIndex}`)
                  .setTitle("Edit title")
                  .addComponents(
                    new ActionRowBuilder().addComponents(
                      new TextInputBuilder()
                        .setCustomId("title")
                        .setLabel("title")
                        .setPlaceholder("input title")
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short),
                    ),
                  ),
              );
            }
          } else if (embedBuilderCase.startsWith("ed")) {
            const embedIndex = embedBuilderCase.split("ed.select.")[1];
            const embeds = interaction.message.embeds;
            embeds.filter((embed, index) => index !== embedIndex);
            await interaction.update({ embeds: embeds });
          } else {
            switch (embedBuilderCase) {
              case "e.m": {
                await interaction.showModal(
                  new ModalBuilder()
                    .setCustomId("e.e.m")
                    .setTitle("Edit Message")
                    .addComponents(
                      new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                          .setCustomId("editMessage")
                          .setLabel("edit message")
                          .setPlaceholder("new message?")
                          .setRequired(false)
                          .setStyle(TextInputStyle.Paragraph),
                      ),
                    ),
                );
                break;
              }
              case "a.e": {
                if (interaction.message.embeds.length >= 9) {
                  await interaction.update({
                    components: [
                      new ActionRowBuilder().addComponents(editMessageButton),
                      new ActionRowBuilder().addComponents(
                        addEmbedButton.setDisabled(true),
                        editEmbedButton,
                        deleteEmbedButton,
                      ),
                      new ActionRowBuilder().addComponents(importJsonButton, exportJsonButton),
                      new ActionRowBuilder().addComponents(resetButton, sendButton, quitButton),
                    ],
                    embeds: [...interaction.message.embeds, new EmbedBuilder().setDescription("New Embed")],
                  });
                  await interaction.followUp({ content: "Max Embeds", ephemeral: true });
                } else {
                  await interaction.update({
                    components: [
                      new ActionRowBuilder().addComponents(editMessageButton),
                      new ActionRowBuilder().addComponents(addEmbedButton, editEmbedButton, deleteEmbedButton),
                      new ActionRowBuilder().addComponents(importJsonButton, exportJsonButton),
                      new ActionRowBuilder().addComponents(resetButton, sendButton, quitButton),
                    ],
                    embeds: [...interaction.message.embeds, new EmbedBuilder().setDescription("New Embed")],
                  });
                }
                break;
              }
              case "e.e": {
                const buttons = [];
                const buttons2 = [];
                interaction.message.embeds.forEach((embed) => {
                  if (buttons.length >= 5) {
                    buttons2.push({
                      custom_id: `e.em.select.${interaction.message.embeds.indexOf(embed)}`,
                      label: `Embed: ${interaction.message.embeds.indexOf(embed) + 1}`,
                      style: ButtonStyle.Primary,
                      type: ComponentType.Button,
                    });
                  } else {
                    buttons.push({
                      custom_id: `e.em.select.${interaction.message.embeds.indexOf(embed)}`,
                      label: `Embed: ${interaction.message.embeds.indexOf(embed) + 1}`,
                      style: ButtonStyle.Primary,
                      type: ComponentType.Button,
                    });
                  }
                });
                const components = [];
                if (buttons.length !== 0) {
                  components.push(new ActionRowBuilder({ components: buttons }));
                }
                if (buttons2.length !== 0) {
                  components.push(new ActionRowBuilder({ components: buttons2 }));
                }
                components.push(new ActionRowBuilder().addComponents(homeButton, quitButton));
                await interaction.update({
                  components: components,
                });
                break;
              }
              case "d.e": {
                const buttons = [];
                const buttons2 = [];
                interaction.message.embeds.forEach((embed) => {
                  if (buttons.length >= 5) {
                    buttons2.push({
                      custom_id: `e.ed.select.${interaction.message.embeds.indexOf(embed)}`,
                      label: `Embed: ${interaction.message.embeds.indexOf(embed) + 1}`,
                      style: ButtonStyle.Primary,
                      type: ComponentType.Button,
                    });
                  } else {
                    buttons.push({
                      custom_id: `e.ed.select.${interaction.message.embeds.indexOf(embed)}`,
                      label: `Embed: ${interaction.message.embeds.indexOf(embed) + 1}`,
                      style: ButtonStyle.Primary,
                      type: ComponentType.Button,
                    });
                  }
                });
                const components = [];
                if (buttons.length !== 0) {
                  components.push(new ActionRowBuilder({ components: buttons }));
                }
                if (buttons2.length !== 0) {
                  components.push(new ActionRowBuilder({ components: buttons2 }));
                }
                components.push(new ActionRowBuilder().addComponents(homeButton, quitButton));
                await interaction.update({
                  components: components,
                });
                break;
              }
              case "j.i": {
                await interaction.showModal(
                  new ModalBuilder()
                    .setCustomId("e.j.i")
                    .setTitle("Import JSON")
                    .addComponents(
                      new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                          .setCustomId("importJson")
                          .setLabel("import json")
                          .setPlaceholder("json text")
                          .setRequired(true)
                          .setStyle(TextInputStyle.Paragraph),
                      ),
                    ),
                );
                break;
              }
              case "j.e": {
                const embedJSONData = { content: null, embeds: [] };
                embedJSONData.content = interaction.message.content;
                embedJSONData.embeds = interaction.message.embeds;
                fs.writeFileSync("data/embed.json", JSON.stringify(embedJSONData, null, 2));
                await interaction.reply({ content: "Embed JSON", ephemeral: true, files: ["data/embed.json"] });
                fs.unlinkSync("data/embed.json");
                break;
              }
              case "reset": {
                await interaction.update({
                  content: "Embed Builder",
                  embeds: [],
                  components: [
                    new ActionRowBuilder().addComponents(editMessageButton),
                    new ActionRowBuilder().addComponents(
                      addEmbedButton,
                      editEmbedButton.setDisabled(true),
                      deleteEmbedButton.setDisabled(true),
                    ),
                    new ActionRowBuilder().addComponents(importJsonButton, exportJsonButton),
                    new ActionRowBuilder().addComponents(resetButton, sendButton, quitButton),
                  ],
                });
                break;
              }
              case "send": {
                await interaction.update({
                  components: [
                    new ActionRowBuilder().addComponents(editMessageButton.setDisabled(true)),
                    new ActionRowBuilder().addComponents(
                      addEmbedButton.setDisabled(true),
                      editEmbedButton.setDisabled(true),
                      deleteEmbedButton.setDisabled(true),
                    ),
                    new ActionRowBuilder().addComponents(
                      importJsonButton.setDisabled(true),
                      exportJsonButton.setDisabled(true),
                    ),
                    new ActionRowBuilder().addComponents(
                      resetButton.setDisabled(true),
                      sendButton.setDisabled(true),
                      quitButton.setDisabled(true),
                    ),
                  ],
                });
                await interaction.channel.send({
                  content: interaction.message.content,
                  embeds: interaction.message.embeds,
                });
                break;
              }
              case "quit": {
                await interaction.update({
                  components: [
                    new ActionRowBuilder().addComponents(editMessageButton.setDisabled(true)),
                    new ActionRowBuilder().addComponents(
                      addEmbedButton.setDisabled(true),
                      editEmbedButton.setDisabled(true),
                      deleteEmbedButton.setDisabled(true),
                    ),
                    new ActionRowBuilder().addComponents(
                      importJsonButton.setDisabled(true),
                      exportJsonButton.setDisabled(true),
                    ),
                    new ActionRowBuilder().addComponents(
                      resetButton.setDisabled(true),
                      sendButton.setDisabled(true),
                      quitButton.setDisabled(true),
                    ),
                  ],
                });
                break;
              }
              case "home": {
                await interaction.update({
                  components: [
                    new ActionRowBuilder().addComponents(editMessageButton),
                    new ActionRowBuilder().addComponents(addEmbedButton, editEmbedButton, deleteEmbedButton),
                    new ActionRowBuilder().addComponents(importJsonButton, exportJsonButton),
                    new ActionRowBuilder().addComponents(resetButton, sendButton, quitButton),
                  ],
                });
                break;
              }
            }
          }
        }
      }

      // ? Inactivity Form
      if (interaction.type === InteractionType.ModalSubmit) {
        if (interaction.customId === "inactivityform") {
          const time = interaction.fields.getTextInputValue("inactivitytime");
          const reason = interaction.fields.getTextInputValue("inactivityreason") || "None";

          const linked = JSON.parse(fs.readFileSync("data/discordLinked.json", "utf8"));
          if (linked === undefined) {
            throw new WristSpasmError("No verification data found. Please contact an administrator.");
          }

          const uuid = linked[interaction.user.id];
          if (uuid === undefined) {
            throw new WristSpasmError("You are no verified. Please verify using /verify.");
          }

          const [guild, username] = await Promise.all([
            hypixelRebornAPI.getGuild("name", "WristSpasm"),
            getUsername(linked[interaction.user.id]),
          ]);

          if (guild === undefined) {
            throw new WristSpasmError("Guild data not found. Please contact an administrator.");
          }

          if (isNaN(time) || time < 1) {
            throw new WristSpasmError("Please enter a valid number.");
          }

          const formattedTime = time * 86400;
          if (formattedTime > 21 * 86400) {
            throw new WristSpasmError(
              "You can only request inactivity for 21 days or less. Please contact an administrator if you need more time.",
            );
          }

          const expiration = (new Date().getTime() / 1000 + formattedTime).toFixed(0);
          const date = (new Date().getTime() / 1000).toFixed(0);
          const inactivityEmbed = new Embed(
            5763719,
            "Inactivity Request",
            `\`Username:\` ${username}\n\`Requested:\` <t:${date}>\n\`Expiration:\` <t:${expiration}:R>\n\`Reason:\` ${reason}`,
          );
          inactivityEmbed.setThumbnail(`https://www.mc-heads.net/avatar/${username}`);

          const channel = interaction.client.channels.cache.get(config.discord.channels.inactivity);
          if (channel === undefined) {
            throw new WristSpasmError("Inactivity channel not found. Please contact an administrator.");
          }

          await channel.send({ embeds: [inactivityEmbed] });

          writeAt("data/inactivity.json", uuid, {
            username: username,
            uuid: uuid,
            discord: interaction.user.tag,
            discord_id: interaction.user.id,
            requested: (new Date().getTime() / 1000).toFixed(0),
            requested_formatted: new Date().toLocaleString(),
            expiration: expiration,
            expiration_formatted: new Date(expiration * 1000).toLocaleString(),
            reason: reason,
          });

          const inactivityResponse = new SuccessEmbed(
            `Inactivity request has been successfully sent to the guild staff.`,
          );

          await interaction.reply({ embeds: [inactivityResponse], ephemeral: true });
        } else if (interaction.customId === "e.e.m") {
          const msg = interaction.fields.getTextInputValue("editMessage") || "";
          await interaction.update({ content: `${msg}` });
        } else if (interaction.customId === "e.j.i") {
          const jsonData = JSON.parse(interaction.fields.getTextInputValue("importJson"));
          if (jsonData.content == null) {
            return await interaction.reply({ content: "Invalid Json | Content Dosent Exist", ephemeral: true });
          }
          if (jsonData.embeds == null) {
            return await interaction.reply({ content: "Invalid Json | Embeds dosent exist", ephemeral: true });
          }
          if (typeof jsonData.content !== "string") {
            return await interaction.reply({ content: "Invalid Json | Content must be a string", ephemeral: true });
          }
          if (!Array.isArray(jsonData.embeds)) {
            return await interaction.reply({ content: "Invalid Json | Embeds must be an array", ephemeral: true });
          }
          const embeds = jsonData.embeds.map((embed) => new EmbedBuilder(embed));
          if (embeds.length === 0) {
            editEmbedButton.setDisabled(true);
            deleteEmbedButton.setDisabled(true);
          }
          if (embeds.length > 9) {
            addEmbedButton.setDisabled(true);
          }
          await interaction.update({
            content: jsonData.content,
            embeds: embeds,
            components: [
              new ActionRowBuilder().addComponents(editMessageButton),
              new ActionRowBuilder().addComponents(addEmbedButton, editEmbedButton, deleteEmbedButton),
              new ActionRowBuilder().addComponents(importJsonButton, exportJsonButton),
              new ActionRowBuilder().addComponents(resetButton, sendButton, quitButton),
            ],
          });
        } else if (interaction.customId.startsWith("e.e.em.")) {
          const item = interaction.customId.split("e.e.em.")[1].split(".")[0];
          const embedIndex = interaction.customId.split("e.e.em.")[1].split(".")[1];
          const data = interaction.fields.getTextInputValue(item);
          const embeds = interaction.message.embeds;
          if (item === "color") {
            embeds[embedIndex] = new EmbedBuilder(embeds[embedIndex]).setColor(data);
          } else if (item === "image") {
            embeds[embedIndex] = new EmbedBuilder(embeds[embedIndex]).setImage(data);
          } else if (item === "thumbnail") {
            embeds[embedIndex] = new EmbedBuilder(embeds[embedIndex]).setThumbnail(data);
          } else {
            embeds[embedIndex].data[item] = data;
          }
          await interaction.update({ embeds: embeds });
        }
      }
    } catch (error) {
      console.log(error);

      const errrorMessage =
        error instanceof WristSpasmError
          ? ""
          : "Please try again later. The error has been sent to the Developers.\n\n";

      const errorEmbed = new ErrorEmbed(`${errrorMessage}\`\`\`${error}\`\`\``);

      await interaction.editReply({ embeds: [errorEmbed] });

      if (error instanceof WristSpasmError === false) {
        const username = interaction.user.username ?? interaction.user.tag ?? "Unknown";
        const commandOptions = JSON.stringify(interaction.options.data) ?? "Unknown";
        const commandName = interaction.commandName ?? "Unknown";
        const errorStack = error.stack ?? error ?? "Unknown";
        const userID = interaction.user.id ?? "Unknown";

        const errorLog = new ErrorEmbed(
          `Command: \`${commandName}\`\nOptions: \`${commandOptions}\`\nUser ID: \`${userID}\`\nUser: \`${username}\`\n\`\`\`${errorStack}\`\`\``,
        );
        interaction.client.channels.cache.get(config.discord.channels.loggingChannel).send({
          content: `<@&987936050649391194> <@1169174913832202306>`,
          embeds: [errorLog],
        });
      }
    }
  },
};

function isBotOnline() {
  if (bot === undefined && bot._client.chat === undefined) {
    return;
  }

  return true;
}

function isModerator(interaction) {
  const user = interaction.member;
  const userRoles = user.roles.cache.map((role) => role.id);

  if (
    config.discord.commands.checkPerms === true &&
    !(userRoles.includes(config.discord.commands.commandRole) || config.discord.commands.users.includes(user.id))
  ) {
    return false;
  }

  return true;
}
function isGuildMember(interaction) {
  const user = interaction.member;
  const userRoles = user.roles.cache.map((role) => role.id);

  if (!(userRoles.includes(config.discord.roles.guildMemberRole) || config.discord.commands.users.includes(user.id))) {
    return false;
  }

  return true;
}
function isVerified(interaction) {
  const user = interaction.member;
  const userRoles = user.roles.cache.map((role) => role.id);

  if (!(userRoles.includes(config.discord.roles.linkedRole) || config.discord.commands.users.includes(user.id))) {
    return false;
  }

  return true;
}
