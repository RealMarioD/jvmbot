const { MessageEmbed } = require('discord.js');
const { getEmoji } = require('../../util');

exports.run = (client, message) => {
    const animatedEmojis = ['jatekizeMerges', 'partyCat', 'dragonBrothersLaughing', 'dragonBrothersGlomp', 'dragonBrothersIdle', 'dragonStretchPlz', 'dragonTeaPlz', 'dragonBrothersSpif', 'dragonPokePlz', 'dragonNod2', 'slidingParrot', 'nitro', 'gimmeRight', 'blobHappy', 'gimmeLeft', 'popcornParrot', 'kannaNomPing', 'tickGreen', 'wumpusKeyboardSlam', 'tickRed', 'loading'];
    const vidmanHeadEmojis = ['vidmanOh', 'vidmanMeltatlan', 'vidmanAlmaa', 'vidmanSzomoru', 'vidmanUnott', 'vidmanSunyi', 'vidmanMerges', 'vidmanMivan', 'vidmanBruh', 'vidmanMosoly', 'vidmanVidam', 'vidmanThink', 'vidmanFel', 'vidmanFlushed', 'vidmanDerp', 'vidmanPing', 'vidmanMi', 'vidmanAggodik', 'vidmanGyanus', 'vidmanHuzottSzaj', 'vidmanElegans', 'vidmanReszeg', 'vidmanMeno', 'vidmanBeittasodni', 'vidmanMitortenik', 'vidmanSziv'];
    const otherVidmanEmojis = ['bazisugroKatica', 'ludolacra', 'onosz', 'leggitar', 'tengeriSzerzetes', 'ahune', 'ledusito', 'tebolyodott', 'veder', 'tengeriSzarvas', 'kenyer', 'krokodil1', 'krokodil2', 'krokodil3', 'kirannyda', 'jatekizeBoldog', 'alma', 'jatekizeSzomoru', 'vidmanOke', 'vidmanFeleZeneizator', 'vidmanAlmabaTekertVillanykorte', 'vidmanHmm', 'vidmanMacko', 'vidmanMichelin', 'vidmani', 'ticcs', 'sword', 'stick', 'vidmaniSzurke'];
    const vidmanEmojis3 = ['vidmanAlmos', 'vidmanWow', 'vidmanNagyonKoncentralDeNemBirja', 'vidmanTuzindito', 'vidmanLurk', 'vidmanHyperThink', 'vidmanFelcsut', 'vidmanJoker', 'tenorgifLogo', 'twitterLogo', 'youtubeLogo', 'giphyLogo', 'gfycatLogo', 'coubLogo', 'instagramLogo', 'facebookLogo', 'vidmanLogo', 'info', 'stop', 'figyelem', 'vidmanChristian', 'vidmanPanik', 'vidmanAsit', 'vidmanShrug' ];
    const other = ['vidmanTreff', 'vidmanPikk', 'pamkutya4ever', 'br', 'ping' ];
    for(let i = 0; i < animatedEmojis.length; i++) animatedEmojis[i] = `${getEmoji(animatedEmojis[i])}`;
    for(let i = 0; i < vidmanHeadEmojis.length; i++) vidmanHeadEmojis[i] = `${getEmoji(vidmanHeadEmojis[i])}`;
    for(let i = 0; i < otherVidmanEmojis.length; i++) otherVidmanEmojis[i] = `${getEmoji(otherVidmanEmojis[i])}`;
    for(let i = 0; i < other.length; i++) other[i] = `${getEmoji(other[i])}`;
    for(let i = 0; i < vidmanEmojis3.length; i++) vidmanEmojis3[i] = `${getEmoji(vidmanEmojis3[i])}`;
    const embed = new MessageEmbed()
        .setTitle('A szerveren használatos emotikonok')
        .addField('Vidman emotikonok #1', vidmanHeadEmojis.sort().join(' '))
        .addField('Vidman emotikonok #2', otherVidmanEmojis.sort().join(' '))
        .addField('Vidman emotikonok #3', vidmanEmojis3.sort().join(' '))
        .addField('Animált emotikonok', animatedEmojis.sort().join(' '))
        .addField('Egyéb emotikonok', other.sort().join(' '));
    message.channel.send(embed);
};

exports.info = {

    name: 'emotes',
    category: 'egyéb',
    syntax: '',
    description: 'Megmutatja, milyen emote-okat használhatsz a szerveren',
    requiredPerm: null,
    aliases: ['emojis']

};