exports.run = (client, message) => {

    if(!message.guild.voice || !message.guild.voice.connection) {
        message.channel.send('> ❌ **| Nem szól semmi...**');
    }
    else {
        client.dispatcher.emit('finish');
    }

};

exports.info = {

    name: 'skip',
    category: 'music',
    syntax: '',
    description: 'A következő zenére ugrik.',
    requiredPerm: null

};