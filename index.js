const express = require('express');
const app = express();
const passport = require('passport');
const { Strategy } = require('passport-discord');
require('dotenv').config()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const bodyparser = require('body-parser');
const session = require('express-session');

const path = require('path');
const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client({allowedMentions: {parse:[]}});

const fetch = require('node-fetch')

const { parser, htmlOutput, toHTML } = require('discord-markdown');
const discord_users = {}

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

let scopes = ['identify']

passport.use(new Strategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `${process.env.URL}/login`,
  scope: scopes
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    return done(null, profile);

  })
}))

app
.use(bodyparser.json())
.use(bodyparser.urlencoded({
  extended: true
}))
.engine("html", require('ejs').renderFile)
.use(express.static(path.join(__dirname, "/public")))
.set("views", path.join(__dirname, "views"))
.set("view engine", "ejs")
.use(session({
  secret: 'name',
  resave: false,
  saveUninitialized: false
}))
.use(passport.initialize())
.use(passport.session())
.use("/", require('./rutas/index'))
.use("/perfil", require('./rutas/perfil'))

.get('*', function(req, res) {
  res.send('Error 404!')
})

client.on('ready', () => {
  console.log('Estoy Listo');
})
/* Events Socket io */

 io.on('connection', socket => {
   socket.on('add message', function (data) {
     
     const body = JSON.stringify({
       allowed_mentions: {
         parse: []
       },
       content: data.content,
       username: data.username,
       avatar_url: data.avatarURL
     });

     let URLWH = `https://discord.com/api/v8/webhooks/${process.env.ID_WH}/${process.env.TOKEN_WH}`

     fetch(URLWH, {
       method: 'POST',
       body: body,
       headers: {
         'Content-Type': 'application/json'
       }
     });

     socket.broadcast.emit('add message', {
       content: data.content
     })
   })
 })


client.on('message', async message => {
  
  if (message.channel.id !== '781263477443395585') return;
  if (message.author.bot) return;

  let dataMSG = {
    content: toHTML(message.content, {
      discordCallback: {
        user: node => {
          return '@' + message.guild.members.resolve(node.id).displayName;
        },
        channel: node => {
          return '#'+ message.guild.channels.resolve(node.id).name;
        },
        role: node => {
          return '@'+ message.guild.roles.resolve(node.id).name;
        }
      },
      embed: true
    }),
    author: message.member.displayName,
    avatarURL: message.author.displayAvatarURL({format: 'png', dynamic: true, size: 1024}),
    id: message.author.id,
    date: message.createdAt.toLocaleDateString('es-ES'),
    colorName: message.member.displayHexColor
  }
  io.emit('new message', dataMSG)
  


})

server.listen('3030', function () {
  client.login(process.env.TOKEN_BOT)
  console.log('Listo, en el puerto 3030');
})

process.on("unhandledRejection", (r) => {
  console.dir(r);
});

