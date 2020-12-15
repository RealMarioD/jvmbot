const { getDate, getEmoji, getChannel } = require('../util');
module.exports = (client, member) => {
    if(member.guild.id === client.config.serverID) {
        member.send(`${getEmoji('vidmanLogo')} __**Üdvözöllek a szerveren!**\n__Ahhoz, hogy belépj, ellenőriznünk kell, hogy nem vagy-e robot.\nAz \`${client.config.prefix}igazol\` parancs beírásával tudod magad igazolni az **${getChannel(client.config.channels.igazol)}** csatornán.\nMindenféleképpen olvasd el az **${getChannel('584671116472221709')}** csatornát is értékes infókért!\n\nSok sikert, és jó szórakozást!\n\n\n${getEmoji('vidmanLogo')} __${member.guild.name}__`)
        .then(() => console.log(`${member.user.tag} belépett a szerverbe. @ ${getDate(null)}`))
        .catch(() => console.log(`${member.user.tag} belépett a szerverbe, de nem kapott utasításokat. @ ${getDate()}`));
    }
};