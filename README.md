# Discord.js Bot

โหลด Discord.js `npm install discord.js`

# Discord.js Index

สร้างไฟล์ index.js แล้ววางด้านล่างนี้
```
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login('token บอทตัวเอง');
```

# Discord.js Run
กดรัน `node index.js`