/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gmichaud <gmichaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/11 12:50:02 by gmichaud          #+#    #+#             */
/*   Updated: 2017/07/11 12:50:06 by gmichaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

class User {
	constructor(id, name, points) {
		this._id = id;
		this.name = name;
		this.points = points < 0 ? 0 : points;
	}
}

module.exports = User;