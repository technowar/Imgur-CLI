'use strict';

const path = require('path');
const fs = require('fs');
const imgur = require('./imgur');
const notify = require('node-notifier');

module.exports = {
	watchNow (directory) {
		fs.stat(directory, (error, stats) => {
			if (error) {
				return notify.notify({
					title: 'Imgur-CLI',
					message: `Directory ${directory} not found`
				});
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
									imgur.uploadImage(`${directory + filename}`);

									trigger = null;
								}, 1000);
					}
				});
			}
		});
	}
}
