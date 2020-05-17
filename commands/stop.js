exports.run = (client, message) => {

    if(!message.guild.voice || !message.guild.voice.connection) {
        message.channel.send('Nem szól semmi...');
    }
    else {
        message.guild.voice.connection.disconnect();
        client.dispatcher = {};
        client.queue = [];
        message.channel.send('Zene megállítva.');
    }

};

exports.info = {

    name: 'stop',
    category: 'music',
    syntax: '',
    description: 'Megállítja a zenét.',
    requiredPerm: null

};