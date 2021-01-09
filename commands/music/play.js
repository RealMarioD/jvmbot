const { MessageEmbed } = require('discord.js'),
    { cmdUsage, play, error, beautifyDuration, getEmoji } = require('../../util'),
    ytdl = require('ytdl-core-discord'),
    ytsr = require('ytsr'),
    ytpl = require('ytpl');
exports.run = async (client, message, args) => {

    if(!args.length) cmdUsage(this, message);
    if(!message.member.voice.channelID) return error('Nem vagy bent egy voice channelben!', message);
    const connection = client.voice.connections.get(message.guild.id);
    if(connection && connection.channel.id != message.member.voice.channelID) return error('Nem ugyanabban a channelben vagyunk!', message);
    let ogMsg;
    const searchTerm = args.join(' ');
    if(!ytpl.validateID(searchTerm)) {
        if(!ytdl.validateURL(searchTerm)) {
            message.channel.send(`> ${getEmoji('loading').toString()} **| Keresés...**`)
            .then(async msg => {
                ogMsg = msg;
                await ytsr.getFilters(searchTerm)
                .then(async filters => handleFilters(filters))
                .catch(err => {
                    console.error(err);
                    error('Ismeretlen hiba, próbáld újra.', message);
                });
            });
        }
        else handlePlay(searchTerm);
    }
    else {
        message.channel.send(`> ${getEmoji('loading').toString()} **| Lista összesítése...** \`Ha nem történik semmi egy rövid időn belül, próbáld újra!\``)
        .then(async msg => {
            ogMsg = msg;
            await ytpl(searchTerm)
            .then(playlist => handlePlaylist(playlist))
            .catch(err => {
                console.error(err);
                error('Ismeretlen hiba történt, próbálj újra.', message);
            });
        });
    }

    if(!message.guild.music) {
        message.guild.music = {
            queue: [],
            dispatcher: null,
            loop: null
        };
    }
    const mgm = message.guild.music;

    function connect() {
        if(!connection) {
            message.guild.channels.cache.get(message.member.voice.channelID).join()
            .then(newConnection => {
                play(newConnection, message);
            });
        }
        else if(mgm.queue.length == 1) play(connection, message);
        else {
            const crQ = mgm.queue[mgm.queue.length - 1];
            const vidDuration = beautifyDuration(crQ.length);
            const musicEmbed = new MessageEmbed()
                .setAuthor(crQ.requestedBy.tag, crQ.requestedBy.displayAvatarURL({ format: 'png', dynamic: true }))
                .setTitle(crQ.title)
                .setURL(crQ.url)
                .setThumbnail(crQ.thumbnail.url)
                .setDescription('Hozzáadva a lejátszási listához.')
                .addField('Hossz:', vidDuration)
                .setFooter(crQ.uploader.name, crQ.uploader.thumbnail);

            if(!ogMsg) message.channel.send(musicEmbed);
            else ogMsg.edit('', musicEmbed);
        }
    }

    async function handlePlaylist(playlist) {
        playlist.items.forEach(videoInfo => {
            message.guild.music.queue.push({
                url: videoInfo.shortUrl,
                title: videoInfo.title,
                uploader: {
                    name: videoInfo.author.name,
                    thumbnail: null,
                    url: videoInfo.author.url
                },
                thumbnail: videoInfo.bestThumbnail.url,
                length: videoInfo.durationSec,
                requestedBy: message.author
            });
        });
        ogMsg.edit(`> 🛂 **| \`${playlist.items.length}\` szám hozzáadva a lejátszási listához.**`);
        if(!connection) {
            message.guild.channels.cache.get(message.member.voice.channelID).join()
            .then(newConnection => {
                play(newConnection, message);
            });
        }
    }

    async function handlePlay(url) {
        const videoInfo = await ytdl.getBasicInfo(url);

        mgm.queue.push({
            url: url,
            title: videoInfo.videoDetails.title,
            uploader: {
                name: videoInfo.videoDetails.author.name,
                thumbnail: videoInfo.videoDetails.author.thumbnails[videoInfo.videoDetails.author.thumbnails.length - 1].url,
                url: videoInfo.videoDetails.author.channel_url
            },
            thumbnail: videoInfo.videoDetails.thumbnails[videoInfo.videoDetails.thumbnails.length - 1].url,
            length: videoInfo.videoDetails.lengthSeconds,
            requestedBy: message.author
        });

        connect();
    }

    async function handleFilters(filters) {
        const filter = filters.get('Type').get('Video');
        const options = {
            safeSearch: false,
            pages: 1,
        };
        ytsr(filter.url, options)
        .then(results => handleResults(results))
        .catch(err => {
            console.error(err);
            error('Ismeretlen hiba történt, próbáld újra', message);
        });
    }

    function handleResults(results) {
        if(!results.items.length) return ogMsg.edit(`> ${getEmoji('vidmanHyperThink')} **| Nincs találat.**`);
        const foundEmbed = new MessageEmbed().setTitle(`${getEmoji('vidmanThink')} **| Találatok**`);
        const foundURLs = [];
        for(let i = 0; i < results.items.length; i++) if(!results.items[i].title) results.items.splice(i, 1);
        let j = 5;
        if(results.items.length < 5) j = results.items.length;
        let crRes;
        for(let i = 0; i < j; i++) {
            crRes = results.items[i];
            foundURLs.push(crRes.url);
            foundEmbed.addField(`**${i + 1}.:** ${crRes.title}`, `__Feltöltő:__ ${crRes.author.name}\n**Hossz:** ${crRes.duration}${!crRes.uploadedAt ? '' : `\n${crRes.uploadedAt}`}`);
        }
        ogMsg.edit('', foundEmbed)
        .then(() => {
            ogMsg.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const number = parseInt(collected.first().content);
                if(isNaN(number) || number > 5 || number < 1) return ogMsg.edit(new MessageEmbed().setTitle(`${getEmoji('vidmanPanik')} **| Visszavonva.**`));
                handleResult(results.items[number - 1]);
            })
            .catch(() => {
                return ogMsg.edit(new MessageEmbed().setTitle(`${getEmoji('vidmanAlmos')} **| Lejárt a válaszidő.**`));
            });
        });
    }

    function handleResult(videoInfo) {
        const durationArray = videoInfo.duration.split(':');
        let durationSeconds = 0;
        for(let i = 0; i < durationArray.length; i++) {
            if(durationArray.length == 3) { // meaning hh:mm:ss
                switch(i) {
                    case 0:
                        durationSeconds += parseInt(durationArray[i]) * 60 * 60;
                        break;
                    case 1:
                        durationSeconds += parseInt(durationArray[i]) * 60;
                        break;
                    case 2:
                        durationSeconds += parseInt(durationArray[i]);

                }
            }
            else {
                switch(i) {
                    case 0:
                        durationSeconds += parseInt(durationArray[i]) * 60;
                        break;
                    case 1:
                        durationSeconds += parseInt(durationArray[i]);
                        break;
                }
            }
        }
        mgm.queue.push({
            url: videoInfo.url,
            title: videoInfo.title,
            uploader: {
                name: videoInfo.author.name,
                thumbnail: videoInfo.author.bestAvatar.url,
                url: videoInfo.author.url
            },
            thumbnail: videoInfo.bestThumbnail.url,
            length: durationSeconds,
            requestedBy: message.author
        });

        connect();
    }

};

exports.info = {

    name: 'play',
    category: 'music',
    syntax: '<link|keresett zene>',
    description: 'YouTube zenéket játszik le.',
    requiredPerm: null,
    aliases: ['p']

};