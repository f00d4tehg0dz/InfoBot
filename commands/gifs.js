const redditSubModule = 'gifs';
const request = require('request-promise');
const testClass = require('../commands/helper.js');
module.exports = {
	name: 'gffffff',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message) {
		request.get('https://www.reddit.com/r/' + redditSubModule + '/new.json?limit=100').then(function(body) {
			const obj = JSON.parse(body);
			const posts = obj.data.children.map(function(post) {
				return post.data;
			});
			const pickone =	testClass.shuffle(posts);
			const urlLink = (pickone[0].url);
			// console.log(urlLink);
			const postTitle = (pickone[0].title);
			const postAuthor = (pickone[0].author);
			const urlThumb = (pickone[0].thumbnail);
			// console.log("urlThumb",urlThumb);
			function gfy() {
				if (urlLink.includes('gfycat')) {
					const urlLinkSplice = urlLink.split('/').slice(3);
					const finalURL = 'https://thumbs.gfycat.com/' + `${urlLinkSplice}` + '-size_restricted.gif';
					return finalURL;
				}
				else if (testClass.get_url_extension(urlLink) === ('gifv')) {
					console.log('givf');
					const urlLinkSplice = urlLink.slice(0, -1);
					const finalURL = urlLinkSplice;
					console.log('URL', urlLink);
					console.log(finalURL);
					return finalURL;
				}
				else if (testClass.get_url_extension(urlLink) === ('gif')) {
					const finalURL = urlLink;
					return finalURL;
				}
				else if (testClass.get_url_extension(urlLink) === ('jpg')) {
					const finalURL = urlLink;
					return finalURL;
				}
			}
			const gfyexists = gfy();
			console.log(gfyexists);
			// console.log("title", testClass.baseEmbedTemplate()[0]);
			// console.log("footer", testClass.baseEmbedTemplate()[1]);
			const embed = {
				'title':`${postTitle}`,
				'color': 14274056,
				'footer': {
					'icon_url': `${testClass.baseEmbedTemplate()[1]}`,
					'text': `${testClass.baseEmbedTemplate()[0]}`,
				},
				'thumbnail': {
					'url': `${urlThumb}`,
				},
				'image': {
					'url':  `${gfyexists}`,
				},
				'author': {
					'name': `${postAuthor}`,
				},
			};
			message.channel.send({ embed });
		});
	},
};
