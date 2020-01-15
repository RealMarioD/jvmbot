const { getDate, getEmoji, getMention } = require('../util.js');
module.exports = (client, member) => {
    if (member.guild.id === client.config.serverID) {
        console.log(`${member.user.tag} belépett a szerverbe. @ ${getDate()}`);
        member.send(`${getEmoji(client, 'vidmanLogo')} __**Üdvözöllek a szerveren!**\n__Ahhoz, hogy belépj, ellenőriznünk kell, hogy nem vagy-e robot.\nAz \`${client.config.prefix}igazol\` parancs beírásával tudod magad igazolni az **${getMention(client.config.igazolID)}** csatornán.\nMindenféleképpen olvasd el az **${getMention(client.config.udvozlegyID)}** csatornát is értékes infókért!\n\nSok sikert, és jó szórakozást!\n\n\n${getEmoji(client, 'vidmanLogo')} __${member.guild.name}__`);
    }
};