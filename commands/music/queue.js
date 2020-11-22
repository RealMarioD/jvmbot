const { MessageEmbed } = require('discord.js');
const { sortFields } = require('../../util');
exports.run = async (client, message) => {

    const list = new MessageEmbed();
    const fieldHolder = [];
    const startIndex = 0;
    let passedMsg;

    if(!client.queue || client.queue.length == 0) {
        message.channel.send('A lejátszási lista üres!');
    }
    else {
        let i = 0;
        list.setTitle(`Most szól:\n**${client.queue[i].title}**`)
            .setURL(client.queue[i].url)
            .setDescription(`__Feltöltő:__ ${client.queue[i].channelName}\n__Kérte:__ ${client.queue[i].author.tag}\n__Hossz:__ ${client.queue[i].duration}`)
            .setThumbnail(client.queue[i].videoThumbnail)
            .setFooter('', client.queue[i].channelIcon);

        for(i = 1; i < client.queue.length; i++) {
            fieldHolder.push({
                title: `__${i}:__ **${client.queue[i].title}**`,
                desc: `__Feltöltő:__ ${client.queue[i].channelName}\n__Kérte:__ ${client.queue[i].author.tag}\n__Hossz:__ ${client.queue[i].duration}\n**[Link](${client.queue[i].url})**`
            });
        }

        message.channel.send('Kérlek várj...')
        .then(msg => {
            passedMsg = msg;
            if(!fieldHolder.length) {
                list.setFooter('Oldal: 1/1');
                return passedMsg.edit('', list);
            }
            msg.react('⬅️');
            msg.react('➡️');
            sortFields(startIndex, list, fieldHolder, passedMsg, message);
        });

    }

};

exports.info = {

    name: 'queue',
    category: 'music',
    syntax: '',
    description: 'Visszaadja a lejátszási listát.',
    requiredPerm: null,
    aliases: ['q']

};