const { inspect } = require('util');

exports.run = (client, message, args) => {

    try {
        const input = args.join(' ');
        if(input.includes('exec') || input.includes('child_process')) return message.channel.send('haha no');
        if(!input) return message.channel.send('`Error:`\n```Can\'t evalute air```');
        let output = eval(input);

        if(typeof output !== 'string') output = inspect(output, { depth: 0 });

        if(output.length > 1950) output = `${output.substr(0, 1950)} ...`;

        message.channel.send(`\`Output:\`\n\`\`\`js\n${output}\n\`\`\``);

    }
    catch(err) {
        message.channel.send(`\`Error:\`\n\`\`\`${err}\n\`\`\``);
    }

};

exports.info = {

    name: 'eval',
    category: 'dev',
    syntax: '<js kód>',
    description: 'Teszt parancs a fejlesztőknek.',
    requiredPerm: 'developer'

};
