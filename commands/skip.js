exports.run = (client, message) => {

    if(!message.guild.voice || !message.guild.voice.connection) {
        message.channel.send('Nem szól semmi...');
    }
    else if(!client.queue[0][1]) {
        message.channel.send('Nincs következő szám!');
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