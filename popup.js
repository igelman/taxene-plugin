// http://nyselene1.ops.about.com:8080/taxene/children/4014759?childrenNodeTypes=TAXONOMY&isRecursive=false&includeDocumentSummaries=true&includeConfigs=true
var seleneUrl = "http://nyselene1.ops.about.com:8080/";
var taxeneEndpoint = "taxene/children/";
var queryParameters = "childrenNodeTypes=TAXONOMY&isRecursive=false&includeDocumentSummaries=true&includeConfigs=true";

function getCurrentTabUrl(callback) {
	var queryInfo = {
		active: true,
		currentWindow: true
	};
	
	chrome.tabs.query(queryInfo, function(tabs) {
		var tab = tabs[0];
		var url = tab.url;
		
		var message = "";
		message += "<p>" + url + "</p>";
		message += "<p>" + constructApiUrl("4014759") + "</p>";
		getSeleneJson(constructApiUrl("4014759"));
		callback(message);
	});

}

function constructApiUrl(docId) {
	var apiUrl = "";
	apiUrl += seleneUrl + taxeneEndpoint + docId + "?" + queryParameters;
	return apiUrl;
}

function getSeleneJson(apiUrl) {
	var ajaxUrl = apiUrl;
	$.getJSON( ajaxUrl, function( data ){
		console.log(data);
	});
}

function printMessage(message) {
	$( '#status' ).append( "<div>" + message + "</div>" );
}

document.addEventListener('DOMContentLoaded', function(){
	getCurrentTabUrl(printMessage);
});

