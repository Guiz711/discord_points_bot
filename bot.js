/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   bot.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gmichaud <gmichaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/10 09:17:35 by gmichaud          #+#    #+#             */
/*   Updated: 2017/07/12 10:54:38 by gmichaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const config = require("./config.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
const NodeCache = require("node-cache");
const usersArray = new NodeCache();
const Messages = require("./messages.js");

function analyze_msg(bot, msg, cmd) {
	switch(cmd[0]) {
		case "about":
		case "About":
			if (cmd.length == 1)
				Messages.about(msg);
			break;

		case "points":
		case "Points":
		case "pts":
		case "Pts":
			if (cmd.length == 1) {
				Messages.showPoints(msg, usersArray);
			} else if (cmd.length >= 3) {
				/*if (msg.member.roles.has(msg.guild.roles.find("name", "Admin").id)
					|| msg.member.roles.has(msg.guild.roles.find("name", "Fondateur").id)
					|| msg.member.roles.has(msg.guild.roles.find("name", "Modérateur").id))*/
					Messages.calcPoints(bot, msg, cmd, usersArray);
			}
			break;

		case "top":
		case "Top":
			if (cmd.length == 1)
				Messages.top(msg, usersArray);
			break;
		
		case "Help":
		case "help":
			if (cmd.length == 1)
				Messages.help(msg);
			break;

		default:
			console.log("commande non reconnue");
	}
}

bot.on("ready", () => {
	console.log("points_counter ready");
});

bot.on("message", msg => {
	if (!msg.content.startsWith(config.prefix) || msg.author.bot) {
		return ;
	}
	cmd = msg.content.slice(config.prefix.length).split(' ');
	analyze_msg(bot, msg, cmd);
});

bot.login(config.token);