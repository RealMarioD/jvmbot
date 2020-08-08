exports.run = (client, message) => {
    message.channel.send('Pingelés...').then(msg => {
        msg.edit(`Pong! \`${(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}ms\``);
    });
};

exports.info = {

    name: 'ping',
    category: 'egyéb',
    syntax: '',
    description: 'Megmondja a válaszidőt.',
    requiredPerm: null
};