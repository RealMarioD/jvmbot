const Discord = require('discord.js');
const client = new Discord.Client();
const util = require('util')
const { execSync } = require('child_process')
const config = require("./config.json");
client.config = config

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const clean = text => {
    if(typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
    else
        return text
}

client.on('message', message => { // Command handler
    if(!message.content.startsWith(config.prefix)) return

    const args = message.content.slice(1).trim().split(/ +/g)
    const command = args.shift().toLowerCase()

    try {
        let commandFile = require(`./commands/${command}.js`)
        commandFile.run(client, message, args)
    } catch(err) {
        message.channel.send({embed: {color: 0xff0000, title: `Nem találtam a parancsot (${config.prefix}${command}). \nHasználd: \`\`${config.prefix}parancsok\`\``}})
    }

})
    .on('guildMemberAdd', member => { // Welcome message
        if(member.guild.id === '584337831254818816') {
            member.addRole('584408550365724672')
            member.send(`<:vidman_logo:584352979818250257> __**Üdvözöllek a szerveren!**__ Én <@${client.user.id}> vagyok, egy **Bot** vagyok, a szervert szolgálom. A szerveren jelenleg egy csatornát látsz az #igazolás -t. Ahhoz, hogy belépj, ellenőriznünk kell, hogy nem vagy-e robot, ezt **ott** teheted meg, az ".igazol" parancs beírásával! Sok sikert, és jó szórakozást!\n\n\n<:vidman_logo:584352979818250257> __${member.guild.name}__`)
        }
    })

client.login(config.token);
