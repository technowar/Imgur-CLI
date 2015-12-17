'use strict';

const path = require('path');
const listen = require('./listen-now');

module.exports = {
	listenFolder (directory) {
		if (!directory) {
			return listen.listenNow(path.join(`${process.env.HOME}`, '/Desktop'));
		}

		listen.listenNow(directory);
	}
};
