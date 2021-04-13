const { getDate, getEmoji } = require('../util');
const { log, pardon } = require('../moderationHandler');
module.exports = (client, member) => {
    if(Date.now() - member.user.createdTimestamp < 604800000 && !pardon.includes(member.id)) {
        member.send(`${getEmoji('figyelem')} __**Figyelem!**__\nFiókod túl fiatal, ezért sajnos __kitiltásra kerültél!__\n\n**Viszont:** Ha szeretnéd, személyesen igazolhatod magad. Jelöld be a szerver adminisztrátorát, Mario_D#7052-t ismerősnek, válts vele pár szót és ha minden jól megy a kitiltás vissza lesz vonva.`)
        .then(() => member.ban({ days: 7, reason: '7 napnál fiatalabb acc' }))
        .catch(() => member.ban({ days: 7, reason: '7 napnál fiatalabb acc' }));
        log('Ban', client.user, member, '7 napnál fiatalabb acc');
    }
    else if(member.guild.id == client.config.serverID && client.user.id == client.config.normalID) {
        member.send(`${getEmoji('vidmanLogo')} __**Üdvözöllek a szerveren!**\n__Ahhoz, hogy belépj, ellenőriznünk kell, hogy nem vagy-e robot.\nAz \`${client.config.prefix}igazol\` parancs beírásával tudod magad igazolni az **<#${client.config.channels.igazol}>** csatornán.\nMindenféleképpen olvasd el az **<#584671116472221709>** csatornát is értékes infókért!\n\nSok sikert, és jó szórakozást!\n\n\n${getEmoji('vidmanLogo')} __${member.guild.name}__`)
        .then(() => console.log(`GUILDMEMBERADD: <${member.user.tag} (${member.user.id})> @ ${getDate(null)}`))
        .catch(() => console.log(`GUILDMEMBERADD: <${member.user.tag} (${member.user.id})> FAILED TO SEND VERIFINFO @ ${getDate()}`));
    }
};