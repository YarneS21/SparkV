const Discord = require("discord.js");

exports.run = async (bot, message, args, command, data) => {
<<<<<<< HEAD
  const User = (await bot.GetMember(message, args)) || bot.users.cache.get(args[0]) || message.author;
=======
    const User =
        (await bot.GetMember(message, args)) ||
        bot.users.cache.get(args[0]) ||
        message.author;
>>>>>>> 70609d4f007e7ef8d0bb40ceac5f221f0697eb89

    if (bot.config.Debug.Enabled === true) {
        return;
    }

    const canvacord = require("canvacord");

<<<<<<< HEAD
  const Avatar = User.displayAvatarURL({
    dynamic: false,
    format: "gif",
  });
=======
    const Avatar = User.displayAvatarURL({
        dynamic: false,
        format: "gif",
    });
>>>>>>> 70609d4f007e7ef8d0bb40ceac5f221f0697eb89

    const Image = await canvacord.Canvas.rip(Avatar);
    const Rip = new Discord.MessageAttachment(Image, "rip.gif");

    message.reply(Rip);
};
exports.config = {
<<<<<<< HEAD
  name: "Rip",
  description: "RIP",
  aliases: [],
  usage: "<optional user>",
  category: "📷Images📷",
  bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"],
  member_permissions: [],
  enabled: true,
  cooldown: 2,
=======
    name: "Rip",
    description: "RIP",
    aliases: [],
    usage: "<optional user>",
    category: "📷Images📷",
    bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"],
    member_permissions: [],
    enabled: true,
    cooldown: 2,
>>>>>>> 70609d4f007e7ef8d0bb40ceac5f221f0697eb89
};
