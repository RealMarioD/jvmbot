const { MessageEmbed } = require('discord.js');
const { error, beautifyDuration } = require('../../util');
const { sortFields } = require('../../util');
exports.run = async (client, message) => {

    const list = new MessageEmbed();
    const fieldHolder = [];
    let passedMsg;

    const mgm = message.guild.music;

    if(!mgm || !mgm.queue.length) return error('A lejátszási lista üres!');
    let i = 0;
    list.setTitle(`Most szól:\n**${mgm.queue[i].title}**`)
        .setURL(mgm.queue[i].url)
        .setDescription(`__Feltöltő:__ [${mgm.queue[i].uploader.name}](${mgm.queue[i].uploader.channel_url})\n__Kérte:__ ${mgm.queue[i].requestedBy.tag}\n__Hossz:__ ${beautifyDuration(mgm.queue[i].length)}`)
        .setThumbnail(mgm.queue[i].thumbnail.url)
        .setFooter('', mgm.queue[i].uploader.thumbnails[mgm.queue[i].uploader.thumbnails.length - 1].url);

    for(i = 1; i < mgm.queue.length; i++) {
        fieldHolder.push({
            title: `__${i}:__ **${mgm.queue[i].title}**`,
            desc: `__Feltöltő:__ [${mgm.queue[i].uploader.name}](${mgm.queue[i].uploader.channel_url})\n__Kérte:__ ${mgm.queue[i].requestedBy.tag}\n__Hossz:__ ${beautifyDuration(mgm.queue[i].length)}\n**[Link](${mgm.queue[i].url})**`
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
            sortFields(0, list, fieldHolder, passedMsg, message);
        });

};

exports.info = {

    name: 'queue',
    category: 'music',
    syntax: '',
    description: 'Visszaadja a lejátszási listát.',
    requiredPerm: null,
    aliases: ['q']

};