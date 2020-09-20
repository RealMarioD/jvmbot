exports.run = (client, message) => {

    if(!message.guild.voice || !message.guild.voice.connection) return message.channel.send('Nem szól semmi...');
    if(!message.member.voice.channel || message.member.voice.channel.id != client.dispatcher.player.voiceConnection.channel.id) return message.channel.send('> ❌ **| Nem vagy egy voice channelben a bottal!**');
    let emoji;
    if(!client.loop) {
        client.loop = 'song';
        emoji = '🔂 Egy szám';
    }
    else if(client.loop == 'song') {
        client.loop = 'queue';
        emoji = '🔁 Lista';
    }
    else if(client.loop == 'queue') {
        client.loop = null;
        emoji = '➡️ Nincs ismétlés';
    }
    message.channel.send(`> ✅ **| Ismétlés átállítva: ${emoji}**`);

};

exports.info = {

    name: 'loop',
    category: 'music',
    syntax: '',
    description: 'Ismétel egy zenét vagy listát.',
    requiredPerm: null,
    aliases: ['l', 'lp']

};