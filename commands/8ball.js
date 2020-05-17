function magicBall() {
    const rand = ['Igen.', 'Kérdezd újra később..', 'Nem tudom.', 'Nem.', 'Lehet.', 'Valószínűleg nem.', 'Valószínűleg igen.', 'Talán.'];
    return rand[Math.floor(Math.random() * rand.length)];
}

exports.run = (client, message, args) => {
    if(args.length != 0) {
        message.channel.send(`>>> ${message.author.tag}, a válaszod:\n${magicBall()}`);
    }
    else {
        message.channel.send(`>>> ${message.author.tag}, nem adtál meg kérdést!`);
    }
};

exports.info = {

    name: '8ball',
    category: 'szórakozás',
    syntax: '',
    description: 'Megválaszolja egy igen-nem kérdésed.',
    requiredPerm: null

};
