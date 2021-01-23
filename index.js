const Discord = require("discord.js");
const client = new Discord.Client();
const { readdirSync } = require("fs");
const command = require("./command");
const db = require('quick.db');
const math = require('mathjs');
const Rcon = require('modern-rcon');
const { join } = require("path");
const stocknitro = db.get(`nitro.stock`);
const axios = require('axios')
client.on("ready", () => {
  if(stocknitro === null) db.set('nitro.stock', 1)
  console.log(`[Api Client] Login with ${client.user.tag}!`);
  client.user.setStatus("idle");

  client.user.setActivity(`m.help | ดูคำสั่ง`, { type: "COMPETING" });
  setInterval(() => {
    const statuslist = [
      `m.help  | คนในเซิร์ฟเวอร์ ${client.guilds.cache.reduce(
        (a, g) => a + g.memberCount,
        0
      )} คน`,
      `m.help  | คำสั่งทั้งหมด m.help`
    ];
    const statusplay = ["WATCHING", "LISTENING", "COMPETING"];
    client.user.setActivity(
      `${statuslist[Math.floor(Math.random() * statuslist.length)]}`,
      { type: statusplay[Math.floor(Math.random() * statusplay.length)] }
    );
  }, 3000);
});

client.on("message", message => {
    const playerstock = db.get(`point.${message.author.id}`)
    if(playerstock === null) db.set(`point.${message.author.id}`, 1)
});

client.commands = new Discord.Collection();
const prefix = "m.";
client.prefix = prefix;
client.queue = new Map();
const cooldowns = new Discord.Collection();

client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  const prefix = "m.";
  if (message.author.bot) return;
  if (!message.guild) return;
  
  if (message.content.startsWith(prefix)) {
      if (message.content.startsWith(prefix)) {
     if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    console.log(`01. | ${message.member.user.username} | ${commandName} | ${db.get(`music.${message.guild.id}`)}`)

    const command =
      client.commands.get(commandName) ||
      client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    const now = Date.now();

    try {
      command.execute(message, args, client);
    } catch (error) {
	console.error(`Error 0.1 | ${error}`);
      message.reply("There was an error executing that command.").catch(console.error);
    }
  }
}});

