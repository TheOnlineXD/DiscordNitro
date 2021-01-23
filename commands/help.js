const Discord = require("discord.js");
const axios = require("axios");
const db = require("quick.db");
const math = require('mathjs');

module.exports = {
  name: "help",
  description: "Display all commands and descriptions",
  async execute(message, args, client, prefix) {
    let eb = await message.channel.send( new Discord.MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Ｌｏａｄｉｎｇ．．．', 'https://emoji.discord.st/emojis/8104LoadingEmote.gif')
    )
    if(!args[0]) return eb.edit( new Discord.MessageEmbed()
        .setColor('GREEN')
        .setAuthor('．．．'));
  }
};