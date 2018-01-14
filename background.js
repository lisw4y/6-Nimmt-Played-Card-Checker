chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.windows.create({
		url: chrome.runtime.getURL("checker.html"),
		type: "popup",
		width: 400,
		height: 400
	}, function () {
		chrome.tabs.executeScript(tab.id, {
			file: "detector.js"
		});
	});
});
