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

// Send message to request the taxene children
// When we receive the response, create a table.
chrome.runtime.sendMessage({
	"message": "getTaxeneChildren",
	"url": window.location.href
}, function (response){
	var divOfChildren = "<div id='taxonomyChildrenTaxenePlugIn'>" + createTable(response) + "</div>";
	console.log(divOfChildren);
	$(divOfChildren).insertBefore("#header_1-0");
	
});

function createTable(list) {
	var table = "<table><thead></thead><tbody>";
	list.forEach( function(item, index) {
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
	return (table);
}
