const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');
const { play, getEmoji } = require('../util');
const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args) => {

    if(!message.member.voice.channel) return message.channel.send('> ❌ **| Nem vagy bent egy voice channelben sem!**');
    if(args.length == 0) return message.channel.send('> ❌ **| Nem adtál meg egy linket!**');

    const searchTerm = args.join(' ');
    let ogMsg;

    if(!ytdl.validateURL(searchTerm)) {
        if(!ytpl.validateURL(searchTerm)) {
            message.channel.send(`> ${getEmoji('loading').toString()} **| Keresés...**`).then(msg => {
                ogMsg = msg;
                ytsr.getFilters(searchTerm, (err, filters) => handleFilters(err, filters));
            });
        }
        else {
            message.channel.send(`> ${getEmoji('loading').toString()} **| Lista összesítése...**`)
            .then(msg => {
                ogMsg = msg;
                ytpl(searchTerm, (err, result) => handlePlaylist(err, result));
            });
        }
    }
    else {
        message.channel.send(`> ${getEmoji('loading').toString()} **| Betöltés...**`)
        .then(msg => {
            ogMsg = msg;
            handlePlay(searchTerm);
        });
    }

    function handleFilters(err, filters) {
        if(err) return ogMsg.edit('> ❌ **| Hiba történt, próbáld újra.**');
        const filter = filters.get('Type').find(type => type.name == 'Video');
        const options = {
            limit: 5,
            nextpageRef: filter.ref
        };
        ytsr(searchTerm, options, (err, results) => handleResults(err, results));
    }

    function handleResults(err, results) {
        if(err) return console.error(err);
        if(results.items.length == 0) return ogMsg.edit(`> ${getEmoji('vidmanHyperThink')} **| Nincs találat.**`);
        const foundEmbed = new MessageEmbed().setTitle(`${getEmoji('vidmanThink')} **| Találatok**`);
        const foundURLs = [];
        let j = 5;
        if(results.items.length < 5) j = results.items.length;
        for(let i = 0; i < j; i++) {
            foundURLs.push(results.items[i].link);
            foundEmbed.addField(`**${i + 1}.:** ${results.items[i].title}`, `**Feltöltő:** ${results.items[i].author.name}\n**Hossz:** ${results.items[i].duration}\n${results.items[i].uploaded_at}`);
        }
        ogMsg.edit('', foundEmbed).then(() => {
            ogMsg.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const number = parseInt(collected.first().content);
                if(isNaN(number) || number > 5 || number < 1) {
                    return ogMsg.edit(new MessageEmbed().setTitle(`${getEmoji('vidmanSzomoru')} **| Visszavonva.**`));
                }
                handlePlay(foundURLs[number - 1]);
            })
            .catch(() => {
                return ogMsg.edit(new MessageEmbed().setTitle(`${getEmoji('vidmanAlmos')} **| Lejárt a válaszidő.**`));
            });
        });
    }

    function handlePlay(URL) {
        ytdl.getBasicInfo(URL, (err, info) => {
            if(err) return console.error(err);
            let seconds = info.length_seconds;
            let minutes = Math.floor(info.length_seconds / 60);
            seconds -= minutes * 60;
            if(minutes.length < 2) minutes = `0${minutes}`;
            if(seconds.length < 2) seconds = `0${seconds}`;

            client.queue.push({
                'url': URL,
                'title': info.title,
                'videoThumbnail': info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length - 1].url,
                'channelName': info.author.name,
                'channelIcon': info.author.avatar,
                'author': message.author,
                'duration': `${minutes}:${seconds}`
            });
            if(!message.guild.voice || !message.guild.voice.connection) {
                const vc = message.member.voice.channel;
                vc.join().then(connection => {
                    play(connection, message, ogMsg);
                });
            }
            else {
                ogMsg.edit('', new MessageEmbed()
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

    async function handlePlaylist(err, playlist) {
        if(err) return ogMsg.edit('> ❌ **| Hiba történt, próbáld újra.**');
        await playlist.items.forEach(item => {
            ytdl.getBasicInfo(item.url_simple, (err, info) => addToQueue(err, info, item.url_simple));
        });
        if(!message.guild.voice || !message.guild.voice.connection) {
            const vc = message.member.voice.channel;
            vc.join().then(connection => {
                play(connection, message);
            });
        }
        ogMsg.edit(`> 🛂 **| \`${playlist.items.length}\` szám hozzáadva a lejátszási listához.**`);
    }

    function addToQueue(err, info, itemURL) {
        if(err) return console.error(err);
        let seconds = info.length_seconds;
        const minutes = Math.floor(info.length_seconds / 60);
        seconds -= minutes * 60;
        client.queue.push({
            'url': itemURL,
            'title': info.title,
            'videoThumbnail': info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length - 1].url,
            'channelName': info.author.name,
            'channelIcon': info.author.avatar,
            'author': message.author,
            'duration': `${minutes}:${seconds}`
        });
    }
};

exports.info = {

    name: 'play',
    category: 'music',
    syntax: '<link vagy keresett YT videó>',
    description: 'Lejátszik egy zenét.',
    requiredPerm: null

};