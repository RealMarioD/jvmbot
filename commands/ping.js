exports.run = (client, message) => {
    message.channel.send('Pingelés...').then(msg => {
        msg.edit(`Pong! \`${(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}ms\``);
    }).catch(console.error);
};

exports.info = {

    name: 'ping',
    syntax: '',
    description: 'Megmondja a válaszidőt.',
    requiredPerm: null
};
