exports.run = (client, message) => {

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