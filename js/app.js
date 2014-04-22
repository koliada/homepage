/**
 * Alexei Koliada 2014
 */

(function () {

	'use strict';

	var content = {
		'firetasks': 'A Google Tasks client for Mozilla\'s Firefox OS',
		'current-occupation': '',
		'rn2': '',
		'rn-articles': ''
	};

	function $(v) {
		return (v.substr(0, 1) === '#') ? document.querySelector(v) : document.querySelectorAll(v);
	}

	function getLastTweet() {

		var dom = {
				content: $('.twitter-content')[0],
				timestamp: $('.twitter-timestamp > a')[0]
			},
			request = new XMLHttpRequest();

		function normalizeDate(date) {
			var result = '';
			result += date.getFullYear();
			result += '-';
			result += ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1).toString()) : (date.getMonth() + 1).toString();
			result += '-';
			result += (date.getDate().length === 1) ? ('0' + (date.getDate() + 1).toString()) : date.getDate();
			result += ' ';
			result += date.getHours();
			result += ':';
			result += (date.getMinutes().length === 1) ? ('0' + (date.getMinutes() + 1).toString()) : date.getMinutes();
			return result;
		}

		function processURLs(response) {
			response.entities.urls.forEach(function (url) {
				response.text = response.text.replace(url.url, '<a href="' + url.expanded_url + '" target="_blank">' + url.display_url + '</a>');
			});
			return response.text;
		}

		function onLoad(ev) {
			var response = ev.currentTarget && JSON.parse(ev.currentTarget.response.toString()),
				date = new Date(response.created_at);
			dom.content.innerHTML = processURLs(response);
			dom.timestamp.innerHTML = normalizeDate(date);
			dom.timestamp.href = 'https://twitter.com/' + response.user.screen_name + '/status/' + response.id_str;
		}

		function onFail() {
			dom.content.innerHTML = 'Error occurred. Retrying...';
			setTimeout(sendRequest, 1000);
		}

		function sendRequest(url) {
			url = url || 'twitter/index.php?ajax=true';
			request.open('get', url, true);
			request.send();
		}

		request.onload = onLoad;
		request.timeout = 10000;
		request.ontimeout = onFail;
		sendRequest();
	}

	function bindListeners() {
		var cards = $('.internal'),
			i,
			flipCard = function (ev) {
				if (ev.target.tagName.toLowerCase() != 'a') {
					ev.preventDefault();
					ev.currentTarget.querySelector('.card').classList.toggle('flipped');
				}
			};
		for (i = 0; i < cards.length; i++) {
			cards[i].addEventListener('click', flipCard);
		}
	}

	bindListeners();
	getLastTweet();

}());

/* Analytics */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-18750158-4', 'alex-koliada.com');
ga('send', 'pageview');