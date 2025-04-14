// carico il modulo express
const express = require('express');
const port = 3000;
const server = express();
server.use(express.json());

// importo il modulo 'dotenv', servirà per caricare le variabili definiti dentro i file .env e .env.local e renderle disponibili tramite process.env
const dotenv = require('dotenv');

// dico a dotenv di caricare le variabile del file .env dentro process.env
dotenv.config();
// dico a dotenv di caricare le variabili del file .env dentro .env.local e se ci sono variabili sovrasciri quelle di .env
dotenv.config({path: 'env.local', override: true})

const path = require('path');
const fs = require('fs');7
const axios = require('axios');

const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
};

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('SILEA', (ctx) => ctx.reply('SILEA ESPLODEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE'))
bot.hears('piedi', (ctx) => ctx.reply('GUSTOSI'))

bot.hears('hi', (ctx) => {
    console.log(ctx.message.chat)
    ctx.reply('Hey there')
})

bot.on('message', async (ctx, next) => {
    const photoArray = ctx.message.photo;
    
    if (!photoArray) {
        next();
    }

    const largestPhoto = photoArray[photoArray.length - 1];

    const file = await ctx.telegram.getFile(largestPhoto.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

    const fileName = `${Date.now}_${largestPhoto.file_id}.jpg`;
    const filePath = path.join(uploadDir, fileName)

    // Scarico la foto
})

bot.launch()

// Chiamata POST richiesta form contatto
server.post('/contact', (req, res) => {
    console.log(req.body);
    bot.telegram.sendMessage(process.env.BOT_CHAT_ID, `Contatto\nNome: ${req.body.name}\nEmail: ${req.body.email}\nTelefono: ${req.body.tel}\n\nMessaggio: ${req.body.text}`)
    res.send("Ok")
});

// ora lo avvio sulla porta indicata da "port"
server.listen(port, () => {
    console.log('server in ascolto!')
});