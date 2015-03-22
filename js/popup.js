$(function() {
	// initially canvas is display: none
	var $toggle = $('#toggle-state'), $clear = $('#clear'), $colorToggle = $('.toggle-color'), $eraser = $('#eraser');

	$toggle.click(function() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {data: 'DisplayToggle'}, function(response) {
				window.close();
			});
		});
	});

	$clear.click(function() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {data: 'Clear'}, function(response) {
				window.close();
			});
		});
	});

	$colorToggle.click(function() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			data = 'Color' + $(this).text();
			chrome.tabs.sendMessage(tabs[0].id, {data: data}, function(response) {
				window.close();
			});
		}.bind(this));
	});

	$eraser.click(function() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {data: 'Erase'}, function(response) {
				window.close();
			});
		});
	});

});