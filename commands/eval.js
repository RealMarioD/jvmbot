const { devOnly } = require('../util');
const config = require('../config.json');
const { inspect } = require('util');

exports.run = (client, message, args) => {

    if (message.member.roles.has(config.fejlesztoID)) {
        try {
            const input = args.join(' ');
            if(!input) return message.channel.send('`Error:`\n```Can\'t evalute air```');
            let output = eval(input);

            if(typeof output !== 'string') output = inspect(output, { depth: 0 });

            if(output.length > 1950) output = `${output.substr(0, 1950)} ...`;

            message.channel.send(`\`Output:\`\n\`\`\`js\n${output}\n\`\`\``);

        }
        catch(err) {
            message.channel.send(`\`Error:\`\n\`\`\`${err}\n\`\`\``);
        }

    }
    else {
        devOnly(message.channel);
    }
};

exports.info = {

    syntax: '<js kód>',
    description: 'Teszt parancs a fejlesztőknek.',
    adminOnly: true

};
