'use strict';

const path = require('path');
const listen = require('./listen-now');

module.exports = (directory) => {
	if (!directory) {
		return listen(path.join(`${process.env.HOME}`, '/Desktop'));
	}

	listen(directory);
}
