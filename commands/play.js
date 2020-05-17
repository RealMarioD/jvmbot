const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const { play, getEmoji } = require('../util');
const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args) => {

    if(!message.member.voice.channel) return message.channel.send('Nem vagy bent egy voice channelben sem!');
    if(args.length == 0) return message.channel.send('Nem adtál meg egy linket!');
    if(!ytdl.validateURL(args[0])) {
        let ogMsg;
        message.channel.send(`> ${getEmoji(client, 'loading').toString()} **| Keresés...**`).then(msg => ogMsg = msg);
        const searchTerm = args.join(' ');
        ytsr.getFilters(searchTerm, (err, filters) => handleFilters(err, filters, searchTerm, ogMsg));
    }
    else {
        handlePlay(args[0]);
    }

    function handleFilters(err, filters, searchTerm, ogMsg) {
        if(err) return ogMsg.edit('> ❌ **| Hiba történt, próbáld újra.**');
        const filter = filters.get('Type').find(o => o.name == 'Video');
        const options = {
            limit: 5,
            nextpageRef: filter.ref
        };
        ytsr(searchTerm, options, (err, results) => handleResults(err, results, ogMsg));
    }

    function handleResults(err, results, ogMsg) {
        if(err) return console.error(err);
        if(results.items.length == 0) return ogMsg.edit('> ❌ **| Nincs találat.**');
        const foundEmbed = new MessageEmbed().setTitle('<:vidmanThink:596083281405935644> **| Találatok**');
        const foundURLs = [];
        let j = 5;
        if(results.items.length < 5) j = results.items.length;
        for(let i = 0; i < j; i++) {
            foundURLs.push(results.items[i].link);
            foundEmbed.addField(`**${i + 1}**`, `__**Cím:**__ ${results.items[i].title}\n__**Feltöltő:**__ ${results.items[i].author.name}\n${results.items[i].uploaded_at}`);
        }
        ogMsg.edit('', foundEmbed).then(msg => {
            msg.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 60000 })
            .then(collected => {
                const number = parseInt(collected.first().content);
                if(isNaN(number)) return ogMsg.edit(new MessageEmbed().setTitle('❌ **| Nem számot adtál meg.**'));
                if(number > 5 || number < 1) return ogMsg.edit(new MessageEmbed().setTitle('❌ **| Hibás számot adtál meg.**'));
                handlePlay(foundURLs[number - 1], ogMsg);
            });
        });
    }

    function handlePlay(URL, ogMsg) {
        ytdl.getBasicInfo(URL, (err, info) => {
            client.queue.push({
                'url': URL,
                'title': info.title,
                'videoThumbnail': info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length - 1].url,
                'channelName': info.author.name,
                'channelIcon': info.author.avatar,
                'author': message.author.tag
            });
            if(!message.guild.voice || !message.guild.voice.connection) {
                const vc = message.member.voice.channel;
                vc.join().then(connection => {
                    play(connection, client, message, ogMsg);
                });
            }
            else if(ogMsg) {
                ogMsg.edit('', new MessageEmbed()
                    .setDescription('Hozzáadva a lejátszási listához.')
                    .setTitle(info.title)
                    .setURL(URL)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setFooter(info.author.name, info.thumbnail_url)
                    .setThumbnail(client.queue[client.queue.length - 1].videoThumbnail)
                );
            }
            else {
                message.channel.send('', new MessageEmbed()
                    .setDescription('Hozzáadva a lejátszási listához.')
                    .setTitle(info.title)
                    .setURL(URL)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setFooter(info.author.name, info.thumbnail_url)
                    .setThumbnail(client.queue[client.queue.length - 1].videoThumbnail)
                );
            }
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