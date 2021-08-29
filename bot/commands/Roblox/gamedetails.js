const Discord = require(`discord.js`);
const request = require(`node-fetch`);

const command = require("../../templates/command");

function execute(bot, message, args, command) {
  if (!args) {
    return message.reply(`${bot.config.bot.Emojis.error} | Next time, respond with the ID of the game lmao.`);
  }

    request(`https://roblox-embed-discord-jpcnmriva99q.runkit.sh/${args}.json`)
        .then(res => res.json())
        .then(async json => {
            const Embed = new Discord.MessageEmbed()
                .setTitle(json.title)
                .setDescription(json.description)
                .setImage(json.image.url)
                .setThumbnail(json.thumbnail.url)
                .setAuthor(
                    json.author.name,
                    json.author.icon_url,
                    json.author.url
                )
                .addFields(json.fields)
                .setFooter(json.footer.text, json.footer.icon_url)
                .setURL(json.url)
                .setColor(json.color)
                .setTimestamp();

      message.reply({
        embeds: [Embed],
      });
    })
    .catch(err => message.reply(`${bot.config.bot.Emojis.error} | An error occured!`));
}

module.exports = new command(execute, {
  description: `I'll grab the details of any game for you.`,
  aliases: [`gd`],
  perms: ["EMBED_LINKS"],
});
