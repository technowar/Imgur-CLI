'use strict';

const path = require('path');
const watch = require('./watch-now');

module.exports = {
	watchFolder (directory) {
		if (!directory) {
			let platform = {
				windows () {
					watch.watchNow(path.join(`${process.env.USERPROFILE}`, '\\Desktop\\'));
				},
				others () {
					watch.watchNow(path.join(`${process.env.HOME}`, '/Desktop/'));
				}
			};

			return (platform[process.platform] || platform.others)();
		}

		let platform = {
			windows (directory) {
				watch.watchNow(`${directory + '\\'}`);
			},
			others (directory) {
				watch.watchNow(`${directory + '/'}`);
			}
		};

		(platform[process.platform] || platform.others)(directory);
	}
}
