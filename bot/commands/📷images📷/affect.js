const Discord = require("discord.js");

exports.run = async (Bot, message) => {
  const User = Bot.GetMember(message, Arguments) || Bot.users.cache.get(Arguments[0]) || message.author

  if (Bot.Config.Debug.Enabled === true) {
    return
  }

  const canvacord = require("canvacord");

  const Avatar = User.displayAvatarURL({
    dynamic: false,
    format: "gif"
  })

  const Image = await canvacord.Canvas.affect(Avatar)
  const Affect = new Discord.MessageAttachment(Image, "affect.gif")

  message.lineReplyNoMention(Affect)
},

  exports.config = {
    name: "Affect",
    description: "Yes it does noob",
    aliases: ["nope"],
    usage: "<optional user>",
    category: "📷images📷",
    bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"],
    member_permissions: [],
    enabled: true,
    cooldown: 2
  }