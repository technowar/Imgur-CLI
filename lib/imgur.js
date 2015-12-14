'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request');
const cv = require('copy-paste');

module.exports = {
	uploadImage(image) {
		if (!image) {
			throw 'Error: Please specify image to upload';
		}

		fs.readFile(image, (error, data) => {
			if (error) {
				throw error;
			}

			if (path.extname(image) !== '.jpg' && path.extname(image) !== '.jpeg' && path.extname(image) !== '.gif' && path.extname(image) !== '.png') {
				throw 'Error: File not supported';
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
					throw error;
				}

				cv.copy(JSON.parse(body).data.link, () => {
					console.log(`Copied to clipboard: ${JSON.parse(body).data.link}`);
				});
			});

			let uploadImage = upload.form();

			uploadImage.append('type', 'file');
			uploadImage.append('image', fs.createReadStream(image));
		});
	}
}
