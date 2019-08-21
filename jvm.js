const Discord = require('discord.js');
const client = new Discord.Client();
const util = require('util');
const {execSync} = require('child_process');
const config = require("./config.json");
client.config = config;

client.on('ready', () => {
    console.log(`~~~ Bejelentkezve mint: ${client.user.tag} ~~~`);
    client.user.setActivity('.parancsok')
})
.on('reconnecting', () => {
    console.log(`Újra csatlakozás...`)
})
.on('disconnected', () => {
    console.log(`Szétcsatlakoztatva!`)
});

const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text
};

client.on('message', message => { // Command handler
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args)
        console.log(`${command} parancs futtatva`)
    } catch (err) {
        if(err.code === "MODULE_NOT_FOUND") {
            console.error(`Hiba: ${command} nem egy létező parancs.`)
        } else {
            console.error(err)
        }
    }

})
    .on('guildMemberAdd', member => { // Welcome message
        if (member.guild.id === '584337831254818816') {
            console.log(`${member.user.tag} belépett a szerverbe.`)
            member.addRole('584408550365724672');
            member.send(`<:vidman_logo:588027207772012544> __**Üdvözöllek a szerveren!**__ Ahhoz, hogy belépj, ellenőriznünk kell, hogy nem vagy-e robot. Az \`${config.prefix}igazol\` parancs beírásával tudod magad igazolni az **<#584445312312147996>** csatornán. Mindenféleképpen olvasd el az **<#584671116472221709>** csatornát is értékes infókért!\n\n Sok sikert, és jó szórakozást!\n\n\n<:vidman_logo:588027207772012544> __${member.guild.name}__`)
        }
    });

client.login(config.token);