client.on("message", msg => {
  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);
  const commandName = args.shift().toLowerCase();
  
  if (commandName === "ping") {
    msg.reply(`Ping pony ${client.ws.ping}`);
  }
  if (commandName === "date") {
    var date = new Date();
    msg.reply(`My date this ${date}`);
  }
  if (commandName === "buynitro1") {
    if(!args[0]) return msg.reply('กรุณาใส่จำนวนที่ต้องการ');
    if(args[0] > stocknitro) return msg.reply('stock หมดกรุณาแจ้งแอดมิน');
    const wekhook = new Discord.WebhookClient('802393901864321044', 'CNrdpVWSTv248Y6fRj3Mm_jEwFWaVSeE1VohM8inyxRSA2xu2P4opctDVlJ4AaMnFkM8');
    msg.reply('ส่งของไปในส่วนตัวแล้ว')
    wekhook.send(`${msg.author}, ได้เติม Nitro 3 เดือนเข้าตัวเองแล้ว`)
  }
  if (commandName === "setstatus") {
    if (msg.author.id === "513263702120726549")
      return msg.channel.send(`<@!${msg.author.tag}>, ไม่มีสิทธิ์มาเปลี่ยน`);
    if (!args[0])
      return msg.reply("กรุณาบอกว่าจะเปลี่ยนเป็นอะไรเช่น playing,idle,dnd");
    client.user.setStatus(args[0]);
    msg.reply("เปลี่ยนเป็น" + args[0] + "แล้ว");
  }
  if (commandName === "addstock") {
    if (msg.author.id === "513263702120726549")
      return msg.channel.send(`<@!${msg.author.tag}>, ไม่มีสิทธิ์มาเปลี่ยน`);
    if (!args[0])
      return msg.reply("กรุณาบอกด้วยว่าเพิ่มส๊อกเท่าไร");
    msg.reply("เพิ่มสต๊อกแล้วเป็น" + args[0] + "แล้ว");
    const resp = math.evaluate(`${stocknitro} + ${args[0]}`)
    db.set(`nitro.stock`, resp)
  }
  if (commandName === "help") {
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`•Command Bot`)
      .setDescription(
        `help หน้าต่างคำสั่ง,
m.buy สร้างห้อง,
m.closebuy ปิดห้องซิ้อขาย,
m.topinvites ดูการเชิญ
m.topup เติมเงินด้วยอังเปา`
      )
      .setThumbnail(client.user.displayAvatarURL({ size: 4096, dynamic: true }))
      .setImage()
      .setTimestamp()
      .setFooter(
        "Help embed test",
        msg.author.displayAvatarURL({ size: 4096, dynamic: true })
      );
    msg.reply(exampleEmbed);
  }
  if (commandName === "embed") {
    const embedmessage = new Discord.MessageEmbed()
      .setDescription(args[0])
      .setImage(args[1]);
    if (!args[0]) return msg.reply("กรุณาใส่ข้อความ");
    if (!args[1]) return msg.reply("กรุณาใส่รูป");
    msg.channel.send(embedmessage);
    msg.delete();
  }
  if (commandName === "buy") {
    const user = msg.author.id;
    const name = "🔒-" + user;
    if (msg.guild.channels.cache.find(ch => ch.name == name))
      return msg.reply("คุณสร้างไปเเล้ว 1ห้อง");
    msg
      .reply(
        new Discord.MessageEmbed()
          .setDescription(`${msg.author.tag} คุณได้สร้างห้องแล้ว!`)
          .setFooter(`m.buy เพื่อซื้อ`, msg.author.displayAvatarURL())
          .setColor("#2de714")
      )
      .then(channel => {
        msg.guild.channels
          .create(">-" + msg.author.id, {
            type: "text"
          })
          .then(channel => {
            channel.updateOverwrite(msg.guild.roles.everyone, {
              SEND_MESSAGES: false,
              VIEW_CHANNEL: false
            });
            channel.updateOverwrite(msg.author.id, {
              SEND_MESSAGES: true,
              VIEW_CHANNEL: true
            });
            let embeda = new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setDescription(
                `***__ขั้นตอนการซื้อ__*** \n 1.รอให้ แอดมินตอบแชท \n 2.บอกสิ่งที่จะสั่ง \n3.โอนมาแจ้งสลิปด้วย \n4.รอรับของ \n*ถ้าโอนเกินจะถือว่าโดเนท  \n*แบบนี้นะครับ \n \n ขอบคุณที่ใช้บริการ`
              )
              .setImage();
            channel.send(embeda);
            channel.send(`สวัสดี: ${msg.author} `);
            channel.send(`กำลังติดต่อ: ${msg.guild.owner}  กรุณารอซักครู่`);
          });
      });
  }
  if (commandName === "topinvites") {
    const { guild } = msg;

    guild.fetchInvites().then(invites => {
      const inviteCounter = {};

      invites.forEach(invite => {
        const { uses, inviter } = invite;
        const { username, discriminator } = inviter;

        const name = `${username}#${discriminator}`;

        inviteCounter[name] = (inviteCounter[name] || 0) + uses;
      });

      let replyText = "Invites:";

      const sortedInvites = Object.keys(inviteCounter).sort(
        (a, b) => inviteCounter[b] - inviteCounter[a]
      );

      console.log(sortedInvites);

      sortedInvites.length = 5;

      for (const invite of sortedInvites) {
      if(sortedInvites.lenth = 5 === undefined) replyText += `\n${invite} เชิญทั้งหมด ${count} คน(s)!`;
        const count = inviteCounter[invite];
        replyText += `\n${invite} เชิญทั้งหมด ${count} คน(s)!`;
      }

      msg.reply(
        new Discord.MessageEmbed()
          .setTitle("อันดับ 5 คนเชิญเยอะที่สุด")
          .setDescription(replyText)
          .setColor("RANDOM")
      );
    });
  }
  if (commandName === "closebuy") {
    const user = msg.author.id;
    const name = "-" + user;
    const channel = msg.guild.channels.cache.find(ch => ch.name == name);
    msg.guild.channels.remove(name);
  }
});

client.login("Nzk1NDg2ODE4MTQ0NDg1Mzg2.X_KE1A.T9EVOoKI0Qc_XqtxrQMqixK61HA");
