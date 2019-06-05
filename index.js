global.config = require('./config.js');
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const client = new commando.Client({
	owner: config.owners,
	commandPrefix: config.prefix,
	unknownCommandResponse: false,
	disableEveryone: true
});
const path = require('path');

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('ready', () => {
		var date = new Date();
		client.user.setActivity('JustVidman | .help', {
			type: "WATCHING"
		}),
		client.user.setStatus(config.Status)
		console.log(`${client.user.tag}`.blue)
		console.log(`Successfully logged in!\n${date}`.green)
	})
	.on('guildCreate', g => {
		var date = new Date();
		console.log(`Joined server ${g.name}[${g.id}] at ${date}`)
	})
	.on('guildDelete', g => {
		var date = new Date();
		console.log(`Left server ${g.name}[${g.id}] at ${date}`)
	})
	.on('disconnect', () => {
		var date = new Date();
		console.warn(`Disconnected! ${date}`);
	})

	.on('reconnecting', () => {
		var date = new Date();
		console.warn(`Reconnecting... ${date}`);
	})

	.on('commandError', (cmd, err) => {
		if (err instanceof commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		var date = new Date();
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}, at ${date}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		var date = new Date();
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}. at ${date}
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		var date = new Date();
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}. at ${date}
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		var date = new Date();
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}. at ${date}
		`);
	})
	.on('commandRun', (command, promise, msg) => {
		var date = new Date();
		console.log(oneLine`
			${command.name}
			ran in ${!msg.guild ? 'DMs' : msg.guild.name}, ${!msg.guild ? '' : msg.guild.id}
			by user ${msg.author.tag}, ${msg.author.id}
			at ${date}
		`)
	});

client.registry
	.registerDefaultTypes()
	.registerDefaultGroups()
	.registerDefaultCommands({
		help: false,
	})
	.registerGroups([
		['fun', 'Fun'],
		['util', 'Utilities'],
		['admin', 'Admin Only']
	])
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config.token);