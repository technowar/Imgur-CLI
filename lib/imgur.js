'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request');
const cv = require('copy-paste');
const notify = require('node-notifier');

module.exports = (image) => {
	if (!image) {
		return notify.notify({
			title: 'Imgur-CLI',
			message: 'Please specify image to upload'
		});
	}

	fs.readFile(image, (error, data) => {
		if (error) {
			return notify.notify({
				title: 'Imgur-CLI',
				message: `Unable to locate ${image}`
			});
		}

		if (path.extname(image) !== '.jpeg' &&
				path.extname(image) !== '.jpg' &&
				path.extname(image) !== '.gif' &&
				path.extname(image) !== '.png') {
					return notify.notify({
						title: 'Imgur-CLI',
						message: `File ${image} not supported`
					});
		}

		let options = {
			url: 'https://api.imgur.com/3/image',
			headers: {
				Accept: 'application/json',
				Authorization: 'Client-ID 12404ec3c891277'
			}
		};

		let upload = request.post(options, (error, response, body) => {
			if (error) {
				return notify.notify({
					title: 'Imgur-CLI',
					message: 'Unable to connect to the server'
				});
			}

			cv.copy(JSON.parse(body).data.link, () => {
				notify.notify({
					title: 'Imgur-CLI',
					message: `Copied to clipboard: ${JSON.parse(body).data.link}`
				});
			});

			console.log(`Image URL: ${JSON.parse(body).data.link}`);
		});

		let uploadImage = upload.form();

		uploadImage.append('type', 'file');
		uploadImage.append('image', fs.createReadStream(image));
	});
}
