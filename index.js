// fs is Node's native file system modul
const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');
// add config and prefix
const {
	prefix,
	token,
} = require('./config.json');
// create a new Discord client
const client = new Discord.Client();
const scraper = require('google-search-scraper');
const DeathByCaptcha = require('deathbycaptcha');
const testClass = require('./commands/helper.js');
const nodeyourmeme = require('nodeyourmeme');
const imdb = require('imdb-api');
const quora = require('quora-api');
const request = require('request');
const argv = require('yargs').argv;
const hltb = require('howlongtobeat');
const hltbService = new hltb.HowLongToBeatService();
const headsOrTails = require('@plokidesigns/heads-or-tails');
const rollAnything = require('roll-anything');

// This next step is how you'll dynamically retrieve all your newly created command files. Add this below your client.commands line:
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// The fs.readdirSync() method will return an array of all the file names in that directory, e.g. ['ping.js', 'beep.js']. The filter is there to make sure any non-JS files are left out of the array. With that array, you can loop over it and dynamically set your commands to the Collection you made above.
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);

}
// const newUsers = [];
const cooldowns = new Discord.Collection();
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	client.user.setActivity(`Servicing ${client.guilds.size} servers`);
	console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
});

// client.on('guildCreate', guild => {
// 	// This event triggers when the bot joins a guild.
// 	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
// 	client.user.setActivity(`Serving ${client.guilds.size} servers`);
// });

// client.on('guildDelete', guild => {
// 	// this event triggers when the bot is removed from a guild.
// 	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
// 	client.user.setActivity(`Serving ${client.guilds.size} servers`);
// });

// client.on('guildMemberAdd', (member) => {
// 	const guild = member.guild;
// 	if (!newUsers[guild.id]) newUsers[guild.id] = new Discord.Collection();
// 	newUsers[guild.id].set(member.id, member.user);
//
// 	if (newUsers[guild.id].size > 10) {
// 		const userlist = newUsers[guild.id].map(u => u.toString()).join(' ');
// 		guild.channels.find(channel => channel.name === 'general').send('Welcome our new users!\n' + userlist);
// 		newUsers[guild.id].clear();
// 	}
// });

// client.on('guildMemberRemove', (member) => {
// 	const guild = member.guild;
// 	if (newUsers[guild.id].has(member.id)) newUsers.delete(member.id);
// });

