/*
	This script sends taxonomy node url
	to background script, and receives
	a json object of information
	about the node's children in return.
	It injects that information onto the page,
	allowing content manager to analyze
	the taxaonomy structure.
NOTES
jQuery to select anchors with href matching a url: $('a[href^="http://example.com/external/link"]').
GET the children.
foreach child
	find matching anchor
	append the child's weight to the innertext or something
*/

// listener to get the list back
// This isn't working. Maybe I need to set up a port?
// No actually I think I just need a response callback in the sendMessage.
// The question now is how does background.js send the response?
/*
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log("content.js addListener received a message");
		if (request.message === "sendTaxeneChildren") {
			console.log(createTable(list));
		}
	}
);
*/

var url = window.location.href;
console.log("content.js url: " + url);

// sender to request the taxene children
chrome.runtime.sendMessage({
	"message": "getTaxeneChildren",
	"url": url
}, function (response){
	console.log(createTable(response));
});

function createTable(list) {
	var table = "<table><thead></thead><tbody>";
	list.forEach( function(item, index) {
		var tr = "<tr>";
		tr += "<td>" + item.docId + "</td>";
		tr += "<td>" + item.primaryParentWeight + "</td>";
		tr += "<td>" + "<a target='_blank' href='" + item.document.url + "'>" + item.document.slug + "</a>" + "</td>";
		tr +=  "</tr>";
		table += tr;
		//$( '#data' ).append(index + ": " + item.docId + "<br>");
	});
	table += "</tbody></table>";
	return (table);
}
