exports.run = async (client, message, args) => {

    const ytdl = require('ytdl-core');
    const { play } = require('../util');
    if(!message.member.voice.channel) return message.channel.send('Nem vagy bent egy voice channelben sem!');
    if(args.length == 0) return message.channel.send('Nem adtál meg egy linket!');
    if(ytdl.validateURL(args[0]) == false) return message.channel.send('Hibás linket adtál meg.');
    if(!message.guild.voice || !message.guild.voice.connection) {
        const vc = message.member.voice.channel;
        vc.join().then(connection => {
            play(connection, args[0], client, message);
        });
    }
    else {
        client.queue[0].push(args[0]);
        ytdl.getBasicInfo(args[0], (err, info) => {
            client.queue[1].push(info.title);
            message.channel.send(`Hozzáadva a lejátszási listához: **${info.title}**`);
        });
    }

};

exports.info = {

    name: 'play',
    category: 'music',
    syntax: '<link>',
    description: 'Lejátszik egy zenét.',
    requiredPerm: null

};