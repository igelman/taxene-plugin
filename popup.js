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

// callback function for getCurrentTabUrl
// From the tab url, extract the node id.
// With the node id, construct the api url.
// GET the children from Selene (which prints to a table).
function doTheWholeThing (url) {
	var nodeId = "4014759"; // actually this will be function(url) but I'm not there yet
	getSeleneJson( constructApiUrl(nodeId) );
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
		var table = "<table><thead></thead><tbody>";
		data.data.children.list.forEach( function(item, index) {
			var tr = "<tr>";
			tr += "<td>" + item.docId + "</td>";
			tr += "<td>" + item.primaryParentWeight + "</td>";
			tr += "<td>" + "<a target='_blank' href='" + item.document.url + "'>" + item.document.slug + "</a>" + "</td>";
			tr +=  "</tr>";
			table += tr;
			//$( '#data' ).append(index + ": " + item.docId + "<br>");
		});
		table += "</tbody></table>";
		$( '#data' ).append(table);
	});
}

function printMessage(message) {
	$( '#status' ).append( "<div>" + message + "</div>" );
}

document.addEventListener('DOMContentLoaded', function(){
	getCurrentTabUrl(printMessage);
});

