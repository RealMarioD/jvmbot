const { getEmoji, getMention } = require('../util');
exports.run = (client, message) => {
    const member = message.guild.members.cache.get(message.author.id);
    if(member._roles.includes(client.config.tagID) !== true) {
        member.roles.add(client.config.tagID).then(() => {
            message.author.send(`**Gratulálok, ${message.author.toString()}!**\nMostmár láthatod a többi csatornát a szerveren és megkaptad a **Tag** rangot!\n**Olvasd el a ${getMention(client.config.szabalyokID)} csatornát is!**\n\nJelenleg ${message.guild.members.cache.size} tag van a szerveren!\n\n${getEmoji('vidmanLogo')} __${message.guild.name}__`);
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
