/*
	Config settings for Selene api.	
*/
var seleneUrl = "http://nyselene1.ops.about.com:8080/";
var taxeneChildrenEndpoint = "taxene/children/";
var taxeneChildrenQueryParameters = "childrenNodeTypes=TAXONOMY&childrenNodeTypes=DOCUMENT&isRecursive=false&includeDocumentSummaries=true&includeConfigs=true";

var taxeneBreadcrumbEndpoint = "taxene/breadcrumb/";
var taxeneBreadcrumbQueryParameters = "includeDocumentSummaries=true";

/*
	Config settings for Solr api.	
*/
var solrUrl = "http://nyprsolr-read.ops.about.com:8983/";
var solrEndpoint = "solr/cmsDocs_rep/select";
var solrTimePeriod = "%5BNOW%2FDAY+TO+*%5D";
var solrQueryParameters = "q=vertical%3AHEALTH%0Astate%3AACTIVE%0AupdatedDate%3A" + solrTimePeriod + "&sort=updatedDate+desc&fl=docId%2Curl%2Cstate%2CtemplateType%2CupdatedDate%2CdirName%2Cchannel%2Ctitle&wt=json&indent=true";

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
	if (nodeId) {
		getTaxeneChildrenJson( constructTaxeneChildrenUrl(nodeId));
		getTaxeneBreadcrumbJson( constructTaxeneBreadcrumbUrl(nodeId));
	}
	getSolrJson( constructSolrUrl() );
	
	//console.log("recurse: " + recurse(accumulator, [] ));
	
}


function recurse(localAccumulator, arrayOfNumbers) {
	if (arrayOfNumbers.length == 0) {
		console.log ("no array");
		return 0;
	}
	console.log("typeof arrayofnumbers: " + typeof(arrayOfNumbers) + " arrayOfNumbers length: " + length + ", arrayOfNumbers.pop(): " + arrayOfNumbers.pop());
}


// DocId is (almost) always the numeric string following the last hyphen in the Verywell url.
function extractNodeId(url) {
	var lastIndexOfHyphen = url.lastIndexOf("-");
	if (lastIndexOfHyphen != -1) {
	    var nodeId = url.substring(lastIndexOfHyphen + 1);
        console.log("function extractNodeId\n" + "nodeId: " + nodeId);
		return nodeId;
	}
	return false;
}

function constructTaxeneChildrenUrl(docId) {
	var apiUrl = "";
	apiUrl += seleneUrl + taxeneChildrenEndpoint + docId + "?" + taxeneChildrenQueryParameters;
	console.log("function constructApiUrl\n" + "apiUrl: " + apiUrl);
	return apiUrl;
}

function constructTaxeneBreadcrumbUrl(docId) {
	var apiUrl = "";
	apiUrl += seleneUrl + taxeneBreadcrumbEndpoint + docId + "?" + taxeneBreadcrumbQueryParameters;
	console.log("function constructApiUrl\n" + "apiUrl: " + apiUrl);
	return apiUrl;
}

function constructSolrUrl() {
	var solrApiUrl = solrUrl + solrEndpoint + "?" + solrQueryParameters;
	console.log("solrUrl: " + solrApiUrl);
	return solrApiUrl;
}

function getTaxeneChildrenJson(apiUrl) {
	var ajaxUrl = apiUrl;
	$.getJSON( ajaxUrl, function( data ){
		console.log(data);
		var table = "<table><thead><tr>";
		table += "<th>docId</th><th>Type</th><th>Weight</th><th>Slug</th>";
		table += "</tr></thead><tbody>";
		data.data.children.list.forEach( function(item, index) {
			var cellArray = [
				item.docId,
				item.nodeType.toLowerCase(),
				item.primaryParentWeight.toLocaleString(),	
				"<a target='_blank' href='" + item.document.url + "'>" + item.document.slug + "</a>"
			];
			table += makeTr(cellArray);
		});
		table += "</tbody></table>";
		$( '#taxene-data' ).append("<h3>Children</h3>" + table);
		$( '#status' ).html("");
	});
}

function getTaxeneBreadcrumbJson(apiUrl) {
	var ajaxUrl = apiUrl;
	$.getJSON( ajaxUrl, function( data ){
		console.log("getTaxeneBreadcrumbJson:");
		console.log(data);
/*
		var ancestorArray;
		ancestorArray.push(readAncestor(data));
*/
	});
}

/*
function readParent(parentObject) {
	if (typeof parentObject.primaryParent != "undefined") {
		readParent(parentObject.primaryParent);
	}
}
*/

function getSolrJson(apiUrl) {
	var ajaxUrl = apiUrl;
	$.getJSON( ajaxUrl, function (data) {
		console.log(data);
		var table = "<table><thead><tr>";
		table += "<th>docId</th><th>Updated</th><th>Title</th><th>Slug</th>";
		table += "</tr></thead><tbody>";
		data.response.docs.forEach( function(item, index) {
			var cellArray = [
				item.docId,
				item.updatedDate,	
				"<a target='_blank' href='" + item.url + "'>" + item.title + "</a>",
				item.slug
			];
			table += makeTr(cellArray);
		});
		table += "</tbody></table>";
		$( '#solr-data' ).append("<h3>Approved docs</h3>" + table);
	});
}

function makeTr(cellArray) {
	var tr = "<tr>";
	cellArray.forEach ( function(item, index) {
		tr += "<td>" + item + "</td>";
	});
	tr += "</tr>";
	return tr;
}

// http://nyprsolr-read.ops.about.com:8983/solr/cmsDocs_rep/select?q=vertical%3AHEALTH%0Astate%3AACTIVE%0AupdatedDate%3A%5BNOW%2FDAY+TO+*%5D&sort=updatedDate+desc&fl=docId%2Curl%2Cstate%2CtemplateType%2CupdatedDate%2CdirName%2Cchannel%2Ctitle&wt=json&indent=true
