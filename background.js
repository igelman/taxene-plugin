// Listen for request from content.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.message === "getTaxeneChildren" ) {
			
		}
	}	
);