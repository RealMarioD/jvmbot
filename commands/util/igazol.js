const { getEmoji, getMention } = require('../../util');
exports.run = (client, message) => {
    const member = message.guild.members.cache.get(message.author.id);
    if(member._roles.includes(client.config.roles.tag) !== true) {
        member.roles.add(client.config.roles.tag)
        .then(() => {
            message.author.send(`**Gratulálok, ${message.author.toString()}!**
            Mostmár láthatod a többi csatornát a szerveren és megkaptad a **Tag** rangot!
            **Olvasd el a ${getMention('691625689463521290')} csatornát is!**\n\nJelenleg ${message.guild.members.cache.size} tag van a szerveren!
            
            ${getEmoji('vidmanLogo')} __${message.guild.name}__`);
        });
    }
};

exports.info = {

    name: 'igazol',
    category: 'egyéb',
    syntax: '',
    description: 'Ellenőrző parancs a belépéskor.',
    requiredPerm: null

};
