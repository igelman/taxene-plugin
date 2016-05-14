function getCurrentTabUrl(callback) {
	var queryInfo = {
		active: true,
		currentWindow: true
	};
	
	chrome.tabs.query(queryInfo, function(tabs) {
		var tab = tabs[0];
		var url = tab.url;
		
		callback(url);
	});
}

function printMessage(message) {
	console.log(message);
}

getCurrentTabUrl(printMessage);