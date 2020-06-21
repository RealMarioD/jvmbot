exports.run = (client, message) => {

    if(!message.guild.voice || !message.guild.voice.connection) return message.channel.send('Nem szól semmi...');
    if(!message.member.voice || message.member.voice.channel.id != client.dispatcher.player.voiceConnection.channel.id) return message.channel.send('> ❌ **| Nem vagy egy voice channelben a bottal!**');
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
    requiredPerm: null,
    aliases: ['st']

};