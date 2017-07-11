/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   messages.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gmichaud <gmichaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/11 12:49:35 by gmichaud          #+#    #+#             */
/*   Updated: 2017/07/11 21:00:56 by gmichaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const config = require("./config.json");
const NodeCache = require("node-cache");
const Discord = require("discord.js");
const User = require("./user.js");
const fs = require("fs");

function check_json(usersArray) {
	if (usersArray.keys().length == 0 && fs.existsSync("./points.json")) {
		console.log('file check ok');
		let content = JSON.parse(fs.readFileSync("./points.json", "utf8"));
		for (var id in content) {
			if (content.hasOwnProperty(id)) {
				usersArray.set(id, content[id]);
			}
		}
	}
}

module.exports = {

about: function(msg) {
	msg.channel.send(`:large_orange_diamond: Bot ${config.bot_name} :large_orange_diamond:\n`
		+ `Version : ${config.version}\nAuteur : ${config.authors}`);
},

top: function(msg, usersArray) {
	check_json(usersArray);
	usersArray.mget(usersArray.keys(), (err, user_data) => {
		let top = [];

		if (err) {
			console.error(err);
			return ;
		}
		for (let id in user_data) {
			console.log(user_data[id].points);
			top.push(user_data[id]);
		}
		top.sort((a, b) => a.points - b.points).reverse();
		let text = "";
		if (top[0])
			text = `1. ${top[0].name} (${top[0].points} points)\n`;
		else
			text = `Aucun utilisateur n'a de points`;
		if (top[1])
			text += `2. ${top[1].name} (${top[1].points} points)\n`;
		if (top[3])
		 text += `3. ${top[2].name} (${top[2].points} points)\n`;
		msg.channel.send(text);
	});
},

showPoints: function(msg, usersArray) {
	check_json(usersArray);
	console.log("check point");
	usersArray.get(msg.author.id, (err, data) => {
		if (err) {
			console.error(err);
			return ;
		}
		if (data)
			msg.channel.send(`Vous avez ${data.points} points, Maitre ${data.name}`);
		else
			msg.channel.send(`Vous avez 0 points, Maitre ${msg.author.username}`);
	});
},

calcPoints: function(bot, msg, cmd, usersArray) {
	let discord_user = bot.users.find("username", cmd[1]);

	if (discord_user) {
		console.log("user exists");
		let user_id = bot.users.find("username", cmd[1]).id;
		let points = parseInt(cmd[2]);

		check_json(usersArray);
		let user = usersArray.get(user_id);
		if (!user) {
			user = new User(user_id, cmd[1], points);
			usersArray.set(user_id, user);
		} else {
			user.points = user.points + points < 0 ? 0 : user.points + points;
			usersArray.set(user_id, user);
		}
		let users_data = usersArray.mget(usersArray.keys());
		fs.writeFile("./points.json", JSON.stringify(users_data), (err) => {
			if (err)
				console.error(err);
		});
		if (points >= 0)
			msg.channel.send(`${points} points ajoutes a ${user.name}. Nouveau total : ${user.points} points`);
		else
			msg.channel.send(`${Math.abs(points)} points enleves a ${user.name}. Nouveau total : ${user.points} points`);
	}
}

}