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


var eosApprovalAppUrl = "https://eos.ops.about.com/tools/pending/";
var currentTabUrl = window.location.href;
console.log("currentTabUrl: " + window.location.href);

if (currentTabUrl == eosApprovalAppUrl) {
	console.log("eos!");
	$( 'table' ).DataTable();
	// .DataTable();
}

// Send message to request the taxene children
// When we receive the response, create a table.
chrome.runtime.sendMessage({
	"message": "getTaxeneChildren",
	"url": window.location.href
}, function (response){
	var toggleButton = createToggleButton();
	var childrenTable = createTable(response);
	var divOfChildren = "<div id='taxonomyChildrenTaxenePlugIn'>" + toggleButton + childrenTable + "</div>";
	console.log(divOfChildren);
	$( "body" ).append(divOfChildren);
	$( "#taxonomyChildrenTaxenePlugIn" ).draggable();
	addButtonListener();
});

function createToggleButton() {
	return "<a id='taxenePluginToggleButton'>+</a>";
}

function addButtonListener() {
	var $containerDiv = $( "#taxonomyChildrenTaxenePlugIn" );
	$containerDiv.find("#taxenePluginToggleButton").on("click", function() {
		$containerDiv.toggleClass("collapsed");
	});
}

function createTable(list) {
	var table = "<table><thead><tr>";
	table += "<th>docId</th><th>Type</th><th>Weight</th><th>Slug</th>";
	table += "</tr></thead><tbody>";
	list.forEach( function(item, index) {
		var tr = "<tr>";
		tr += "<td>" + item.docId + "</td>";
			tr += "<td>" + item.nodeType.toLowerCase() + "</td>";
		tr += "<td>" + item.primaryParentWeight.toLocaleString() + "</td>";
		tr += "<td>" + "<a target='_blank' href='" + item.document.url + "'>" + item.document.slug + "</a>" + "</td>";
		tr +=  "</tr>";
		table += tr;
	});
	table += "</tbody></table>";
	return (table);
}
