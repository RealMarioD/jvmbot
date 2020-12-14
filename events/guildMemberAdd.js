const { getDate, getEmoji, getMention } = require('../util');
module.exports = (client, member) => {
    if(member.guild.id === client.config.serverID) {
        member.send(`${getEmoji('vidmanLogo')} __**Üdvözöllek a szerveren!**\n__Ahhoz, hogy belépj, ellenőriznünk kell, hogy nem vagy-e robot.\nAz \`${client.config.prefix}igazol\` parancs beírásával tudod magad igazolni az **${getMention(client.config.igazolID)}** csatornán.\nMindenféleképpen olvasd el az **${getMention(client.config.udvozlegyID)}** csatornát is értékes infókért!\n\nSok sikert, és jó szórakozást!\n\n\n${getEmoji('vidmanLogo')} __${member.guild.name}__`)
        .then(() => console.log(`${member.user.tag} belépett a szerverbe. @ ${getDate(null)}`))
        .catch(() => console.log(`${member.user.tag} belépett a szerverbe, de nem kapott utasításokat. @ ${getDate()}`));
    }
};