import Discord, { Channel, Colors } from "discord.js";
import canvacord from "canvacord";

import cmd from "../../../Structures/command";

const CColors = [{
	name: "White",
	emoji: "⬜",
	value: "White"
}, {
	name: "Blue",
	emoji: "🟦",
	value: "Blue"
}, {
	name: "Green",
	emoji: "🟩",
	value: "Green"
}, {
	name: "Purple",
	emoji: "🟪",
	value: "Purple"
}, {
	name: "Yellow",
	emoji: "🟨",
	value: "Yellow"
}, {
	name: "Orange",
	emoji: "🟧",
	value: "Orange"
}, {
	name: "Red",
	emoji: "🟥",
	value: "Red"
}, {
	name: "Black",
	emoji: "⬛",
	value: "Black"
}, {
	name: "Grey",
	emoji: "⚫",
	value: "Grey"
}, {
	name: "Blurple",
	emoji: "🔵",
	value: "Blurple"
}, {
	name: "Random",
	emoji: "🔀",
	value: "Random"
}];

async function execute(bot: any, message: any, args: string[], command: any, data: any) {
	switch (data.options.getSubcommand()) {
		case "tickets": {
			const color = data.options.getString("color") || "Blue";
			await message.channel.send({
				embeds: [{
					title: data.options.getString("title") || await message.translate(`${bot.config.emojis.ticket} | Get Support`),
					description: data.options.getString("description") || await message.translate("Need help? Click the button below to create a support ticket."),
					color: Colors[color as keyof typeof Colors]
				}],
				components: [{
					type: 1,
					components: [{
						type: 2,
						label: await message.translate("Create Ticket"),
						emoji: bot.config.emojis.ticket,
						style: 2,
						customId: "ticket_create"
					}]
				}]
			});

			const category = await message.guild.channels.cache.find((c: Channel | any) => (c.name.toLowerCase().includes("support") || c.name.toLowerCase().includes("tickets")) && c.type === "GUILD_CATEGORY") || await message.guild.channels.create("Tickets", { type: "GUILD_CATEGORY" });
			data.guild.tickets.category = category.id;
			data.guild.markModified("tickets.category");
			await data.guild.save();

			await message.replyT(`${bot.config.emojis.success} | Successfully created ticket panel.`);
			break;
		} case "roles": {
			const color = data.options.getString("color") || "Blue";

			const buttons = [];
			buttons.push({
				type: 2,
				label: data.options.getString("role1_text") || "React to get a role",
				customId: `role_${await data.options.getRole("role1").id}`,
				style: 2,
				emoji: data.options.getString("role1_emoji") || null,
				url: null,
				disabled: false
			});

			if (data.options.getRole("role2") && data.options.getString("role2_text")) {
				buttons.push({
					type: 2,
					label: data.options.getString("role2_text") || "React to get a role",
					customId: `role_${await data.options.getRole("role2").id}`,
					style: 2,
					emoji: data.options.getString("role2_emoji") || null,
					url: null,
					disabled: false
				});
			}

			if (data.options.getRole("role3") && data.options.getString("role3_text")) {
				buttons.push({
					type: 2,
					label: data.options.getString("role3_text") || "React to get a role",
					customId: `role_${await data.options.getRole("role3").id}`,
					style: 2,
					emoji: data.options.getString("role3_emoji") || null,
					url: null,
					disabled: false
				});
			}

			if (data.options.getRole("role4") && data.options.getString("role4_text")) {
				buttons.push({
					type: 2,
					label: data.options.getString("role4_text") || "React to get a role",
					customId: `role_${await data.options.getRole("role4").id}`,
					style: 2,
					emoji: data.options.getString("role4_emoji") || null,
					url: null,
					disabled: false
				});
			}

			if (data.options.getRole("role5") && data.options.getString("role5_text")) {
				buttons.push({
					type: 2,
					label: data.options.getString("role5_text") || "React to get a role",
					customId: `role_${await data.options.getRole("role5").id}`,
					style: 2,
					emoji: data.options.getString("role5_emoji") || null,
					url: null,
					disabled: false
				});
			}

			await message.channel.send({
				embeds: [{
					title: data.options.getString("title") || `${bot.config.emojis.special} | Role Select`,
					description: data.options.getString("description") || "Click the button(s) below to give yourself a role!",
					color: Colors[color as keyof typeof Colors]
				}],
				components: [{
					type: 1,
					components: buttons
				}]
			});

			await message.replyT(`${bot.config.emojis.success} | Successfully created roles select panel.`);
			break;
		} case "embed": {
			let title: any;
			let color: any = "Blue";
			let image: any, thumbnail: any;
			let description: any = "> Here, you can put some text. You can use Discord markdown here as well.\n\n> ~~Strike~~ • __Underline__  • **Bold** • *Italics* • || Hidden 😉 || • [Click Here](https://www.youtube.com/watch?v=dQw4w9WgXcQ)";

			const editComponents = [{
				type: 1,
				components: [{
					type: 2,
					label: await message.translate("Title"),
					emoji: bot.config.emojis.edit,
					customId: "edit_title",
					style: 2
				}, {
					type: 2,
					label: await message.translate("Description"),
					emoji: bot.config.emojis.edit,
					customId: "edit_description",
					style: 2
				}, {
					type: 2,
					label: await message.translate("Thumbnail"),
					emoji: bot.config.emojis.edit,
					customId: "edit_thumbnail",
					style: 2
				}, {
					type: 2,
					label: await message.translate("Image"),
					emoji: bot.config.emojis.edit,
					customId: "edit_image",
					style: 2
				}, {
					type: 2,
					label: await message.translate("Done"),
					emoji: bot.config.emojis.success,
					customId: "done",
					style: 3
				}]
			}, {
				type: 1,
				components: [{
					type: 3,
					customId: "embed_color_select",
					placeholder: "Select a color for the embed.",
					options: CColors.map((c: any) => {
						return {
							label: c.name,
							emoji: c?.emoji,
							value: c.value
						}
					}),
					disabled: false
				}]
			}];

			/* -------------------------------------------------- SEND MESSAGE --------------------------------------------------*/
			const msg = await message.replyT({
				embeds: [{
					title,
					description: description.replaceAll("\\n", "\n"),
					thumbnail: { url: thumbnail },
					image: { url: image },
					color: Colors.Blue,
					timestamp: new Date()
				}],
				components: editComponents,
				fetchReply: true
			});

			/* -------------------------------------------------- GET INPUT --------------------------------------------------*/
			async function getInput(msg: any, options: any) {
				await msg.edit({
					embeds: [{
						title: `Editing ${options.title}`,
						description: `Please enter a new ${options.title} text for the message.`,
						color: Colors.Green
					}],
					components: []
				});

				const content = await msg.channel.awaitMessages({
					max: 1,
					time: options?.timeout || 30 * 1000,
					filter: async (m: any) => {
						if (!m?.content && options?.checkURL !== true) {
							await msg.edit({
								embeds: [{
									title: `Editing ${options.title}`,
									description: `Please send text, not an attachment.`,
									color: Colors.Red
								}]
							});
							return false;
						} else if (m.content.length >= options.maxLength) {
							await msg.edit({
								embeds: [{
									title: `Editing ${options.title}`,
									description: `Please send text less than ${options.maxLength} characters.`,
									color: Colors.Red
								}]
							});
							return false;
						}

						await bot.wait(2000);

						return true;
					},
					errors: ["time"]
				}).then((collected: any) => {
					if (collected.first()) {
						const content = collected.first().content;
						collected.first().delete();
						if (content === "cancel") return options.previousValue;
						else if (content.length > 0 && content.length <= options.maxLength) return content.replaceAll("\\n", "\n");
					}
				}).catch(() => options.previousValue);

				return content;
			}

			/* -------------------------------------------------- HANDLE INPUT --------------------------------------------------*/
			const collector = msg.createMessageComponentCollector({ time: 1200 * 1000 });
			collector.on("collect", async (interaction: any) => {
				interaction.deferUpdate().catch((): any => { });

				switch (interaction.customId) {
					case "edit_title": {
						title = await getInput(msg, {
							title: "Title",
							previousValue: title,
							maxLength: 4096,
							timeout: 300 * 1000
						});
						break;
					} case "edit_description": {
						description = await getInput(msg, {
							title: "Description",
							previousValue: description,
							maxLength: 256,
							timeout: 600 * 1000
						});
						break;
					} case "edit_thumbnail": {
						thumbnail = await getInput(msg, {
							title: "Thumbnail",
							previousValue: thumbnail,
							checkURL: true,
							maxLength: 200,
							timeout: 300 * 1000
						});
						break;
					} case "edit_image": {
						image = await getInput(msg, {
							title: "Image",
							previousValue: image,
							checkURL: true,
							maxLength: 200,
							timeout: 300 * 1000
						});
						break;
					} case "embed_color_select": { color = interaction.values[0]; break; }
					case "done": { collector.stop(); break; }
				}

				interaction.customId !== "done" && await msg.edit({
					embeds: [{
						title,
						description,
						thumbnail: { url: thumbnail },
						image: { url: image },
						color: Colors[color as keyof typeof Colors],
						timestamp: new Date()
					}],
					components: editComponents,
					fetchReply: true
				});
			});
			collector.on("end", async () => {
				try { await msg?.edit({ components: [] }); } catch (err: any) { }
			});
		}
	}
}

