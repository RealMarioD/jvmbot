const Discord = require('discord.js');
const client = new Discord.Client();
const util = require('util');
const {execSync} = require('child_process');
const config = require("./config.json");
const {getMention, getEmoji, getDate} = require("./util");
client.config = config;

client.on('ready', () => {
    console.log(`~~~ Bejelentkezve mint: ${client.user.tag} ~~~ @ ${getDate()}`);
    client.user.setActivity('.parancsok');
})
.on('reconnecting', () => {
    console.log(`Újracsatlakozás... @ ${getDate()}`)
})
.on('disconnected', () => {
    console.log(`Szétcsatlakoztatva! @${getDate()}`)
});

const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text
};

client.on('message', message => {
    if (!message.content.startsWith(config.prefix)) return; // Command handler

    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args);
        console.log(`${command} parancs futtatva @ ${getDate()}`)
    } catch (err) {
        if(err.code === "MODULE_NOT_FOUND") {
            console.error(`Hiba: ${command} nem egy létező parancs. @ ${getDate()}`)
        } else {
            console.error(err)
        }
    }

})
    .on('guildMemberAdd', member => { // Welcome message
        if (member.guild.id === config.serverID) {
            console.log(`${member.user.tag} belépett a szerverbe. @ ${getDate()}`);
            member.addRole(config.ideiglenestagID).then(() => member.send(`${getEmoji(client, "vidman_logo")} __**Üdvözöllek a szerveren!**
            __ Ahhoz, hogy belépj, ellenőriznünk kell, hogy nem vagy-e robot.
             Az \`${config.prefix}igazol\` parancs beírásával tudod magad igazolni az **${getMention(config.igazolID)}** csatornán.
              Mindenféleképpen olvasd el az ***${getMention(config.udvozlegyID)}** csatornát is értékes infókért!\n\n
               Sok sikert, és jó szórakozást!\n\n\n${getEmoji(client, "vidman_logo")} __${member.guild.name}__`));

        }
    });

client.login(config.token);
