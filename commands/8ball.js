function magicBall() {
    const rand = ['Igen.', 'Kérdezd újra később..', 'Nem tudom.', 'Nem.', 'Lehet.', 'Valószínűleg nem.', 'Valószínűleg igen.', 'Talán.'];
    return rand[Math.floor(Math.random() * rand.length)];
}

exports.run = (client, message) => {
    message.channel.send(`>>> ${message.author.tag}, a válaszod:\n${magicBall()}`);
};

exports.info = {
    name: '8ball',
    syntax: '',
    description: 'Megválaszolja egy igen-nem kérdésed.',
};
