const { error } = require('../../util');
exports.run = (client, message) => {

    if(!message.guild.music || !client.voice.connections.get(message.guild.id)) return error('Nem szól semmi...', message);
    if(!message.member.voice.channel || message.member.voice.channelID != client.voice.connections.get(message.guild.id).channel.id) return error('Nem vagy egy voice channelben a bottal!', message);
    const mgm = message.guild.music;
    let emoji;
    if(!mgm.loop) {
        mgm.loop = 'song';
        emoji = '🔂 Egy szám';
    }
    else if(mgm.loop == 'song') {
        mgm.loop = 'queue';
        emoji = '🔁 Lista';
    }
    else if(mgm.loop == 'queue') {
        mgm.loop = null;
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

};