export default new cmd(execute, {
	description: "Set up a feature. (tickets, roles, embed)",
	dirname: __dirname,
	aliases: [],
	perms: ["ManageGuild"],
	usage: "(tickets|roles|embed) (title|description|color)",
	slash: true,
	options: [{
		type: 1,
		name: "tickets",
		description: "Allow users to open a ticket in your server.",
		options: [{
			type: 3,
			name: "title",
			description: "The title to the ticket embed."
		}, {
			type: 3,
			name: "description",
			description: "The description to the ticket embed."
		}, {
			type: 3,
			name: "color",
			description: "The color to ALL the ticket embeds.",
			choices: CColors
		}]
	}, {
		type: 1,
		name: "roles",
		description: "Create a message that allows you to get roles by clicking a button.",
		options: [{
			type: 8,
			name: "role1",
			description: "The first role button.",
			required: true
		}, {
			type: 3,
			name: "role1_text",
			description: "The first role button's text.",
			required: true
		}, {
			type: 3,
			name: "role1_emoji",
			description: "The emoji to use for the first role button."
		}, {
			type: 8,
			name: "role2",
			description: "The second role button."
		}, {
			type: 3,
			name: "role2_text",
			description: "The second role button's text."
		}, {
			type: 3,
			name: "role2_emoji",
			description: "The emoji to use for the second role button."
		}, {
			type: 8,
			name: "role3",
			description: "The third role button."
		}, {
			type: 3,
			name: "role3_text",
			description: "The third role button's text."
		}, {
			type: 3,
			name: "role3_emoji",
			description: "The emoji to use for the third role button."
		}, {
			type: 8,
			name: "role4",
			description: "The fourth role button."
		}, {
			type: 3,
			name: "role4_text",
			description: "The fourth role button's text."
		}, {
			type: 3,
			name: "role4_emoji",
			description: "The emoji to use for the fourth role button."
		}, {
			type: 8,
			name: "role5",
			description: "The fifth role button."
		}, {
			type: 3,
			name: "role5_text",
			description: "The fifth role button's text."
		}, {
			type: 3,
			name: "role5_emoji",
			description: "The emoji to use for the fifth role button."
		}, {
			type: 3,
			name: "title",
			description: "The title to the ticket embed."
		}, {
			type: 3,
			name: "description",
			description: "The description to the ticket embed."
		}, {
			type: 3,
			name: "color",
			description: "The color to ALL the ticket embeds.",
			choices: CColors
		}]
	}, {
		type: 1,
		name: "embed",
		description: "Create an embed."
	}]
});
