'use strict';

const fs = require('fs');
const imgur = require('./imgur');

module.exports = {
	watchFolder(directory) {
		if (!directory) {
			let desktop;

			let platform = {
				windows () {
					desktop = `${process.env.USERPROFILE + '\Desktop'}`;

					watchNow(desktop);
				},
				others () {
					desktop = `${process.env.HOME + '/Desktop'}`;

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
			fs.watch(directory, (event, filename) => {
				if (event === 'change') {
					imgur.uploadImage(`${directory + filename}`);
				}
			});
		}
	});
}
