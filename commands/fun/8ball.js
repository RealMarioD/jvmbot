exports.run = (client, message, args) => {
    args = args.join(' ');
    let total = 0;
    function magicBall() {
        const rand = ['Igen.', 'Kérdezd újra később..', 'Nem tudom.', 'Nem.', 'Lehet.', 'Valószínűleg nem.', 'Valószínűleg igen.', 'Talán.'];
        for(let i = 0; i < args.length; i++) total += args.charCodeAt(i);
        return rand[Math.floor(total % rand.length)];
    }

    if(args.length !== 0) message.channel.send(`>>> ${message.author.tag}, a válaszod:\n${magicBall()}`);
    else message.channel.send(`>>> ${message.author.tag}, nem adtál meg kérdést!`);
};

exports.info = {

    name: '8ball',
    category: 'szórakozás',
    syntax: '<kérdés>',
    description: 'Megválaszolja egy igen-nem kérdésed.',
    requiredPerm: null,
    aliases: ['8', '8b', '8bal']

};
