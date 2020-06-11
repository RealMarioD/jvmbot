exports.run = (client, message) => {

    try {
        message.guild.voice.connection.disconnect();
    }
    catch(err) {
        return;
    }
    client.dispatcher = {};
    client.queue = [];
    message.channel.send('> ⏹️ **| Zene megállítva és lista törölve.**');

};

exports.info = {

    name: 'stop',
    category: 'music',
    syntax: '',
    description: 'Megállítja a zenét.',
    requiredPerm: null

};