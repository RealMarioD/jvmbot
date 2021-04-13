const { MessageEmbed } = require('discord.js');
const { findMember } = require('../../util');

exports.run = (client, message, args) => {
    let toPing;
    if(args.length > 0) toPing = findMember(args[0], message, true);
    if(toPing) {
        const pingEmbed = new MessageEmbed().setDescription(`Pingelés... ${toPing.toString()}👀`);
        return message.channel.send(pingEmbed).then(msg => {
            const filter = m => m.author.id == toPing.id;
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                if(collected.first().content.startsWith('.pong')) pingEmbed.description = `${toPing.toString()} sikeresen válaszolt ${collected.first().createdTimestamp - message.createdTimestamp}ms alatt!`;
                else pingEmbed.description = `${toPing.toString()} hibásan válaszolt ${collected.first().createdTimestamp - message.createdTimestamp}ms alatt! Nem valami jó szolgáltatás.`;
                msg.edit(pingEmbed);
            })
            .catch(() => {
                pingEmbed.description = `${toPing.tag} nem válaszolt! Nem valami jó szolgáltatás.`;
                msg.edit(pingEmbed);
            });
        });
    }
    message.channel.send('Pingelés...')
    .then(msg => {
        msg.edit(`Pong! \`${(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}ms\``);
    });
};

exports.info = {

    name: 'ping',
    category: 'egyéb',
    syntax: [
        { syn: '[tag]', desc: 'Nem egy "easter egg" minigame... 👀' }
    ],
    description: 'Megmondja a válaszidőt.',
    requiredPerm: null
};