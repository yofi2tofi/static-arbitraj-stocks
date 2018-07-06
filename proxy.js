'use strict'

// Graber proxy servers

let needle    = require('needle'),
	tress     = require('tress'),
	cheerio   = require('cheerio');

exports.graberA = function() {

	let url = 'https://www.proxynova.com/proxy-server-list/';

	let proxies = [''];

	return new Promise(function(resolve, reject){

		needle.get(url, function(err, resp, body) {
			if (err) reject();

			let $ = cheerio.load(resp.body);

			$('#tbl_proxy_list tbody').eq(0).find('tr').each(function(i, elem) {
				try {
					let ip   = $(this).find('td').eq(0).find('script').text().match(/(\d+)/gi).join('.');
					let port = $(this).find('td').eq(1).find('a').text();
					if($(this).find('td').eq(6).find('span').hasClass('proxy_anonymous') || $(this).find('td').eq(6).find('span').hasClass('proxy_elite')) {
						proxies.push(`${ip}:${port}`);
					};
				} catch(e) {
					// console.log(e);
				};
			});

			resolve(proxies);
		});
	});	
};

exports.graberB = function(){

	let url = 'http://proxysearcher.sourceforge.net/Proxy%20List.php?type=http&filtered=true';

	let proxies = [''];

	return new Promise(function(resolve, reject){

		needle.get(url, function(err, resp, body) {
			if (err) reject();

			let $ = cheerio.load(resp.body);

			$('.proxy-list tbody').eq(0).find('tr').each(function(i, elem) {
				try {
					if (i>300) return false;
					let ip_port = $(this).find('td').eq(1).text();
					proxies.push(`${ip_port}`);
				} catch(e) {
					// console.log(e);
				};
			});

			resolve(proxies);
		});
	});	
};