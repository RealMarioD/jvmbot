exports.run = (client, message) => {

    if(!message.guild.voice || !message.guild.voice.connection) return message.channel.send('Nem szól semmi...');
    if(!message.member.voice || message.member.voice.channel.id != client.dispatcher.player.voiceConnection.channel.id) return message.channel.send('> ❌ **| Nem vagy egy voice channelben a bottal!**');
    let emoji;
    if(!client.loop) {
        client.loop = 'song';
        emoji = '🔂';
    }
    else if(client.loop == 'song') {
        client.loop = 'queue';
        emoji = '🔁';
    }
    else if(client.loop == 'queue') {
        client.loop = null;
        emoji = '➡️';
    }
    message.channel.send(`> ${emoji} **| Ismétlés átállítva.**`);

};

exports.info = {

    name: 'loop',
    category: 'music',
    syntax: '',
    description: 'Ismétel egy zenét vagy listát.',
    requiredPerm: null,
    aliases: ['l', 'lp']

};