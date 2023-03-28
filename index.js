const {Client, LocalAuth} = require("whatsapp-web.js")
const transaltor = require('google-translate-api')
const qrcode = require('qrcode')
const fs = require('fs')
const {chatGPTHandler} = require('./Provider/ChatGPT')
const express = require('express')
const app = express()
const {createServer} = require('http')
const { Server } = require('socket.io') 

const server = createServer(app)
const io = new Server(server)

app.use('/static', express.static(`${__dirname}/public`))
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: `${__dirname}/views`})
})


const client = new Client({
    authStrategy: new LocalAuth()
})




const response = {    
    fitur: `
Winbot fitur

1. to ask me a question (type *bot {your question}*)
2. Fitur Winbot (type *winbot fitur*)
3. Tentang Winbot (type *about winbot*)

    `,

    about_bot: `
Name: Winbot
System version: 1.0
Prosessor: Intel Core I7 Gen 11
RAM: 32GB
Storage: 1TB SSD
OS: Windows 11
Developer: Windi DEV
    `
}

client.on('message', async msg => {
    let isGroupChat = msg.id.participant ? true : false

    let pesan = msg.body.toLowerCase()

    if (pesan == "winbot fitur") {
        msg.reply(response.fitur)
    }else if (pesan == "about winbot") {
        msg.reply(response.about_bot)
    }else if (pesan.includes("bot")) {
        msg.reply("sedang diproses tunggu sebentar")
        let cmd = pesan.replace('bot', "")
        await chatGPTHandler(cmd, msg)
    }else {
        if (!isGroupChat) {
            msg.reply("Hello sir, how can i help you ?\nType *winbot fitur* to see what features I have and how to use them. ")
        }
    }
})

client.initialize()

let msg = 'Connecting . . .'

io.on('connection', socket => {
    socket.emit('msg', msg)

    client.on("qr", (qr) => {
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit('qr', url)
            socket.emit('msg', 'QR Received, scan please!')
        })
    })

    client.on('ready', () => {
        msg = 'Server Whatsapp is Ready.'
        socket.emit('ready', true)
        socket.emit('msg', msg)
    })

    client.on('authenticated', () => {
        socket.emit('auth', true)
    })

    client.on('auth_failure', () => {
        msg = "auth failure, restarting server"
        socket.emit('msg', msg)
    })

})

// client.on('groupJoin', async notification => {
//     const chat = await client.getChatById(notification.chatId);
//     const welcomeMessage = `
//     Hello, group members! I am a bot, nice to meet you all
//     My Fitur : \n
//     ${response.fitur}
//     `;
//     await chat.sendMessage(welcomeMessage);
// });


server.listen(3000, () => console.log("Server is running on port 3000 . . ."))