const { getDate, getEmoji } = require('../util');
const { log } = require('../moderationHandler');
module.exports = (client, member) => {
    if(Date.now() - member.user.createdTimestamp < 604800000) {
        member.send(`${getEmoji('figyelem')} __**Hiba!**__\n\nFiókod túl fiatal, ezért sajnos még nem engedhetlek be a szerverre! Kérlek próbálj meg később újra belépni!`)
        .then(() => {
            member.ban({ days: 7, reason: '7 napnál fiatalabb acc' })
            .then(() => {
                member.guild.members.unban(member.id);
            });
        })
        .catch(() => {
            member.ban({ days: 7, reason: '7 napnál fiatalabb acc' })
            .then(() => {
                member.guild.members.unban(member.id);
            });
        });
        log('Softban', client.user, member, '7 napnál fiatalabb acc');
    }
    else if(member.guild.id == client.config.serverID) {
        member.send(`${getEmoji('vidmanLogo')} __**Üdvözöllek a szerveren!**\n__Ahhoz, hogy belépj, ellenőriznünk kell, hogy nem vagy-e robot.\nAz \`${client.config.prefix}igazol\` parancs beírásával tudod magad igazolni az **<#${client.config.channels.igazol}>** csatornán.\nMindenféleképpen olvasd el az **<#584671116472221709>** csatornát is értékes infókért!\n\nSok sikert, és jó szórakozást!\n\n\n${getEmoji('vidmanLogo')} __${member.guild.name}__`)
        .then(() => console.log(`GUILDMEMBERADD: <${member.user.tag} (${member.user.id})> @ ${getDate(null)}`))
        .catch(() => console.log(`GUILDMEMBERADD: <${member.user.tag} (${member.user.id})> FAILED TO SEND VERIFINFO @ ${getDate()}`));
    }
};