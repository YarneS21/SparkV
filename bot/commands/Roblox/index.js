const config = require("../../../globalconfig.json");
const fs = require("fs");

const commands = fs
	.readdirSync(__dirname)
	.filter(c => c !== "index.js")
	.map(c => require(`${__dirname}/${c}`));

module.exports = {
	name: "Roblox",
	description: "The commands that handle Roblox features (Shout, WhoIs), easily done with SparkV.",
	emoji: config.emojis.roblox,
	commands,
};
