const { inspect } = require('util');
const { cmdUsage } = require('../../util');

exports.run = async (client, message, args) => {

    try {
        if(!args.length) return cmdUsage(this, message);
        let depth = 0;
        if(args[0].startsWith('depth')) {
            depth = parseInt(args[0].charAt(5));
            if(isNaN(depth)) depth = 0;
            args.shift();
        }
        const input = args.join(' ');
        let output = await eval('(async () => {' + input + '})()');

        if(typeof output !== 'string') output = inspect(output, { depth: depth });

        if(output.length > 1950) output = `${output.substr(0, 1950)} ...`;

        message.channel.send(`\`Output:\`\n\`\`\`js\n${output}\n\`\`\``);

    }
    catch(err) {
        if(err.length > 1950) message.channel.send(`${err.substr(0, 1950)} ...`);
        else message.channel.send(`\`Error:\`\n\`\`\`${err}\n\`\`\``);
    }

};

exports.info = {

    name: 'eval',
    category: 'dev',
    syntax: '<js kód>',
    description: 'Teszt parancs a fejlesztőknek.',
    requiredPerm: 'developer'

};
