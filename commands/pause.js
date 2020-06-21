exports.run = (client, message) => {

    if(!message.guild.voice || !message.guild.voice.connection) return message.channel.send('Nem szól semmi...');
    if(!message.member.voice || message.member.voice.channel.id != client.dispatcher.player.voiceConnection.channel.id) return message.channel.send('> ❌ **| Nem vagy egy voice channelben a bottal!**');
    client.dispatcher.pause();
    message.channel.send('> ⏸️ **| Zene szünetelve.**');

};

exports.info = {

    name: 'pause',
    category: 'music',
    syntax: '',
    description: 'Megállítja a visszajátszást.',
    requiredPerm: null,
    aliases: ['ps', 'paus']

};