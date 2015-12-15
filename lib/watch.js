'use strict';

const fs = require('fs');
const path = require('path');
const imgur = require('./imgur');

module.exports = {
	watchFolder(directory) {
		if (!directory) {
			let desktop;

			let platform = {
				windows () {
					desktop = `${process.env.USERPROFILE + '\\Desktop\\'}`;

					watchNow(desktop);
				},
				others () {
					desktop = `${process.env.HOME + '/Desktop/'}`;

					watchNow(desktop);
				}
			};

			return (platform[process.platform] || platform.others)();
		}

		watchNow(directory);
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
								console.log(`${filename} added`);

								imgur.uploadImage(`${directory + filename}`);

								trigger = null;
							}, 1000);
				}
			});
		}
	});
}
