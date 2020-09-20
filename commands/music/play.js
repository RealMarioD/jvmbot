const ytdl = require('ytdl-core-discord');
const ytsr = require('ytsr');
const ytpl = require('ytpl');
const { play, getEmoji } = require('../../util');
const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args) => {

    if(!message.member.voice.channel) return message.channel.send('> ❌ **| Nem vagy bent egy voice channelben sem!**');
    if(args.length == 0) return message.channel.send('> ❌ **| Nem adtál meg egy linket!**');

    const searchTerm = args.join(' ');
    let ogMsg;

    if(!ytdl.validateURL(searchTerm)) {
        if(!ytpl.validateID(searchTerm)) {
            message.channel.send(`> ${getEmoji('loading').toString()} **| Keresés...**`).then(msg => {
                ogMsg = msg;
                ytsr.getFilters(searchTerm)
                    .then(filters => handleFilters(filters))
                    .catch(() => sendErrorMsg('filters'));
            });
        }
        else {
            message.channel.send(`> ${getEmoji('loading').toString()} **| Lista összesítése...**`)
            .then(msg => {
                ogMsg = msg;
                ytpl(searchTerm)
                    .then(result => handlePlaylist(result))
                    .catch();
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

    function sendErrorMsg(devInfo) {
        return ogMsg.edit(`> ❌ **| Hiba történt, próbáld újra.**\n\`dev info: @${devInfo}\``);
    }

    function handleFilters(filters) {
        const filter = filters.get('Type').find(type => type.name == 'Video');
        const options = {
            safeSearch: false,
            limit: 5,
            nextpageRef: filter.ref
        };
        ytsr(searchTerm, options)
            .then(results => handleResults(results))
            .catch(() => sendErrorMsg('ytsr'));
    }

    function handleResults(results) {
        if(!results.items.length) return ogMsg.edit(`> ${getEmoji('vidmanHyperThink')} **| Nincs találat.**`);
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
                    return ogMsg.edit(new MessageEmbed().setTitle(`${getEmoji('vidmanPanik')} **| Visszavonva.**`));
                }
                handlePlay(foundURLs[number - 1]);
            })
            .catch(() => {
                return ogMsg.edit(new MessageEmbed().setTitle(`${getEmoji('vidmanAlmos')} **| Lejárt a válaszidő.**`));
            });
        });
    }

    function handlePlay(URL) {
        ytdl.getBasicInfo(URL)
        .then(info => {
            let seconds = info.videoDetails.lengthSeconds;
            let minutes = `${Math.floor(info.videoDetails.lengthSeconds / 60)}`;
            seconds = `${parseInt(seconds) - parseInt(minutes) * 60}`;
            if(minutes.length < 2) minutes = `0${minutes}`;
            if(seconds.length < 2) seconds = `0${seconds}`;

            client.queue.push({
                'url': URL,
                'title': info.videoDetails.title,
                'videoThumbnail': info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length - 1].url,
                'channelName': info.videoDetails.author.name,
                'channelIcon': info.videoDetails.author.avatar,
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
                    .setTitle(info.videoDetails.title)
                    .setURL(URL)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setFooter(info.videoDetails.author.name, info.thumbnail_url)
                    .setThumbnail(client.queue[client.queue.length - 1].videoThumbnail)
                );
            }
        })
        .catch(() => sendErrorMsg('ytdl.getBasicInfo'));
    }

    async function handlePlaylist(playlist) {
        await playlist.items.forEach(item => {
            ytdl.getBasicInfo(item.url_simple)
                .then(info => addToQueue(info, item.url_simple))
                .catch();
        });
        if(!message.guild.voice || !message.guild.voice.connection) {
            const vc = message.member.voice.channel;
            vc.join().then(connection => {
                play(connection, message);
            });
        }
        ogMsg.edit(`> 🛂 **| \`${playlist.items.length}\` szám hozzáadva a lejátszási listához.**`);
    }

    function addToQueue(info, itemURL) {
        let seconds = info.videoDetails.lengthSeconds;
        let minutes = `${Math.floor(info.videoDetails.lengthSeconds / 60)}`;
        seconds = `${parseInt(seconds) - parseInt(minutes) * 60}`;
        if(minutes.length < 2) minutes = `0${minutes}`;
        if(seconds.length < 2) seconds = `0${seconds}`;

        client.queue.push({
            'url': itemURL,
            'title': info.videoDetails.title,
            'videoThumbnail': info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length - 1].url,
            'channelName': info.videoDetails.author.name,
            'channelIcon': info.videoDetails.author.avatar,
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
    requiredPerm: null,
    aliases: ['p', 'pl']

};