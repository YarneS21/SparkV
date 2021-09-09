const Discord = require(`discord.js`);
const fetch = require("node-fetch");

const cmd = require("../../templates/command");

function CreateID() {
  let text = `haha yes`;
  let codes = [`🥶`, `😰`, `😅`, `😓`, `⛄`, `💧`, `🧊`];

  text = `${codes[Math.floor(Math.random() * codes.length)]} ${codes[Math.floor(Math.random() * codes.length)]} ${
    codes[Math.floor(Math.random() * codes.length)]
  } ${codes[Math.floor(Math.random() * codes.length)]} ${codes[Math.floor(Math.random() * codes.length)]} ${
    codes[Math.floor(Math.random() * codes.length)]
  } ${codes[Math.floor(Math.random() * codes.length)]}`;

  return text;
}

function execute(bot, message, args, command, data) {
  if (bot.config.Debug.Enabled === true) {
    return;
  }

  const noblox = require(`noblox.js`);

  fetch(`https://verify.eryn.io/api/user/${message.author.id}`)
    .then(response => response.json())
    .then(body => {
      if (body.status === "ok") {
        const DiscordEmbed = new Discord.MessageEmbed()
          .setTitle(`SparkV Verification`)
          .setDescription(`You've been successfully verified as **${body.robloxUsername}**!`)
          .setColor(`GREEN`)
          .setFooter(bot.config.bot.Embed.Footer);
      } else {
        const DiscordEmbed = new Discord.MessageEmbed()
          .setTitle(`Verification Prompt`)
          .setDescription(
            `You don't have any verified accounts! Please [click here](https://discord.com/oauth2/authorize?client_id=240413107850182656&scope=identify+guilds&response_type=code&redirect_uri=https%3A%2F%2Fverify.eryn.io) to link yourself with the API and then try again."`,
          )
          .setColor(bot.config.bot.Embed.Color)
          .setFooter(bot.config.bot.Embed.Footer);
      }
    });

  let PromptEmbed = new Discord.MessageEmbed()
    .setTitle(`Verification Prompt`)
    .setDescription(`What's your Roblox username?`)
    .setFooter(`This verification prompt will cancel after 200 seconds.`)
    .setColor(bot.config.bot.Embed.Color)
    .setTimestamp();

  message.reply(PromptEmbed);

  MessageColector.on(`collect`, async msg => {
    if (msg.content.toLowerCase() === `cancel`) {
      return message.reply(`Verification canceled.`);
    }

    noblox.getIdFromUsername(msg.content).then(async id => {
      if (!id) {
        return message.reply(`Verification canceled. User doesn't exist.`);
      }

      const VerificationID = CreateID();

      const UsernameFound = new Discord.MessageEmbed()
        .setTitle(`Verification Prompt`)
        .setDescription(
          `Hi, **${msg.content}**! To verify that you are indeed, ${msg.content}, please put \`${VerificationID}\` anywhere in your about section.\n\nSay **Done** when comeplete.\nSay **Cancel** to cancel.`,
        )
        .setFooter(`ID: ${id} • ${bot.config.bot.Embed.Footer}`)
        .setColor(bot.config.bot.Embed.Color)
        .setTimestamp();

      message.reply(UsernameFound);

      const VerifyMessageColector = message.channel.createMessageCollector(Filter, {
        max: 1,
        maxMatches: 1,
        time: 200 * 1000,
      });

      VerifyMessageColector.on(`collect`, async msg_ => {
        if (msg_.content.includes(`done`) && msg_.author.id === message.author.id) {
          message.reply(`Fetching about status. Please wait...`);

          setTimeout(async () => {
            noblox.getStatus(id).then(async status => {
              noblox.getBlurb(id).then(async about => {
                if (about.includes(VerificationID) || status.includes(VerificationID)) {
                  message.reply(Verified);

                  const RocordRoleEnabled = await bot.dashboard.getVal(message.guild.id, `RocordVerifyRoleEnabled`);

                  if (RocordRoleEnabled === `Enabled`) {
                    let VerifiedRole = message.guild.roles.cache.find(
                      r =>
                        r.name.toLowerCase() === `verified` ||
                        r.name.toLowerCase().startsWith(`verified`) ||
                        r.name.toLowerCase().endsWith(`verified`),
                    );

                    if (!VerifiedRole) {
                      return message.reply(
                        `This server isn't set up right! Verified role not found. Make sure you've created a role that contains \`Verified\`.`,
                      );
                    }

                    message.member.roles.add(VerifiedRole).catch(() => {
                      message.reply(
                        `I cannot give you this role! Due to Discord API, please check my permisions and make sure I'm higher then your highest role.`,
                      );
                    });
                  }

                  const RocordNicknameTemplate = await bot.dashboard.getVal(message.guild.id, `RocordNicknameTemplate`);

                  if (RocordNicknameTemplate) {
                    if (RocordNicknameTemplate.toString().includes(`{discord-name}`)) {
                      RocordNicknameTemplate.toString().replaceAll(`{discord-name}`, message.author.name);
                    }

                    if (RocordNicknameTemplate.toString().includes(`{discord-id}`)) {
                      RocordNicknameTemplate.toString().replaceAll(`{discord-id}`, message.author.id);
                    }

                    if (RocordNicknameTemplate.toString().includes(`{roblox-username}`)) {
                      RocordNicknameTemplate.toString().replaceAll(`{roblox-username}`, m.content);
                    }

                    if (RocordNicknameTemplate.toString().includes(`{roblox-id}`)) {
                      RocordNicknameTemplate.toString().replaceAll(`{roblox-id}`, id);
                    }

                    message.member
                      .setNickname(RocordNicknameTemplate)
                      .catch(() =>
                        message.reply(
                          `I cannot change your nickname! Due to Discord API, please check my permisions and make sure I'm higher then your highest role.`,
                        ),
                      );
                  }
                } else {
                  message.reply(`Failed to find Verification ID on your status/about page.`);
                }
              });
            });
          }, 5 * 1000);
        } else if (msg_.content.includes(`cancel`) && msg_.author.id === message.author.id) {
          return message.reply(`Cancelled prompt.`);
        }
      });
    });
  });
}

module.exports = new cmd(execute, {
  description: `Verify yourself! Only works when enabled on the dashboard.`,
  dirname: __dirname,
  usage: "<username>",
  aliases: [],
  perms: ["EMBED_LINKS"],
});
