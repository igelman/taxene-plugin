/*
	Background script waits for message from content.js.
	The message contains the url of a taxonomy node document.
	This script uses the url to GET the node's children.
	It sends that payload back to content.js.
*/

// Config settings for Selene api.	
var seleneUrl = "http://nyselene1.ops.about.com:8080/";
var taxeneEndpoint = "taxene/children/";
var queryParameters = "childrenNodeTypes=TAXONOMY&childrenNodeTypes=DOCUMENT&isRecursive=false&includeDocumentSummaries=true&includeConfigs=true";


// Listen for request from content.js
// Figure out the node's doc id.
// Construct the Selene call.
// GET the children from Selene.
// Send that back to content.js so it can be presented in the browser.
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.message === "getTaxeneChildren" ) {
			var url = request.url;
			var nodeId = extractNodeId(url);
			var apiUrl = constructApiUrl(nodeId);
			getSeleneJson(apiUrl, sendResponse);
			console.log("addListener about to return true");
			return true; // Returning true causes the message connection to persist until getSeleneJson (which is async) finishes, at which point the payload is sent back to content.js and the connection closes.
			//"If you want to asynchronously use sendResponse, add 'return true;' to the onMessage event handler." https://developer.chrome.com/extensions/messaging
		}
	}	
);

// DocId is (almost) always the numeric string following the last hyphen in the url.
function extractNodeId(url) {
    var lastHyphen = url.lastIndexOf("-");
    var nodeId = url.substring(lastHyphen + 1);
    console.log("function extractNodeId\n" + "nodeId: " + nodeId);
    return nodeId;
}

// Construct the Selene taxene api url from the node docId
function constructApiUrl(docId) {
	var apiUrl = "";
	apiUrl += seleneUrl + taxeneEndpoint + docId + "?" + queryParameters;
	console.log("function constructApiUrl\n" + "apiUrl: " + apiUrl);
	return apiUrl;
}

//GET children from taxene
function getSeleneJson(apiUrl, sendResponse) {
	var ajaxUrl = apiUrl;
	$.getJSON( ajaxUrl, function( data ){
		console.log(data);
		sendResponse(data.data.children.list);
	});
}