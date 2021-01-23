const Discord = require("discord.js");
const axios = require("axios");
const db = require("quick.db");
const math = require("mathjs");
module.exports = {
  name: "topup",
  description: "Display all commands and descriptions",
  async execute(message, args, client, prefix) {
    const point = db.get(`point.${message.author.id}`)
    const mobileNumber = '0956722707'
    let eb = await message.channel.send( new Discord.MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Ｌｏａｄｉｎｇ．．．', 'https://emoji.discord.st/emojis/8104LoadingEmote.gif')
    )
    let arg = args.join(' ').split(/([/, =])/);
    let Code = arg[10]
    if (!Code) return eb.edit(new Discord.MessageEmbed()
    .setColor('RED')
    .setAuthor('มีข้อผิดพลาด', 'https://emoji.discord.st/emojis/03453b44-c38b-420f-8c8e-2e614d663dbd.png')
    .setDescription('**ข้อความ : **กรุณาพิมพ์ '+ prefix +'topup (ลิงค์ซองอังเปา)')
    .setThumbnail('https://gift.truemoney.com/campaign/static/media/gift_small.be16b489.png')
    .setTimestamp()
)
    let VERIFY_URL = 'https://gift.truemoney.com/campaign/vouchers/' + Code + '/verify';
    let REDEEM_URL = 'https://gift.truemoney.com/campaign/vouchers/' + Code + '/redeem';
    let Verify = await axios.get(VERIFY_URL)
      switch (Verify.data.status.code) {
        case 'VOUCHER_NOT_FOUND':
          eb.edit(
              new Discord.MessageEmbed()
                    .setColor('RED')
                    .setAuthor('มีข้อผิดพลาด', 'https://emoji.discord.st/emojis/03453b44-c38b-420f-8c8e-2e614d663dbd.png')
                    .setDescription('**ข้อความ : **ไม่พบซองอังเปา \n **Code : **' + Code)
                    .setThumbnail('https://gift.truemoney.com/campaign/static/media/gift_small.be16b489.png')
                    .setTimestamp()
            )
            break;
          case 'VOUCHER_OUT_OF_STOCK':
            eb.edit(
                new Discord.MessageEmbed()
                    .setColor('RED')
                    .setAuthor('มีข้อผิดพลาด', 'https://emoji.discord.st/emojis/03453b44-c38b-420f-8c8e-2e614d663dbd.png')
                    .setDescription('**ข้อความ : **ซองอังเปาถูกใช้งานไปแล้ว \n **Code : **' + Code)
                    .setThumbnail('https://gift.truemoney.com/campaign/static/media/gift_small.be16b489.png')
                    .setTimestamp()
            )
            break;
          case undefined:
            eb.edit(
                new Discord.MessageEmbed()
                    .setColor('RED')
                    .setAuthor('มีข้อผิดพลาด', 'https://emoji.discord.st/emojis/03453b44-c38b-420f-8c8e-2e614d663dbd.png')
                    .setDescription('**ข้อความ : **ไม่พบซองอังเปา \n **Code : **' + Code)
                    .setThumbnail('https://gift.truemoney.com/campaign/static/media/gift_small.be16b489.png')
                    .setTimestamp()
            )
            break;
          case 'SUCCESS':
            var data = JSON.stringify({"mobile":""+ mobileNumber +"","voucher_hash":""+ args +""});
            var config = {
               method: 'post',
               url: REDEEM_URL,
               headers: { 
                 'Content-Type': 'application/json'
               },
               data : data
             };
             
             axios(config)
             .then(function (response) {
               console.log(JSON.stringify(response.data.data.link +' | '+ response.data.data.redeemed_amount_baht));
               eb.edit(
                   new Discord.MessageEmbed()
                   .setColor('BLUE')
                   .setAuthor('เติมเงินสำเร็จ', 'https://emoji.discord.st/emojis/77ba453a-8bc9-4763-bc49-e6a663fd509d.gif')
                   .setDescription('**'+ message.author.username +' : **ได้เติมเงินจำนวน **'+ response.data.data.voucher.redeemed_amount_baht +' บาท**')
                   .setThumbnail('https://gift.truemoney.com/campaign/static/media/gift_small.be16b489.png')
                   .setTimestamp()
                   
               ).then(channel => {
                 const resp = math.evaluate(`${point} + ${response.data.data.voucher.redeemed_amount_baht}`)
                 db.set(`point.${message.author.id}`, resp)
               });
               
             })
             .catch(function (error) {
               console.log(error);
             });
             break;
      }
            
        
  }
};