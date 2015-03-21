// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// initially canvas is display: none
var display = false;

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

chrome.pageAction.onClicked.addListener(function(tab) {
	if(display) {
		chrome.tabs.sendMessage(tab.id, {data: 'DisplayNone'}, function(response) {
			display = false;
		});
	} else {
		chrome.tabs.sendMessage(tab.id, {data: 'DisplayBlock'}, function(response) {
			display = true;
		});
	}
});