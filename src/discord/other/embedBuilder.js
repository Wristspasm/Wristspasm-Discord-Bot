const {
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ComponentType,
  ModalBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");

const buttons = {
  editMessage: new ButtonBuilder()
    .setLabel("Edit Message")
    .setCustomId("e.edit.message")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("<:icons_edit:1249307514680512512>"),
  addImage: new ButtonBuilder()
    .setLabel("Add Image")
    .setCustomId("e.add.img")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("<:icons_edit:1249307514680512512>"),
  deleteImage: new ButtonBuilder()
    .setLabel("Delete Image")
    .setCustomId("e.delete.img")
    .setStyle(ButtonStyle.Danger)
    .setEmoji("<:icons_busy:1249309744259268620>"),
  addEmbed: new ButtonBuilder()
    .setLabel("Add Embed")
    .setCustomId("e.add.embed")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("<:icons_createchannels:1249307311143653407>"),
  editEmbed: new ButtonBuilder()
    .setLabel("Edit Embed")
    .setCustomId("e.edit.embed")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("<:icons_edit:1249307514680512512>"),
  deleteEmbed: new ButtonBuilder()
    .setLabel("Delete Embed")
    .setCustomId("e.delete.embed")
    .setStyle(ButtonStyle.Danger)
    .setEmoji("<:icons_busy:1249309744259268620>"),
  importJson: new ButtonBuilder()
    .setLabel("Import JSON")
    .setCustomId("e.json.import")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("<:icons_Download:1249306613727367198>"),
  exportJson: new ButtonBuilder().setLabel("Export JSON").setCustomId("e.json.export").setStyle(ButtonStyle.Secondary),
  reset: new ButtonBuilder()
    .setLabel("Reset")
    .setCustomId("e.normal.reset")
    .setStyle(ButtonStyle.Danger)
    .setEmoji("<:icons_delete:1249309581490786372>"),
  send: new ButtonBuilder()
    .setLabel("Send")
    .setCustomId("e.normal.send")
    .setStyle(ButtonStyle.Success)
    .setEmoji("<:icons_Correct:1249308284075376641>"),
  home: new ButtonBuilder()
    .setLabel("Home")
    .setCustomId("e.normal.home")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("<:icons_bank:1249665226245279764>"),
};

async function handleEmbedButtonClick(interaction) {
  const action = interaction.customId.substring(2).split(".")[0];
  const subAction = interaction.customId.substring(2).split(".")[1];
  switch (action) {
    case "normal": {
      switch (subAction) {
        case "reset": {
          await interaction.update({
            content: "",
            embeds: [],
            components: [
              new ActionRowBuilder().addComponents(buttons.editMessage, buttons.addImage, buttons.deleteImage),
              new ActionRowBuilder().addComponents(
                buttons.addEmbed,
                buttons.editEmbed.setDisabled(true),
                buttons.deleteEmbed.setDisabled(true),
              ),
              new ActionRowBuilder().addComponents(buttons.importJson, buttons.exportJson),
              new ActionRowBuilder().addComponents(buttons.reset, buttons.send),
            ],
          });
          break;
        }
        case "send": {
          interaction.channel.send({ content: interaction.message.content, embeds: interaction.message.embeds });
          break;
        }
        case "home": {
          await interaction.update({
            components: [
              new ActionRowBuilder().addComponents(buttons.editMessage, buttons.addImage, buttons.deleteImage),
              new ActionRowBuilder().addComponents(buttons.addEmbed, buttons.editEmbed, buttons.deleteEmbed),
              new ActionRowBuilder().addComponents(buttons.importJson, buttons.exportJson),
              new ActionRowBuilder().addComponents(buttons.reset, buttons.send),
            ],
          });
          break;
        }
      }
      break;
    }
    case "json": {
      switch (subAction) {
        case "export": {
          const embedJSONData = { content: null, embeds: [] };
          embedJSONData.content = interaction.message.content;
          embedJSONData.embeds = interaction.message.embeds;
          fs.writeFileSync("data/embed.json", JSON.stringify(embedJSONData, null, 2));
          await interaction.reply({ content: "Embed JSON", ephemeral: true, files: ["data/embed.json"] });
          fs.unlinkSync("data/embed.json");
          break;
        }
        case "import": {
          await interaction.showModal(
            new ModalBuilder()
              .setCustomId("e.json.import")
              .setTitle("Import JSON")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("input")
                    .setLabel("import json")
                    .setPlaceholder("json text")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph),
                ),
              ),
          );
          break;
        }
      }
      break;
    }
    case "delete": {
      switch (subAction) {
        case "embed": {
          const embedButtons = [];
          const embedButtons2 = [];
          interaction.message.embeds.forEach((embed) => {
            if (embedButtons.length >= 5) {
              embedButtons2.push({
                custom_id: `e.embed.delete.${interaction.message.embeds.indexOf(embed)}`,
                label: `Embed: ${interaction.message.embeds.indexOf(embed) + 1}`,
                style: ButtonStyle.Primary,
                type: ComponentType.Button,
              });
            } else {
              embedButtons.push({
                custom_id: `e.embed.delete.${interaction.message.embeds.indexOf(embed)}`,
                label: `Embed: ${interaction.message.embeds.indexOf(embed) + 1}`,
                style: ButtonStyle.Primary,
                type: ComponentType.Button,
              });
            }
          });
          const components = [];
          if (embedButtons.length > 0) components.push(new ActionRowBuilder({ components: embedButtons }));
          if (embedButtons2.length > 0) components.push(new ActionRowBuilder({ components: embedButtons2 }));
          components.push(new ActionRowBuilder().addComponents(buttons.home));
          await interaction.update({ components });
          break;
        }
        case "img": {
          const imgButtons = [];
          const imgButtons2 = [];
          interaction.message.attachments.forEach((img) => {
            if (imgButtons.length >= 5) {
              imgButtons2.push({
                custom_id: `e.image.delete.${interaction.message.attachments.indexOf(img)}`,
                label: `Image: ${interaction.message.attachments.indexOf(img) + 1}`,
                style: ButtonStyle.Primary,
                type: ComponentType.Button,
              });
            } else {
              imgButtons.push({
                custom_id: `e.image.delete.${interaction.message.attachments.indexOf(img)}`,
                label: `Image: ${interaction.message.attachments.indexOf(img) + 1}`,
                style: ButtonStyle.Primary,
                type: ComponentType.Button,
              });
            }
          });
          const components = [];
          components.push(new ActionRowBuilder({ components: imgButtons }));
          components.push(new ActionRowBuilder({ components: imgButtons2 }));
          components.push(new ActionRowBuilder().addComponents(buttons.home));
          await interaction.update({ components });
          break;
        }
      }
      break;
    }
    case "edit": {
      switch (subAction) {
        case "embed": {
          const embedButtons = [];
          const embedButtons2 = [];
          interaction.message.embeds.forEach((embed) => {
            if (embedButtons.length >= 5) {
              embedButtons2.push({
                custom_id: `e.embed.select.${interaction.message.embeds.indexOf(embed)}`,
                label: `Embed: ${interaction.message.embeds.indexOf(embed) + 1}`,
                style: ButtonStyle.Primary,
                type: ComponentType.Button,
              });
            } else {
              embedButtons.push({
                custom_id: `e.embed.select.${interaction.message.embeds.indexOf(embed)}`,
                label: `Embed: ${interaction.message.embeds.indexOf(embed) + 1}`,
                style: ButtonStyle.Primary,
                type: ComponentType.Button,
              });
            }
          });
          const components = [];
          if (embedButtons.length > 0) components.push(new ActionRowBuilder({ components: embedButtons }));
          if (embedButtons2.length > 0) components.push(new ActionRowBuilder({ components: embedButtons2 }));
          components.push(new ActionRowBuilder().addComponents(buttons.home));
          await interaction.update({ components });
          break;
        }
        case "message": {
          await interaction.showModal(
            new ModalBuilder()
              .setCustomId("e.edit.message")
              .setTitle("Edit Message")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("input")
                    .setLabel("edit message")
                    .setPlaceholder("new message?")
                    .setRequired(false)
                    .setStyle(TextInputStyle.Paragraph),
                ),
              ),
          );
          break;
        }
      }
      break;
    }
    case "add": {
      switch (subAction) {
        case "embed": {
          await interaction.update({
            components: [
              new ActionRowBuilder().addComponents(buttons.editMessage, buttons.addImage, buttons.deleteImage),
              new ActionRowBuilder().addComponents(
                buttons.addEmbed,
                buttons.editEmbed.setDisabled(false),
                buttons.deleteEmbed.setDisabled(false),
              ),
              new ActionRowBuilder().addComponents(buttons.importJson, buttons.exportJson),
              new ActionRowBuilder().addComponents(buttons.reset, buttons.send),
            ],
            embeds: [...interaction.message.embeds, new EmbedBuilder().setDescription("New Embed")],
          });
          if (interaction.message.embeds.length >= 9) {
            await interaction.update({
              components: [
                new ActionRowBuilder().addComponents(buttons.editMessage, buttons.addImage, buttons.deleteImage),
                new ActionRowBuilder().addComponents(
                  buttons.addEmbed.setDisabled(true),
                  buttons.editEmbed,
                  buttons.deleteEmbed,
                ),
                new ActionRowBuilder().addComponents(buttons.importJson, buttons.exportJson),
                new ActionRowBuilder().addComponents(buttons.reset, buttons.send),
              ],
            });
            await interaction.followUp({ content: "Max Embeds", ephemeral: true });
          }
          break;
        }
        case "img": {
          await interaction.showModal(
            new ModalBuilder()
              .setCustomId("e.add.img")
              .setTitle("Add Image")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("input")
                    .setLabel("add img")
                    .setPlaceholder("img url?")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short),
                ),
              ),
          );
          break;
        }
      }
      break;
    }
    case "embed": {
      const embedIndex = interaction.customId.substring(2).split(".")[2];
      const embeds = interaction.message.embeds;
      const embedButtons = {
        color: new ButtonBuilder()
          .setLabel("Color")
          .setCustomId(`e.embed.color.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
        description: new ButtonBuilder()
          .setLabel("Description")
          .setCustomId(`e.embed.description.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
        editFields: new ButtonBuilder()
          .setLabel("Edit Fields")
          .setCustomId(`e.embed.editFields.${embedIndex}.edit`)
          .setStyle(ButtonStyle.Primary),
        addFields: new ButtonBuilder()
          .setLabel("Add Field")
          .setCustomId(`e.embed.editFields.${embedIndex}.add`)
          .setStyle(ButtonStyle.Primary),
        selectField: new ButtonBuilder()
          .setLabel("Select Field")
          .setCustomId(`e.embed.editFields.${embedIndex}.select`)
          .setStyle(ButtonStyle.Primary),
        fieldName: new ButtonBuilder()
          .setLabel("Edit Field name")
          .setCustomId(`e.embed.editFields.${embedIndex}.name`)
          .setStyle(ButtonStyle.Primary),
        fieldValue: new ButtonBuilder()
          .setLabel("Edit Field Value")
          .setCustomId(`e.embed.editFields.${embedIndex}.value`)
          .setStyle(ButtonStyle.Secondary),
        fieldInline: new ButtonBuilder()
          .setLabel("Toggle Inline")
          .setCustomId(`e.embed.editFields.${embedIndex}.inline`)
          .setStyle(ButtonStyle.Danger),
        fieldDelete: new ButtonBuilder()
          .setLabel("Delete")
          .setCustomId(`e.embed.editFields.${embedIndex}.delete`)
          .setStyle(ButtonStyle.Danger),
        deleteFields: new ButtonBuilder()
          .setLabel("Delete Field")
          .setCustomId(`e.embed.editFields.${embedIndex}.deleteMenu`)
          .setStyle(ButtonStyle.Danger),
        footerImage: new ButtonBuilder()
          .setLabel("Footer Image")
          .setCustomId(`e.embed.footerImage.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
        footer: new ButtonBuilder()
          .setLabel("Footer")
          .setCustomId(`e.embed.footer.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
        image: new ButtonBuilder()
          .setLabel("Image")
          .setCustomId(`e.embed.image.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
        thumbnail: new ButtonBuilder()
          .setLabel("Thumbnail")
          .setCustomId(`e.embed.thumbnail.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
        title: new ButtonBuilder()
          .setLabel("Title")
          .setCustomId(`e.embed.title.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
      };
      switch (subAction) {
        case "select": {
          await interaction.update({
            components: [
              new ActionRowBuilder().addComponents(
                embedButtons.color,
                embedButtons.description,
                embedButtons.editFields,
                embedButtons.footerImage,
                embedButtons.footer,
              ),
              new ActionRowBuilder().addComponents(
                embedButtons.image,
                embedButtons.thumbnail,
                embedButtons.title,
                buttons.home,
              ),
            ],
          });
          break;
        }
        case "color": {
          await interaction.showModal(
            new ModalBuilder()
              .setCustomId(`e.embed.color.${embedIndex}`)
              .setTitle("Edit Color")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("input")
                    .setLabel("color")
                    .setPlaceholder("color")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short),
                ),
              ),
          );
          break;
        }
        case "description": {
          await interaction.showModal(
            new ModalBuilder()
              .setCustomId(`e.embed.description.${embedIndex}`)
              .setTitle("Edit Description")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("input")
                    .setLabel("description")
                    .setPlaceholder("description")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph),
                ),
              ),
          );
          break;
        }
        case "editFields": {
          const fieldAction = interaction.customId.substring(2).split(".")[3];
          const fieldIndex = interaction.customId.substring(2).split(".")[4] || 0;
          embedButtons.fieldName.setCustomId(`e.embed.editFields.${embedIndex}.name.${fieldIndex}`);
          embedButtons.fieldValue.setCustomId(`e.embed.editFields.${embedIndex}.value.${fieldIndex}`);
          embedButtons.fieldDelete.setCustomId(`e.embed.editFields.${embedIndex}.delete.${fieldIndex}`);
          embedButtons.fieldInline
            .setCustomId(`e.embed.editFields.${embedIndex}.inline.${fieldIndex}`)
            .setStyle(
              (embeds[embedIndex].fields[fieldIndex]?.inline ?? false) ? ButtonStyle.Success : ButtonStyle.Danger,
            );
          switch (fieldAction) {
            case "edit": {
              await interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    embedButtons.addFields,
                    embedButtons.selectField,
                    embedButtons.deleteFields,
                  ),
                  new ActionRowBuilder().addComponents(buttons.home),
                ],
              });
              break;
            }
            case "add": {
              embeds[embedIndex] = new EmbedBuilder(embeds[embedIndex])
                .addFields({ name: "Change", value: "me!", inline: false })
                .toJSON();
              await interaction.update({ embeds });
              break;
            }
            case "select": {
              const fieldButtons = [];
              const fieldButtons2 = [];
              const fieldButtons3 = [];
              const fieldButtons4 = [];
              const fields = embeds[embedIndex].fields;
              if (fields) {
                fields.forEach((field) => {
                  if (fieldButtons3.length >= 5) {
                    fieldButtons4.push({
                      custom_id: `e.embed.editFields.${embedIndex}.field.${fields.indexOf(field)}`,
                      label: `Field: ${fields.indexOf(field) + 1}`,
                      style: ButtonStyle.Primary,
                      type: ComponentType.Button,
                    });
                  } else if (fieldButtons2.length >= 5) {
                    fieldButtons3.push({
                      custom_id: `e.embed.editFields.${embedIndex}.field.${fields.indexOf(field)}`,
                      label: `Field: ${fields.indexOf(field) + 1}`,
                      style: ButtonStyle.Primary,
                      type: ComponentType.Button,
                    });
                  } else if (fieldButtons.length >= 5) {
                    fieldButtons2.push({
                      custom_id: `e.embed.editFields.${embedIndex}.field.${fields.indexOf(field)}`,
                      label: `Field: ${fields.indexOf(field) + 1}`,
                      style: ButtonStyle.Primary,
                      type: ComponentType.Button,
                    });
                  } else {
                    fieldButtons.push({
                      custom_id: `e.embed.editFields.${embedIndex}.field.${fields.indexOf(field)}`,
                      label: `Field: ${fields.indexOf(field) + 1}`,
                      style: ButtonStyle.Primary,
                      type: ComponentType.Button,
                    });
                  }
                });
              }
              const components = [];
              if (fieldButtons.length > 0) components.push(new ActionRowBuilder({ components: fieldButtons }));
              if (fieldButtons2.length > 0) components.push(new ActionRowBuilder({ components: fieldButtons2 }));
              if (fieldButtons3.length > 0) components.push(new ActionRowBuilder({ components: fieldButtons3 }));
              if (fieldButtons4.length > 0) components.push(new ActionRowBuilder({ components: fieldButtons4 }));
              components.push(new ActionRowBuilder().addComponents(buttons.home));
              await interaction.update({ components });
              break;
            }
            case "field": {
              interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    embedButtons.fieldName,
                    embedButtons.fieldValue,
                    embedButtons.fieldInline,
                  ),
                  new ActionRowBuilder().addComponents(embedButtons.fieldDelete, buttons.home),
                ],
              });
              break;
            }
            case "name": {
              await interaction.showModal(
                new ModalBuilder()
                  .setCustomId(`e.embed.editFields.${embedIndex}.name.${fieldIndex}`)
                  .setTitle("Edit Field Name")
                  .addComponents(
                    new ActionRowBuilder().addComponents(
                      new TextInputBuilder()
                        .setCustomId("input")
                        .setLabel("name")
                        .setPlaceholder("name")
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short),
                    ),
                  ),
              );
              break;
            }
            case "value": {
              await interaction.showModal(
                new ModalBuilder()
                  .setCustomId(`e.embed.editFields.${embedIndex}.value.${fieldIndex}`)
                  .setTitle("Edit Field value")
                  .addComponents(
                    new ActionRowBuilder().addComponents(
                      new TextInputBuilder()
                        .setCustomId("input")
                        .setLabel("value")
                        .setPlaceholder("value")
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph),
                    ),
                  ),
              );
              break;
            }
            case "inline": {
              embeds[embedIndex].fields[fieldIndex].inline = !embeds[embedIndex].fields[fieldIndex].inline;
              embedButtons.fieldInline
                .setCustomId(`e.embed.editFields.${embedIndex}.inline.${fieldIndex}`)
                .setStyle(embeds[embedIndex].fields[fieldIndex].inline ? ButtonStyle.Success : ButtonStyle.Danger);
              await interaction.update({
                embeds,
                components: [
                  new ActionRowBuilder().addComponents(
                    embedButtons.fieldName,
                    embedButtons.fieldValue,
                    embedButtons.fieldInline,
                  ),
                  new ActionRowBuilder().addComponents(buttons.home),
                ],
              });
              break;
            }
            case "delete": {
              embeds[embedIndex].fields.splice(fieldIndex, 1);
              await interaction.update({
                embeds,
                components: [
                  new ActionRowBuilder().addComponents(
                    embedButtons.addFields,
                    embedButtons.selectField,
                    embedButtons.deleteFields,
                  ),
                  new ActionRowBuilder().addComponents(buttons.home),
                ],
              });
              break;
            }

            case "deleteMenu": {
              const fieldButtons = [];
              const fieldButtons2 = [];
              const fieldButtons3 = [];
              const fieldButtons4 = [];
              const fields = embeds[embedIndex].fields;
              if (fields) {
                fields.forEach((field) => {
                  if (fieldButtons3.length >= 5) {
                    fieldButtons4.push({
                      custom_id: `e.embed.editFields.${embedIndex}.delete.${fields.indexOf(field)}`,
                      label: `Field: ${fields.indexOf(field) + 1}`,
                      style: ButtonStyle.Primary,
                      type: ComponentType.Button,
                    });
                  } else if (fieldButtons2.length >= 5) {
                    fieldButtons3.push({
                      custom_id: `e.embed.editFields.${embedIndex}.delete.${fields.indexOf(field)}`,
                      label: `Field: ${fields.indexOf(field) + 1}`,
                      style: ButtonStyle.Primary,
                      type: ComponentType.Button,
                    });
                  } else if (fieldButtons.length >= 5) {
                    fieldButtons2.push({
                      custom_id: `e.embed.editFields.${embedIndex}.delete.${fields.indexOf(field)}`,
                      label: `Field: ${fields.indexOf(field) + 1}`,
                      style: ButtonStyle.Primary,
                      type: ComponentType.Button,
                    });
                  } else {
                    fieldButtons.push({
                      custom_id: `e.embed.editFields.${embedIndex}.delete.${fields.indexOf(field)}`,
                      label: `Field: ${fields.indexOf(field) + 1}`,
                      style: ButtonStyle.Primary,
                      type: ComponentType.Button,
                    });
                  }
                });
              }
              const components = [];
              if (fieldButtons.length > 0) components.push(new ActionRowBuilder({ components: fieldButtons }));
              if (fieldButtons2.length > 0) components.push(new ActionRowBuilder({ components: fieldButtons2 }));
              if (fieldButtons3.length > 0) components.push(new ActionRowBuilder({ components: fieldButtons3 }));
              if (fieldButtons4.length > 0) components.push(new ActionRowBuilder({ components: fieldButtons4 }));
              components.push(new ActionRowBuilder().addComponents(buttons.home));
              await interaction.update({ components });
              break;
            }
          }
          break;
        }
        case "footerImage": {
          await interaction.showModal(
            new ModalBuilder()
              .setCustomId(`e.embed.footerImage.${embedIndex}`)
              .setTitle("Edit Footer Image")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("input")
                    .setLabel("Footer Image")
                    .setPlaceholder("Footer Image")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short),
                ),
              ),
          );
          break;
        }
        case "footer": {
          await interaction.showModal(
            new ModalBuilder()
              .setCustomId(`e.embed.footer.${embedIndex}`)
              .setTitle("Edit Footer")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("input")
                    .setLabel("Footer")
                    .setPlaceholder("Footer")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short),
                ),
              ),
          );
          break;
        }
        case "image": {
          await interaction.showModal(
            new ModalBuilder()
              .setCustomId(`e.embed.image.${embedIndex}`)
              .setTitle("Edit Image")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("input")
                    .setLabel("Image")
                    .setPlaceholder("Image")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short),
                ),
              ),
          );
          break;
        }
        case "thumbnail": {
          await interaction.showModal(
            new ModalBuilder()
              .setCustomId(`e.embed.thumbnail.${embedIndex}`)
              .setTitle("Edit Thumbnail")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("input")
                    .setLabel("Thumbnail")
                    .setPlaceholder("Thumbnail")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short),
                ),
              ),
          );
          break;
        }
        case "title": {
          await interaction.showModal(
            new ModalBuilder()
              .setCustomId(`e.embed.title.${embedIndex}`)
              .setTitle("Edit Title")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("input")
                    .setLabel("Title")
                    .setPlaceholder("Title")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short),
                ),
              ),
          );
          break;
        }
        case "delete": {
          embeds.splice(embedIndex, 1);
          await interaction.update({ embeds });
          break;
        }
      }
    }
  }
}

async function handleEmbedModelSubmit(interaction) {
  const action = interaction.customId.substring(2).split(".")[0];
  const subAction = interaction.customId.substring(2).split(".")[1];
  const input = interaction.fields.getTextInputValue("input");
  switch (action) {
    case "json": {
      switch (subAction) {
        case "import": {
          const json = JSON.parse(input);
          if (json.content == null) {
            return await interaction.reply({ content: "Invalid Json | Content Dosent Exist", ephemeral: true });
          }
          if (json.embeds == null) {
            return await interaction.reply({ content: "Invalid Json | Embeds dosent exist", ephemeral: true });
          }
          if (typeof json.content !== "string") {
            return await interaction.reply({ content: "Invalid Json | Content must be a string", ephemeral: true });
          }
          if (!Array.isArray(json.embeds)) {
            return await interaction.reply({ content: "Invalid Json | Embeds must be an array", ephemeral: true });
          }
          const embeds = json.embeds.map((embed) => new EmbedBuilder(embed));
          if (embeds.length === 0) {
            buttons.editEmbed.setDisabled(true);
            buttons.deleteEmbed.setDisabled(true);
          }
          if (embeds.length > 9) {
            buttons.addEmbed.setDisabled(true);
          }
          await interaction.update({
            content: json.content,
            embeds: embeds,
            components: [
              new ActionRowBuilder().addComponents(buttons.editMessage, buttons.addImage, buttons.deleteImage),
              new ActionRowBuilder().addComponents(buttons.addEmbed, buttons.editEmbed, buttons.deleteEmbed),
              new ActionRowBuilder().addComponents(buttons.importJson, buttons.exportJson),
              new ActionRowBuilder().addComponents(buttons.reset, buttons.send),
            ],
          });
          break;
        }
      }
      break;
    }
    case "edit": {
      switch (subAction) {
        case "message": {
          await interaction.update({ content: `${input}` });
          break;
        }
      }
      break;
    }
    case "add": {
      switch (subAction) {
        case "img": {
          const images = [];
          interaction.message.attachments.forEach((img) => images.push(img.url));
          images.push(input);
          buttons.deleteImage.setDisabled(false);
          buttons.addImage.setDisabled(false);
          if (images.length >= 10) {
            buttons.addImage.setDisabled(true);
          }
          await interaction.update({
            files: [images],
            components: [
              new ActionRowBuilder().addComponents(buttons.editMessage, buttons.addImage, buttons.deleteImage),
              new ActionRowBuilder().addComponents(buttons.addEmbed, buttons.editEmbed, buttons.deleteEmbed),
              new ActionRowBuilder().addComponents(buttons.importJson, buttons.exportJson),
              new ActionRowBuilder().addComponents(buttons.reset, buttons.send),
            ],
          });
          break;
        }
      }
      break;
    }
    case "embed": {
      const embedIndex = interaction.customId.substring(2).split(".")[2];
      const embeds = interaction.message.embeds;
      const embedButtons = {
        color: new ButtonBuilder()
          .setLabel("Color")
          .setCustomId(`e.embed.color.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
        description: new ButtonBuilder()
          .setLabel("Description")
          .setCustomId(`e.embed.description.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
        editFields: new ButtonBuilder()
          .setLabel("Edit Fields")
          .setCustomId(`e.embed.editFields.${embedIndex}.edit`)
          .setStyle(ButtonStyle.Primary),
        addFields: new ButtonBuilder()
          .setLabel("Add Field")
          .setCustomId(`e.embed.editFields.${embedIndex}.add`)
          .setStyle(ButtonStyle.Primary),
        selectField: new ButtonBuilder()
          .setLabel("Select Field")
          .setCustomId(`e.embed.editFields.${embedIndex}.select`)
          .setStyle(ButtonStyle.Primary),
        fieldName: new ButtonBuilder()
          .setLabel("Edit Field name")
          .setCustomId(`e.embed.editFields.${embedIndex}.name`)
          .setStyle(ButtonStyle.Primary),
        fieldValue: new ButtonBuilder()
          .setLabel("Edit Field Value")
          .setCustomId(`e.embed.editFields.${embedIndex}.value`)
          .setStyle(ButtonStyle.Secondary),
        fieldInline: new ButtonBuilder()
          .setLabel("Toggle Inline")
          .setCustomId(`e.embed.editFields.${embedIndex}.inline`)
          .setStyle(ButtonStyle.Danger),
        deleteFields: new ButtonBuilder()
          .setLabel("Delete Field")
          .setCustomId(`e.embed.editFields.${embedIndex}.delete`)
          .setStyle(ButtonStyle.Primary),
        footerImage: new ButtonBuilder()
          .setLabel("Footer Image")
          .setCustomId(`e.embed.footerImage.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
        footer: new ButtonBuilder()
          .setLabel("Footer")
          .setCustomId(`e.embed.footer.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
        image: new ButtonBuilder()
          .setLabel("Image")
          .setCustomId(`e.embed.image.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
        thumbnail: new ButtonBuilder()
          .setLabel("Thumbnail")
          .setCustomId(`e.embed.thumbnail.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
        title: new ButtonBuilder()
          .setLabel("Title")
          .setCustomId(`e.embed.title.${embedIndex}`)
          .setStyle(ButtonStyle.Primary),
      };
      switch (subAction) {
        case "color": {
          embeds[embedIndex] = new EmbedBuilder(embeds[embedIndex]).setColor(input).toJSON();
          await interaction.update({ embeds });
          break;
        }
        case "image": {
          embeds[embedIndex] = new EmbedBuilder(embeds[embedIndex]).setImage(input).toJSON();
          await interaction.update({ embeds });
          break;
        }
        case "thumbnail": {
          embeds[embedIndex] = new EmbedBuilder(embeds[embedIndex]).setThumbnail(input).toJSON();
          await interaction.update({ embeds });
          break;
        }
        case "editFields": {
          const fieldAction = interaction.customId.substring(2).split(".")[3];
          const fieldIndex = interaction.customId.substring(2).split(".")[4] || 0;
          embedButtons.fieldName.setCustomId(`e.embed.editFields.${embedIndex}.name.${fieldIndex}`);
          embedButtons.fieldValue.setCustomId(`e.embed.editFields.${embedIndex}.value.${fieldIndex}`);
          embedButtons.fieldInline
            .setCustomId(`e.embed.editFields.${embedIndex}.inline.${fieldIndex}`)
            .setStyle(embeds[embedIndex].fields[fieldIndex].inline ? ButtonStyle.Success : ButtonStyle.Danger);

          switch (fieldAction) {
            case "name": {
              embeds[embedIndex].fields[fieldIndex].name = input;
              await interaction.update({ embeds });
              break;
            }
            case "value": {
              embeds[embedIndex].fields[fieldIndex].value = input;
              await interaction.update({ embeds });
              break;
            }
          }
          break;
        }
        default: {
          embeds[embedIndex].data[subAction] = input;
          await interaction.update({ embeds });
          break;
        }
      }
      break;
    }
  }
}

module.exports = {
  buttons,
  handleEmbedButtonClick,
  handleEmbedModelSubmit,
};
