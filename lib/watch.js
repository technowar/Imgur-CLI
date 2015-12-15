'use strict';

const fs = require('fs');
const imgur = require('./imgur');

module.exports = {
	watchFolder(directory) {
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
}
