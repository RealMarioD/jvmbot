exports.run = (client, message) => {

    if(!message.guild.voice || !message.guild.voice.connection) return message.channel.send('Nem szól semmi...');
    client.dispatcher.pause();
    message.channel.send('> ⏸️ **| Zene szünetelve.**');

};

exports.info = {

    name: 'pause',
    category: 'music',
    syntax: '',
    description: 'Megállítja a visszajátszást.',
    requiredPerm: null

};