'use strict';

const path = require('path');
const fs = require('fs');
const notify = require('node-notifier');
const imgur = require('./imgur');

module.exports = {
	listenNow (directory) {
		let dir = directory + '/';

		fs.stat(directory, (error, stats) => {
			if (error) {
				notify.notify({
					title: 'Imgur-CLI',
					message: `Directory ${dir} not found`
				});
			}

			if (stats.isDirectory()) {
				let trigger;

				fs.watch(dir, (event, filename) => {
					if (path.extname(filename) === '.jpeg' ||
							path.extname(filename) === '.jpg' ||
							path.extname(filename) === '.gif' ||
							path.extname(filename) === '.png' &&
							!trigger) {
								trigger = setTimeout(() => {
									notify.notify({
										title: 'Imgur-CLI',
										message: `${dir + filename} added`
									});

									imgur.uploadImage(`${dir + filename}`);

									trigger = null;
								}, 1000);
					}
				});
			}
		});
	}
};
