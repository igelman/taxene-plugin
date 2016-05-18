/*
	Config settings for Selene api.	
*/
var seleneUrl = "http://nyselene1.ops.about.com:8080/";
var taxeneEndpoint = "taxene/children/";
var queryParameters = "childrenNodeTypes=TAXONOMY&childrenNodeTypes=DOCUMENT&isRecursive=false&includeDocumentSummaries=true&includeConfigs=true";

// Kick off the whole thing after the popup loads.
document.addEventListener('DOMContentLoaded', function(){
	getCurrentTabUrl(doTheWholeThing);
});

function getCurrentTabUrl(callback) {
	var queryInfo = {
		active: true,
		currentWindow: true
	};
	
	chrome.tabs.query(queryInfo, function(tabs) {
		var tab = tabs[0];
		var url = tab.url;
		console.log("function getCurrentTabUrl\n" + "tab.url: " + url);

		callback(url);
	});

}

// callback function for getCurrentTabUrl
// Extract the node id from the tab url.
// Construct the api url based on the node id (and the config settings).
// GET the children from Selene (and print to a table).
function doTheWholeThing (url) {
	var nodeId = extractNodeId(url);
	getSeleneJson( constructApiUrl(nodeId) );
}

// DocId is (almost) always the numeric string following the last hyphen in the url.
function extractNodeId(url) {
    var lastHyphen = url.lastIndexOf("-");
    var nodeId = url.substring(lastHyphen + 1);
    console.log("function extractNodeId\n" + "nodeId: " + nodeId);
    return nodeId;
}

function constructApiUrl(docId) {
	var apiUrl = "";
	apiUrl += seleneUrl + taxeneEndpoint + docId + "?" + queryParameters;
	console.log("function constructApiUrl\n" + "apiUrl: " + apiUrl);
	return apiUrl;
}

function getSeleneJson(apiUrl) {
	var ajaxUrl = apiUrl;
	$.getJSON( ajaxUrl, function( data ){
		console.log(data);
		var table = "<table><thead><tr>";
		table += "<th>docId</th><th>Type</th><th>Weight</th><th>Slug</th>";
		table += "</tr></thead><tbody>";
		data.data.children.list.forEach( function(item, index) {
			var tr = "<tr>";
			tr += "<td>" + item.docId + "</td>";
			tr += "<td>" + item.nodeType.toLowerCase() + "</td>";
			tr += "<td>" + item.primaryParentWeight + "</td>";
			tr += "<td>" + "<a target='_blank' href='" + item.document.url + "'>" + item.document.slug + "</a>" + "</td>";
			tr +=  "</tr>";
			table += tr;
			//$( '#data' ).append(index + ": " + item.docId + "<br>");
		});
		table += "</tbody></table>";
		$( '#data' ).append(table);
		$( '#status' ).html("");
	});
}

