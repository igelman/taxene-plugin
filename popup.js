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
	https://jira.corp.about-inc.com/browse/HN-1503
	http://nyqasolrmaster1.ops.about.com:8983/solr/cmsDocs/select?q=state%3AACTIVE%0Avertical%3AHEALTH%0AactiveDate%3A%5BNOW%2FYEAR+TO+*%5D&sort=activeDate+desc&wt=json&indent=true
	http://nyprsolr-read.ops.about.com:8983/solr/cmsDocs_rep/select?q=vertical%3AHEALTH%0Astate%3AACTIVE%0A-rootUrl%3A*about.com*&sort=updatedDate+desc&wt=json&indent=true
*/
var solrUrl = "http://nyprsolr-read.ops.about.com:8983/";
var solrEndpoint = "solr/cmsDocs_rep/select";
//var solrTimePeriod = "%5BNOW%2FMONTH+TO+*%5D"; // start of current day => now
//var solrQueryParameters = "q=vertical%3AHEALTH%0Astate%3AACTIVE%0A-rootUrl%3A*about.com*%0AactiveDate%3A" + solrTimePeriod + "&sort=activeDate+desc&rows=200&fl=docId%2Curl%2Cstate%2CtemplateType%2CactiveDate%2CdirName%2Cchannel%2Ctitle&wt=json&indent=true";
var solrQuery = "vertical:HEALTH state:ACTIVE -rootUrl:*about.com* activeDate:[NOW/MONTH TO *]";
var solrFieldList = "docId,url,state,templateType,activeDate,dirName,channel,title,authorKey,updatedDate";
var solrSort = "activeDate desc";
var solrRows = "200";

var solrQueryParameters = "q=" + encodeURIComponent(solrQuery) + "&fl=" + encodeURIComponent( solrFieldList) + "&sort=" + encodeURIComponent(solrSort) + "&rows=" + encodeURIComponent(solrRows) + "&wt=json&indent=true"
//var solrQueryParameters = "q=vertical%3AHEALTH%0Astate%3AACTIVE%0AupdatedDate%3A" + solrTimePeriod + "&sort=updatedDate+desc&fl=docId%2Curl%2Cstate%2CtemplateType%2CupdatedDate%2CdirName%2Cchannel%2Ctitle&wt=json&indent=true";

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
		$( '#taxene-data' ).append("<h3><a name='children'></a>Children <a class='link-to-top' href='#top'>top &#8593;</a></h3>" + table);
		$( '#table-of-contents-ul' ).append("<li><a href='#children'>Children</a></li>");
		$( '#status' ).html("");
	});
}

function getTaxeneBreadcrumbJson(apiUrl) {
	var ajaxUrl = apiUrl;
	$.getJSON( ajaxUrl, function( data ){
		console.log("getTaxeneBreadcrumbJson:");
		console.log(data);
		
		var table = "<table><thead><tr>";
		table += "<th>docId</th><th>Slug</th><th>Title</th><th>Short heading</th><th>Parent weight</th>";
		table += "</tr></thead><tbody>";

		
		var ancestorsObject = data.data.primaryParent;
		var ancestorsArray = [];
		var hasParent = true;
		while (hasParent == true) {
			var ancestor = readAncestor(ancestorsObject);
			var cellArray = [
				ancestor.docId,
				"<a target='_blank' href='" + ancestor.url + "'>" + ancestor.slug + "</a>",
				ancestor.title,
				ancestor.shortHeading,
				ancestor.primaryParentWeight
			];
			table += makeTr(cellArray);
			ancestorsArray.push(ancestor);
			ancestorsObject = ancestor.primaryParent;
			if (typeof ancestor.primaryParent == "undefined") {
				hasParent = false;
			}
			console.log("typeof ancestor.primaryParent: " + typeof ancestor.primaryParent);
		}
		table += "</tbody></table>";
		$( '#taxene-breadcrumb' ).append("<h3><a name='breadcrumb'></a>Breadcrumb <a class='link-to-top' href='#top'>top &#8593;</a></h3>" + table);
		$( '#table-of-contents-ul' ).append("<li><a href='#breadcrumb'>Breadcrumb</a></li>");
		console.log("ancestorsArray: " + ancestorsArray);
	});
}


function readAncestor(ancestorObject) {
	var ancestor = {};
	ancestor.docId = ancestorObject.docId;
	ancestor.url = ancestorObject.document.url;
	ancestor.slug = ancestorObject.document.slug;
	ancestor.title = ancestorObject.document.title;
	ancestor.shortHeading = ancestorObject.document.shortHeading;
	ancestor.primaryParentWeight = ancestorObject.primaryParentWeight;
	ancestor.primaryParent = ancestorObject.primaryParent;
	console.log(ancestor);
	
	return ancestor;
}

function getSolrJson(apiUrl) {
	var ajaxUrl = apiUrl;
	$.getJSON( ajaxUrl, function (data) {
		console.log(data);
		var table = "<table><thead><tr>";
		table += "<th>Doc id</th><th>Updated date</th><th>Title</th><th>Template</th><th>Author</th>";
		table += "</tr></thead><tbody>";
		data.response.docs.forEach( function(item, index) {
			var cellArray = [
				item.docId,
				item.updatedDate,	
				"<a target='_blank' href='" + item.url + "'>" + item.title + "</a>",
				item.templateType.toLowerCase(),
				item.authorKey
			];
			table += makeTr(cellArray);
		});
		table += "</tbody></table>";
		var solrInfo = "query: " + solrQuery + "<br>Fields: " + solrFieldList + "<br>Rows: " + solrRows;
		$( '#solr-data' ).append("<h3><a name='approved-docs'></a>Approved docs <a class='link-to-top' href='#top'>top &#8593;</a></h3>" + "<p><pre>" + solrInfo + "</pre></p>" + table);
		$( '#table-of-contents-ul' ).append("<li><a href='#approved-docs'>Approved docs</a></li>");
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
