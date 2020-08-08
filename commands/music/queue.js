const { MessageEmbed } = require('discord.js');
exports.run = async (client, message) => {

    const list = new MessageEmbed();
    const fieldHolder = [];
    let startIndex = 0;
    let passedMsg;

    if(!client.queue || client.queue.length == 0) {
        message.channel.send('A lejátszási lista üres!');
    }
    else {
        for(let i = 0; i < client.queue.length; i++) {
            if(i == 0) {
                list.setTitle(`Most szól:\n**${client.queue[i].title}**`)
                    .setURL(client.queue[i].url)
                    .setDescription(`__Feltöltő:__ ${client.queue[i].channelName}\n__Kérte:__ ${client.queue[i].author.tag}\n__Hossz:__ ${client.queue[i].duration}`)
                    .setThumbnail(client.queue[i].videoThumbnail)
                    .setFooter('', client.queue[i].channelIcon);
            }
            else {
                fieldHolder.push({
                    title: `__${i}:__ **${client.queue[i].title}**`,
                    desc: `__Feltöltő:__ ${client.queue[i].channelName}\n__Kérte:__ ${client.queue[i].author.tag}\n__Hossz:__ ${client.queue[i].duration}\n**[Link](${client.queue[i].url})**`
                });
            }
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
            sortFields(startIndex);
        });

    }

    function sortFields(start) {
        list.spliceFields(0, 5);
        let j = start;
        if(j >= fieldHolder.length) j = fieldHolder.length - 5;
        let stopIndex = start + 5;
        if(stopIndex > fieldHolder.length) {
            stopIndex = fieldHolder.length;
        }
        const pages = Math.ceil(fieldHolder.length / 5);
        const pageOf = Math.ceil(j / 5) + 1;
        for(j; j < stopIndex; j++) {
            list.addField(fieldHolder[j].title, fieldHolder[j].desc);
        }
        list.setFooter(`Oldal: ${pageOf}/${pages}`);
        passedMsg.edit('', list);
        startAwait();
    }

    function startAwait() {
        const filter = (reaction, user) => reaction.emoji.name == '⬅️' || reaction.emoji.name == '➡️' && user.id == message.author.id;
        passedMsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collection => handleReactions(collection));
    }

    function handleReactions(collection) {
        switch(collection.first()._emoji.name) {
            case '⬅️':
                if(startIndex == 0) {
                    startAwait();
                }
                else {
                    startIndex = startIndex - 5;
                    sortFields(startIndex);
                }
                break;

            case '➡️':
                if(startIndex + 5 >= fieldHolder.length) {
                    startAwait();
                }
                else {
                    startIndex = startIndex + 5;
                    sortFields(startIndex);
                }
                break;
            default:
                startAwait();
                break;
        }
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