// Listening for messages
client.on('message', message => {
	// If the message either doesn't start with the prefix or was sent by a bot, exit early.
	// Create an args variable that slices off the prefix entirely and then splits it into an array by spaces.
	// reate a command variable by calling args.shift(), which will take the first element in array and return it while also removing it from the original array (so that you don't have the command name string inside the args array).
	
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const input = message.content;

	if (message.content.startsWith(prefix + 'flipcoin')) {
		const userInput = input.substr('8');
		if (message.content.endsWith(userInput)) {
			try {
				// console.log('success', res);
				const titles = headsOrTails().toUpperCase();

				const embed = {
					'title': `${titles}`,
					'color': 14274056,
					'thumbnail': {
						'url': 'https://img2.pngio.com/coin-toss-heads-or-tails-coin-flip-png-free-transparent-png-coin-flip-png-820_780.png',
					},
				};
				message.channel.send({
					embed,
				});
			}
			catch(err) {
				message.channel.send(err, 'No results, check your spelling first');
			}
		}
		else {
			message.channel.send('No results, check your spelling first');
		}
	}

	if (message.content.startsWith(prefix + 'roll()')) {
		const userInput = input.substr('7');
		if (message.content.endsWith(userInput)) {
			try {
				// console.log('success', res);
				const titles = headsOrTails().toUpperCase();

				const embed = {
					'title': `${titles}`,
					'color': 14274056,
					'thumbnail': {
						'url': 'https://img2.pngio.com/coin-toss-heads-or-tails-coin-flip-png-free-transparent-png-coin-flip-png-820_780.png',
					},
				};
				message.channel.send({
					embed,
				});
			}
			catch(err) {
				message.channel.send(err, 'No results, check your spelling first');
			}
		}
		else {
			message.channel.send('No results, check your spelling first');
		}
	}

	// Know your Meme
	// console.log(input);
	if (message.content.startsWith(prefix + 'kym')) {
		const userInput = input.substr('4');
		if (message.content.endsWith(userInput)) {

			nodeyourmeme.search(userInput).then(res => {
				// console.log('success', res);
				const titles = (res.name);
				const descriptions = (res.about);

				const embed = {
					'title': `${titles}`,
					'color': 14274056,
					'description': `${descriptions}`,
					'footer': {
						'icon_url': `${testClass.baseEmbedTemplate()[1]}`,
						'text': `${testClass.baseEmbedTemplate()[0]}`,
					},
					'thumbnail': {
						'url': 'https://i.kym-cdn.com/photos/images/newsfeed/001/170/526/3db.png',
					},
					'fields': [
						{
							'name': `${testClass.baseEmbedTemplate()[3]}`,
							'value': `${testClass.baseEmbedTemplate()[2]}`,
						},
					],
					'author': {
						'name': 'f00d',
					},
				};
				message.channel.send({
					embed,
				});
			}).catch(() => {
				message.channel.send('No results, check your spelling first');
			});
		}
		else {
			message.channel.send('No results, check your spelling first');
		}
	}

	// How Long to Beat

	if (message.content.startsWith(prefix + 'hltb')) {
		const userInput = input.substr('5');
		if (message.content.endsWith(userInput)) {
			hltbService.search(userInput).then(res => {
				const titles = (res[0].name);
				const gameplayMain = (res[0].gameplayMain);
				const imagePoster = (res[0].imageUrl);
				const gameplayCompletionist = (res[0].gameplayCompletionist);
				const gameplayMainExtra = (res[0].gameplayMainExtra);
				const embed = {
					'title': `${titles}`,
					'color': 14274056,
					'footer': {
						'icon_url': `${testClass.baseEmbedTemplate()[1]}`,
						'text': `${testClass.baseEmbedTemplate()[0]}`,
					},
					'thumbnail': {
						'url': 'https://howlongtobeat.com/img/hltb_brand.png',
					},
					'image': {
						'url':`${imagePoster}`,
					},
					'fields': [
						{
							'name': 'GamePlay Main: ',
							'value': `${gameplayMain}`,
						},
						{
							'name': 'Gameplay Extra: ',
							'value': `${gameplayMainExtra}`,
						},
						{
							'name': 'Gameplay Completionist: ',
							'value': `${gameplayCompletionist}`,
						},
						{
							'name': `${testClass.baseEmbedTemplate()[3]}`,
							'value': `${testClass.baseEmbedTemplate()[2]}`,
						},
					],
					'author': {
						'name': 'f00d',
					},
				};
				message.channel.send({
					embed,
				});
			}).catch(() => {
				message.channel.send('Error, try again');
			});
		}
		else {
			message.channel.send('No results, check your spelling first');
		}
	}

	// IMDB

	if (message.content.startsWith(prefix + 'imdb')) {
		const userInput = input.substr('5');
		if (message.content.endsWith(userInput)) {

			imdb.get({ name: userInput }, { apiKey: 'e9c3b0bb', timeout: 30000 }).then(res => {
				const titles = (res.title);
				const year = (res.year);
				const imagePoster = (res.poster);
				const rating = (res.rating);
				const ratingMeta = (res.metascore);
				const description = (res.plot);
				const url = (res.imdburl);
				console.log('success', res);

				const embed = {
					'title': `${titles}`,
					'color': 14274056,
					'description': `${description}`,
					'url': `${url}`,
					'footer': {
						'icon_url': `${testClass.baseEmbedTemplate()[1]}`,
						'text': `${testClass.baseEmbedTemplate()[0]}`,
					},
					'thumbnail': {
						'url': 'https://ia.media-imdb.com/images/M/MV5BMTczNjM0NDY0Ml5BMl5BcG5nXkFtZTgwMTk1MzQ2OTE@._V1_.png',
					},
					'image': {
						'url':`${imagePoster}`,
					},
					'fields': [
						{
							'name': 'Year: ',
							'value': `${year}`,
						},
						{
							'name': 'IMDB Rating: ',
							'value': `${rating}`,
						},
						{
							'name': 'Meta Score Rating: ',
							'value': `${ratingMeta}`,
						},
						{
							'name': `${testClass.baseEmbedTemplate()[3]}`,
							'value': `${testClass.baseEmbedTemplate()[2]}`,
						},
					],
					'author': {
						'name': 'f00d',
					},
				};
				message.channel.send({
					embed,
				});
			}).catch(() => {
				message.channel.send('Error, try again');
			});
		}
		else {
			message.channel.send('No results, check your spelling first');
		}
	}

	// Quora Answer

	if (message.content.startsWith(prefix + 'quora')) {
		const userInput = input.substr('7');
		if (message.content.endsWith(userInput)) {
			let str = userInput;
			str = str.replace(/\s+/g, '-').toLowerCase();
			console.log(str);

			quora.answer(str).then(answer => {
				const titles = (answer.writer0);
				const description = (answer.answer0);
				console.log('success', answer);

				const embed = {
					'title': `${titles}`,
					'color': 14274056,
					'description': `${description}`,
					'footer': {
						'icon_url': `${testClass.baseEmbedTemplate()[1]}`,
						'text': `${testClass.baseEmbedTemplate()[0]}`,
					},
					'thumbnail': {
						'url': 'https://www.underconsideration.com/brandnew/archives/quora_icon.png',
					},
					'fields': [
						{
							'name': `${testClass.baseEmbedTemplate()[3]}`,
							'value': `${testClass.baseEmbedTemplate()[2]}`,
						},
					],
					'author': {
						'name': 'f00d',
					},
				};
				message.channel.send({
					embed,
				});
			}).catch(() => {
				message.channel.send('Error, try again');
			});
		}
		else {
			message.channel.send('No results, check your spelling first');
		}
	}

	// Wiki Text


	if (message.content.startsWith(prefix + 'wiki')) {
		const userInput = input.substr('6');
		const query = argv.q || userInput;
		const urlWiki = `https://en.wikipedia.org/w/api.php?action=opensearch&search='+ ${query} +'&format=json`;
		request(urlWiki, function(err, response, body) {
			if (err) {
				const error = 'cannot connect to the server';
				message.channel.send(error);
				message.channel.send('No results, check your spelling first');
			}
			else {
				const wiki = JSON.parse(body);
				for (var i = 0; i < wiki[1].length; i++) {
					const wikiMessage = `You searched for ${wiki[1][i]}: ` + '\n';
					const wikiMessageDesc = `${wiki[2][i]}` + '\n' + 'Follow this link to read more' + `${wiki[3][i]}`;
					const wikiURL = `${wiki[3][i]}`;
					// console.log(wikiMessage);
					const embed = {
						'title': `${wikiMessage}`,
						'color': 14274056,
						'description': `${wikiMessageDesc}`,
						'url': `${wikiURL}`,
						'thumbnail': {
							'url': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1280px-Wikipedia-logo-v2.svg.png',
						},
						'fields': [
							{
								'name': `${testClass.baseEmbedTemplate()[3]}`,
								'value': `${testClass.baseEmbedTemplate()[2]}`,
							},
						],
						'footer': {
							'icon_url': `${testClass.baseEmbedTemplate()[1]}`,
							'text': `${testClass.baseEmbedTemplate()[0]}`,
						},
						'author': {
							'name': 'f00d',
						},
					};
					message.channel.send({
						embed,
					});
					break;
				}
			}
		});
	}

	if (message.content.startsWith(prefix + 'fandom')) {
		const userInput = input.substr('7');
		const query = argv.q || userInput;
		const urlWiki = `http://www.wikia.com/api/v1/Search/CrossWiki?expand=1&query="+${query}+"+&lang=en&limit=1&batch=1`;

		request(urlWiki, function(err, response, body) {
			if (err) {
				const error = 'cannot connect to the server';
				message.channel.send(error);
				message.channel.send('No results, check your spelling first');
			}
			else {
				const wiki = JSON.parse(body);
				let wikiID;
				try{
					wikiID = wiki.items[0].id;
				}
				catch (err) {
					message.channel.send('No results, check your spelling first. For example instead of corsa type assetto corsa');
				}

				// possibly switch to this catch in the fture
				// function trycatch() {
				// 	    try {
				// 	        return wikiID;
				// 	    } catch (err) {
				// 	        console.log(error(err.message));
				// 					message.channel.send('No results, check your spelling first. For example instead of corsa type assetto corsa');
				// 	        return undefined; // or whatever you want
				// 	    }
				// 	}

				// const wikiID = trycatch();

				console.log(wikiID);
				const urlWikia = `http://www.wikia.com/api/v1/Wikis/Details?ids=${wikiID}`;
				request(urlWikia, function(err, responses, bodys) {
					if (err) {
						const error = 'cannot connect to the server';
						message.channel.send(error);
						message.channel.send('No results, check your spelling first');
					}
					else {
						const wikiResponse = JSON.parse(bodys);
						// console.log(wikiResponse);
						const wikiMessage = wikiResponse.items[wikiID].desc;
						const wikiTitle = wikiResponse.items[wikiID].title;
						const wikiURL = wikiResponse.items[wikiID].url;
						const wikiThumb = wikiResponse.items[wikiID].image;
						// console.log(wikiMessage);

						const embed = {
							'title': `${wikiTitle}`,
							'color': 14274056,
							'description': `${wikiMessage}`,
							'url': `${wikiURL}`,
							'thumbnail': {
								'url': 'https://media.glassdoor.com/sql/428648/fandom-squarelogo-1533568635940.png',
							},
							'image': {
								'url':`${wikiThumb}`,
							},
							'fields': [
								{
									'name': `${testClass.baseEmbedTemplate()[3]}`,
									'value': `${testClass.baseEmbedTemplate()[2]}`,
								},
							],
							'footer': {
								'icon_url': `${testClass.baseEmbedTemplate()[1]}`,
								'text': `${testClass.baseEmbedTemplate()[0]}`,
							},
							'author': {
								'name': 'f00d',
							},
						};
						// embed
						message.channel.send({
							embed,
						});
						// message
					}
					// else
				});
			}
			// else
		});
		// request
	}

	const dbc = new DeathByCaptcha('f00d4tehg0dz', 'y97p61AJmeVf');
	// Know your Meme
	if (message.content.startsWith(prefix + 'google')) {
		const userInput = input.substr('7');
		const userStripped = userInput;
		const urls = [];
		const titles = [];
		const descriptions = [];
		const options = {
			query: userStripped,
			host: 'www.google.com',
			constg: 'en',
			// age: 'y',
			solver: dbc,
			// last 24 hours ([hdwmy]\d? as in google URL)
			limit: 1,
			params: {
			},
			// params will be copied as-is in the search URL query string
		};
		// options
		scraper.search(options, function(err, url, meta) {
			if (url) {
				urls.push(url);
			}
			if (meta.titles) {
				titles.push(meta.titles);
			}
			if (meta.desc) {
				descriptions.push(meta.desc);
			}
			if (urls.length === options.limit) {
				// console.log(urls);
				if (meta.desc) {
					descriptions.push(meta.desc);
				}
				if (meta.title) {
					titles.push(meta.title);
				}
				nextStep();
			}
			// End length
			function nextStep() {
				const titleLink = titles;
				const pickone = descriptions;
				const urlLink = urls;
				const embed = {
					'title':`${titleLink}`,
					'color': 14274056,
					'description': `${pickone}`,
					'url': `${urlLink}`,
					'footer': {
						'icon_url':`${testClass.baseEmbedTemplate()[1]}`,
						'text':`${testClass.baseEmbedTemplate()[0]}`,
					},
					'thumbnail': {
						'url': 'https://blog.hubspot.com/hubfs/image8-2.jpg',
					},
					'fields': [
						{
							'name': `${testClass.baseEmbedTemplate()[3]}`,
							'value': `${testClass.baseEmbedTemplate()[2]}`,
						},
					],
					'author': {
						'name': 'f00d',
					},
				};
				message.channel.send({ embed });
			}
			// next step
		});
	}
	// if startswith

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;


	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

// login to Discord with your app's token
// with out prefix client.login(config.token)
// with prefix:
client.login(token);
