const { MessageEmbed } = require('discord.js');
exports.run = (client, message) => {

    const np = client.queue[0];

    if(!message.guild.voice || !message.guild.voice.connection) return message.channel.send('Nem szól semmi...');
    message.channel.send(new MessageEmbed().setTitle(`**${np.title}**`)
        .setURL(np.url)
        .setAuthor(np.author.tag, np.author.displayAvatarURL({ format: 'png', dynamic: true }))
        .addField('**Hossz:**', np.duration)
        .setThumbnail(np.videoThumbnail)
        .setFooter(np.channelName, np.channelIcon)
    );

};

exports.info = {

    name: 'nowplaying',
    category: 'music',
    syntax: '',
    description: 'Megmutatja az éppen szóló zenét.',
    requiredPerm: null

};