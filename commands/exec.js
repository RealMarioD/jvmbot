const exec = require('child_process').exec;

exports.run = (client, message, args) => {

    if(args.length == 0) {message.channel.send('> Nem adtál meg parancsot.');}
    else {
        const code = args.join(' ');
        let msg = '';
        exec(code, (err, out) => {
            if(err) {
                msg += `Error:\n\`\`\`${err}\`\`\`\n`;
            }
            if(out) {
                msg += `Output:\n\`\`\`${out}\`\`\``;
            }
            message.channel.send(msg);
        });
    }
};

exports.info = {

    name: 'exec',
    syntax: '<kód>',
    description: 'A console-t lehet kezelni ezzel a paranccsal.',
    requiredPerm: 'developer'

};