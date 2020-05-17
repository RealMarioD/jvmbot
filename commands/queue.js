const { MessageEmbed } = require('discord.js');
exports.run = async (client, message) => {

    const list = new MessageEmbed();

    if(!client.queue || client.queue.length == 0) {
        message.channel.send('A lejátszási lista üres!');
    }
    else {
        for (let i = 0; i < client.queue.length; i++) {
            if(i == 0) {
                list.setTitle(`__Most szól:__ **${client.queue[i].title}**`)
                    .setURL(client.queue[i].url)
                    .setDescription(`__Kérte:__ ${client.queue[i].author}`)
                    .setThumbnail(client.queue[i].videoThumbnail)
                    .setFooter(client.queue[i].channelName, client.queue[i].channelIcon);
            }
            else {
                list.addField(`__${i}:__ **${client.queue[i].title}**`, `__Feltöltő:__ **${client.queue[i].channelName}**\n__Kérte:__ **${client.queue[i].author}**\n**[Link](${client.queue[i].url})**`);
            }
        }
        message.channel.send(list);
    }
};

exports.info = {

    name: 'queue',
    category: 'music',
    syntax: '',
    description: 'Visszaadja a lejátszási listát.',
    requiredPerm: null

};