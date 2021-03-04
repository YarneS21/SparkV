const Discord = require("discord.js");

exports.run = async (Bot, message) => {
  const User = message.mentions.users.first() || Bot.users.cache.get(Arguments[0]) || message.author

  if (process.env.TestMode) {
    return
  }

  const canvacord = require("canvacord");

  const Avatar = User.displayAvatarURL({
    dynamic: false,
    format: "png"
  })

  const Image = await canvacord.Canvas.trigger(Avatar)
  const Triggered = new Discord.MessageAttachment(Image, "triggered.gif")

  message.channel.send(Triggered)
},

exports.config = {
  name: "Trigger",
  description: "wow you mad bro",
  aliases: ["mad"],
  usage: "<optional user>",
  category: "📷images📷",
  bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"],
  member_permissions: [],
  enabled: true,
  cooldown: 2
}