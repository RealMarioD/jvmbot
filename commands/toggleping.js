exports.run = (client, message) => {
    const hirlevelRole = message.guild.roles.get(client.config.hirlevelID);
    if (message.member.roles.has(client.config.fejlesztoID)) {
        if (hirlevelRole.mentionable === false) {
            hirlevelRole.setMentionable(true).then(() => message.channel.send('>>> A hírlevél role megpingelése: __**Engedélyezve**__'));
        }
        else {
            hirlevelRole.setMentionable(false).then(() => message.channel.send('>>> A hírlevél role megpingelése: __**Letiltva**__'));
        }
    }
};

exports.info = {

    name: 'toggleping',
    syntax: '',
    description: 'Megváltoztatja a hírlevél role egy beállítását.',
    requiredPerm: 'developer'

};