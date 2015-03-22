$(function() {
	// initially canvas is display: none
	var $toggle = $('#toggle-state'), $clear = $('#clear');

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

});