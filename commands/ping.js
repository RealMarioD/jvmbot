exports.run = (client, message, args) => {
    let chance = Math.floor(Math.random() * 100) + 1;
    if (chance > 50) {
        message.channel.send('no.')
    } else {
        message.channel.send(`Pinging...`).then(msg => {
            msg.edit(`Pong! \`${(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}ms\``)
        }).catch(console.error);
    }
};

exports.info = {
    syntax: '',
    description: 'Megmondja a válaszidőt.'
};
