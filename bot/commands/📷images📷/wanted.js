const Discord = require("discord.js");

exports.run = async (Bot, message, Arguments) => {
  const User = Bot.GetMember(message, Arguments) || Bot.users.cache.get(Arguments[0]) || message.author

  if (Bot.Config.Debug.Enabled === true) {
    return
  }
  const canvacord = require("canvacord");

  const Avatar = User.displayAvatarURL({
    dynamic: false,
    format: "gif"
  })

  const Image = await canvacord.Canvas.wanted(Avatar)
  const Wanted = new Discord.MessageAttachment(Image, "wanted.gif")

  message.lineReplyNoMention(Wanted)
},

  exports.config = {
    name: "Wanted",
    description: "Wanted sign.",
    aliases: ["colorful"],
    usage: "<optional user>",
    category: "📷images📷",
    bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"],
    member_permissions: [],
    enabled: true,
    cooldown: 2
  }