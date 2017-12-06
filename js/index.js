'use strict';

// libraries
import React from 'react';
import ReactDOM from 'react-dom';
import NProgress from 'nprogress';
import Barba from 'barba.js';
import select from 'dom-select';
import dataset from 'dataset';
import { pageTransitionFactory } from './pages';

require('es6-promise').polyfill();

window.addEventListener('DOMContentLoaded', function() {
	console.log('DOMContentLoaded!');

	// start pjax
	Barba.Pjax.start();

	Barba.Dispatcher.on('linkClicked', (e) => {
		// override barba transition if needed
		// based on current page
		Barba.Pjax.getTransition = function() {
			const container = select('.barba-container');
			const section = dataset(container, 'section');

			return pageTransitionFactory(section);
		};
		// start progress bar
		NProgress.start();
	});

	Barba.Dispatcher.on('initStateChange', () => {
        console.log('initStateChange');
        // Do any necessary destroys here

		NProgress.inc();
		window.element = null;
	});

	Barba.Dispatcher.on('newPageReady', (currentStatus, oldStatus, container) => {
		window.scroll(0, 0);
		NProgress.inc();
	});

	Barba.Dispatcher.on('transitionCompleted', () => {
		console.log('transitionCompleted');

        NProgress.done();

        // Reapply necessary ui/interactions
	});


	const appElement = document.querySelector('.js--app');
	if (appElement) {

	}

	// init loader
	NProgress.start();
});
