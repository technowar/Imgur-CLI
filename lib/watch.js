'use strict';

const fs = require('fs');
const path = require('path');
const imgur = require('./imgur');

module.exports = {
	watchFolder(directory) {
		if (!directory) {
			let platform = {
				windows () {
					watchNow(path.join(`${process.env.USERPROFILE}`, '\\Desktop\\'));
				},
				others () {
					watchNow(path.join(`${process.env.HOME}`, '/Desktop/'));
				}
			};

			return (platform[process.platform] || platform.others)();
		}

		let platform = {
			windows (directory) {
				watchNow(`${directory + '\\'}`);
			},
			others (directory) {
				watchNow(`${directory + '/'}`);
			}
		};

		(platform[process.platform] || platform.others)(directory);
	}
}

function watchNow (directory) {
	console.log(`Now watching ${directory}`);

	fs.stat(directory, (error, stats) => {
		if (error) {
			return console.log(`Error: Directory not found`);
		}

		if (stats.isDirectory()) {
			let trigger;

			fs.watch(directory, (event, filename) => {
				if (path.extname(filename) === '.jpeg' ||
						path.extname(filename) === '.jpg' ||
						path.extname(filename) === '.gif' ||
						path.extname(filename) === '.png' &&
						!trigger) {
							trigger = setTimeout(() => {
								console.log(`${directory + filename} added`);

								imgur.uploadImage(`${directory + filename}`);

								trigger = null;
							}, 1000);
				}
			});
		}
	});
}
