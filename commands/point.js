const Discord = require("discord.js");
const axios = require("axios");
const db = require("quick.db");
const math = require("mathjs");

module.exports = {
  name: "point",
  description: "Display all commands and descriptions",
  async execute(message, args, client, prefix) {
    const point = db.get(`point.${message.author.id}`)
    message.reply(`คุณมีพ้อยทั้งหมด ${point}`)
  }
};