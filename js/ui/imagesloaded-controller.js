import {addClass} from '../utils/cssClassHelpers.js';
import imagesLoaded from 'imagesloaded';

export default function innitImagesLoaded() {
	// Will run on every image inside the body
	const imgLoaded = imagesLoaded(document.querySelector('body'));
	imgLoaded.on('always', triggerImgsLoaded);

	let bannerBgs = document.querySelectorAll('.banner__bg');
	imagesLoaded('.banner', { background: '.banner__bg' }, function() {
		for (var index = 0; index < bannerBgs.length; index++) {
			const bannerBg = bannerBgs[index];
			addClass(bannerBg, 'banner__bg--loaded');
		}
	});
}

function triggerImgsLoaded() {
	// Init ImagesLoaded for all images
	const images = Array.prototype.slice.call(document.querySelectorAll('img'));

	for (var index = 0; index < images.length; index++) {
		const img = images[index];
		addClass(img, 'img--loaded');
	}
}
