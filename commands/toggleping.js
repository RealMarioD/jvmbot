exports.run = (client, message) => {
    const config = require('../config.json');
    const hirlevelRole = message.guild.roles.get(config.hirlevelID);
    if (message.member.roles.has(config.fejlesztoID)) {
        if (hirlevelRole.mentionable === false) {
            hirlevelRole.setMentionable(true).then(() => message.channel.send('>>> A hírlevél role megpingelése: __**Engedélyezve**__'));
        }
        else {
            hirlevelRole.setMentionable(false).then(() => message.channel.send('>>> A hírlevél role megpingelése: __**Letiltva**__'));
        }
    }
};

exports.info = {
    syntax: '',
    description: 'Megváltoztatja a hírlevél role egy beállítását.',
    adminOnly: true
};