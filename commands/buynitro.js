const Discord = require("discord.js");
const axios = require("axios");
const db = require("quick.db");
const math = require('mathjs');

module.exports = {
  name: "buynitro",
  description: "Display all commands and descriptions",
  async execute(message, args, client, prefix) {
    let eb = await message.channel.send( new Discord.MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Ｌｏａｄｉｎｇ．．．', 'https://emoji.discord.st/emojis/8104LoadingEmote.gif')
    )
    const stocknitro = db.get('nitro.stock')
    const point = db.get(`point.${message.author.id}`)
    if(!args[0]) return eb.edit( new Discord.MessageEmbed()
        .setColor('GREEN')
        .setAuthor('กรุณาใส่จำนวนเงิน．．．'));
    if(args[0] > stocknitro) return eb.edit( new Discord.MessageEmbed()
        .setColor('RED')
        .setAuthor('สต๊อกหมดแล้วนะครับ．．．'));
    const resp = math.evaluate(`150 * ${args[0]}`)
    if(resp > point) return eb.edit( new Discord.MessageEmbed()
        .setColor('BLUE')
        .setAuthor('เงินของท่านไม่เพียงพอ')
        .setFooter(`เงินของท่านมี ${point}`));
    const wekhook = new Discord.WebhookClient('802393901864321044', 'CNrdpVWSTv248Y6fRj3Mm_jEwFWaVSeE1VohM8inyxRSA2xu2P4opctDVlJ4AaMnFkM8');
    eb.edit( new Discord.MessageEmbed()
        .setColor('BLUE')
        .setAuthor('ส่ง nitro ไปยังส่วนตัวแล้ว')
        .setFooter(`เงินของท่านคงเหลือ ${point}`))
    wekhook.send(`${message.author}, ได้เติม Nitro 3 เดือนเข้าตัวเองแล้ว`)
  }
};