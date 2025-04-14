// carico il modulo express
const express = require('express');
const port = 3000;
const server = express();
server.use(express.json());

// Aggiungi CORS per permettere richieste dal tuo form HTML
const cors = require('cors');
server.use(cors());

// importo il modulo 'dotenv', servirà per caricare le variabili definiti dentro i file .env e .env.local e renderle disponibili tramite process.env
const dotenv = require('dotenv');

// dico a dotenv di caricare le variabile del file .env dentro process.env
dotenv.config();
// dico a dotenv di caricare le variabili del file .env dentro .env.local e se ci sono variabili sovrasciri quelle di .env
dotenv.config({path: 'env.local', override: true})

const path = require('path');

const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))

bot.hears('hi', (ctx) => {
    console.log(ctx.message.chat)
    ctx.reply('Hey there')
})

bot.launch()

// NUOVO ENDPOINT: Chiamata POST per il form di registrazione utente
server.post('/form-data', async (req, res) => {
    try {
        console.log('Dati form ricevuti:', req.body);
        
        // Formatta il messaggio per Telegram
        const messaggio = `
            📝 Contatto Utente 📝

    👤 Nome: ${req.body.nome}
    👤 Cognome: ${req.body.cognome}
    📱 Cellulare: ${req.body.cellulare}
    🏠 Indirizzo: ${req.body.indirizzo}
    🆔 Codice Fiscale: ${req.body.cf}
    📧 Email: ${req.body.email}
    📧 Oggetto: ${req.body.oggetto}
    📧 Messaggio: ${req.body.messaggio}
    🏙️ Provincia: ${req.body.provincia}
    🏙️ Comune: ${req.body.comune_nome}
`;
        
        // Invia il messaggio tramite il bot Telegram
        await bot.telegram.sendMessage(process.env.BOT_CHAT_ID, messaggio);
        
        // Risposta al client
        res.json({ 
            success: true, 
            message: 'Dati inviati con successo al bot Telegram' 
        });
    } catch (error) {
        console.error('Errore nell\'invio dei dati al bot Telegram:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ora lo avvio sulla porta indicata da "port"
server.listen(port, () => {
    console.log('server in ascolto!')
});