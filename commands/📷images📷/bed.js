const Discord = require("discord.js");

exports.run = async (Bot, message) => {
  const User = message.mentions.users.first() || Bot.users.cache.get(Arguments[0]) || message.author

  if (process.env.TestMode) {
    return
  }

  const canvacord = require("canvacord");

  const Avatar = message.author.displayAvatarURL({
    dynamic: false,
    format: "png"
  })

  const UserAvatar = User.displayAvatarURL({
    dynamic: false,
    format: "png"
  })

  const Image = await canvacord.Canvas.bed(UserAvatar, Avatar)
  const Bed = new Discord.MessageAttachment(Image, "bed.png")

  message.channel.send(Bed)
},

exports.config = {
  name: "Bed",
  description: "AAAAAAAAAAAAAAAAAAAAAAAAAAAH!",
  aliases: ["underbed"],
  usage: "<<optional user>>",
  category: "📷images📷",
  bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"],
  member_permissions: [],
  enabled: true,
  cooldown: 2
}