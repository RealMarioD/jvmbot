const { MessageEmbed } = require('discord.js');
const { error, beautifyDuration } = require('../../util');
exports.run = (client, message) => {

    if(!message.guild.music || !client.voice.connections.get(message.guild.id)) return error('Nem szól semmi...', message);
    const crQ = message.guild.music.queue[0];
    const streamSeconds = message.guild.music.dispatcher.streamTime / 1000;
    const currentTime = beautifyDuration(streamSeconds);
    const fillRate = Math.floor(streamSeconds / crQ.length * 10);
    let percentHolder = '';
    for(let i = 0; i < 10; i++) {
        if(i <= fillRate) percentHolder += '⬜';
        else percentHolder += '🔳';
    }
    message.channel.send(new MessageEmbed()
        .setAuthor(crQ.requestedBy.tag, crQ.requestedBy.displayAvatarURL({ format: 'png', dynamic: true }))
        .setTitle(crQ.title)
        .setURL(crQ.url)
        .setThumbnail(crQ.thumbnail.url)
        .setDescription(`**▬▬▬▬**${currentTime}/${beautifyDuration(crQ.length)}**▬▬▬▬**\n${percentHolder}`)
        .setFooter(crQ.uploader.name, crQ.uploader.thumbnails[crQ.uploader.thumbnails.length - 1].url)
    );
};

exports.info = {

    name: 'nowplaying',
    category: 'music',
    syntax: '',
    description: 'Megmutatja az éppen szóló zenét.',
    requiredPerm: null,
    aliases: ['np']

};