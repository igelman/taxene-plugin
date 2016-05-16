/*
NOTES
jQuery to select anchors with href matching a url: $('a[href^="http://example.com/external/link"]').
GET the children.
foreach child
	find matching anchor
	append the child's weight to the innertext or something
*/

/*
	Config settings for Selene api.	
*/
var seleneUrl = "http://nyselene1.ops.about.com:8080/";
var taxeneEndpoint = "taxene/children/";
var queryParameters = "childrenNodeTypes=TAXONOMY&childrenNodeTypes=DOCUMENT&isRecursive=false&includeDocumentSummaries=true&includeConfigs=true";


var url = window.location.href;
var nodeId = extractNodeId(url);
var apiUrl = constructApiUrl(nodeId);
getSeleneJson(apiUrl);

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

// this fails because of the insecure request to Selene
// Handle it in background js maybe?
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
		console.log(table);
	});
}

