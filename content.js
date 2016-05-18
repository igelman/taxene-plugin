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
	var toggleButton = createToggleButton();
	var childrenTable = createTable(response);
	var divOfChildren = "<div id='taxonomyChildrenTaxenePlugIn'>" + toggleButton + childrenTable + "</div>";
	console.log(divOfChildren);
	$("body").append(divOfChildren);
	addButtonListener();
});

function createToggleButton() {
	return "<a id='taxenePluginToggleButton'>+</a>";
}

function addButtonListener() {
	var $containerDiv = $("#taxonomyChildrenTaxenePlugIn");
	$containerDiv.find("#taxenePluginToggleButton").on("click", function() {
		$containerDiv.animate({height:'50px'}); //toggleClass("collapsed");
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
		tr += "<td>" + item.primaryParentWeight + "</td>";
		tr += "<td>" + "<a target='_blank' href='" + item.document.url + "'>" + item.document.slug + "</a>" + "</td>";
		tr +=  "</tr>";
		table += tr;
	});
	table += "</tbody></table>";
	return (table);
}

/*
	Scope the listener and button to MY container to make sure I don't conflict with a class
	
	$container = $('#container');
	$container.find('.button').on('click', function() {
		$container.toggleClass('collapsed');	
	});
*/
