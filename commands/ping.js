exports.run = (client, message) => {
    message.channel.send('Pinging...').then(msg => {
        msg.edit(`Pong! \`${(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}ms\``);
    }).catch(console.error);
};

exports.info = {
    syntax: '',
    description: 'Megmondja a válaszidőt.'
};
