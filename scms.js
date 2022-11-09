const scmsUrl = "http://127.0.0.1:3001/scms";

async function getContent(slug, selector) {
	let node = document.querySelector(selector);
	if (!node) return;

	node.innerHTML = "<div class='fetching'></div>";
	
	let content = await fetchGet(scmsUrl + "/contents/view/", {slug: slug});
	let result;
	if (content.content) {
		node.innerHTML = undelta(content.content.content);
		result = true;
	} else {
		node.innerHTML = "<p>Unable to get content</p>";
		result = false;
	}
	
	return result;
}
async function getHTML(slug, selector) {
	let node = document.querySelector(selector);
	if (!node) return;

	node.innerHTML = "<div class='fetching'></div>";
	
	let content = await fetchGet(scmsUrl + "/contents/view/", {slug: slug, text: true});
	let result;
	if (content.content) {
		node.innerHTML = content.content.text.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
		result = true;
	} else {
		node.innerHTML = "<p>Unable to get content</p>";
		result = false;
	}
	
	return result;
}
async function getComments(slug) {
	let comments = await fetchGet(scmsUrl + "/contents/comments/", {slug: slug});
	return comments.comments;
}
async function fetchGet(resource, body) {
	if (!body) body = {};
	let params = new URLSearchParams(body);
	let response = await fetch(resource + "?" + params, {
		credentials: "include",
		method: "GET",
		headers: {"Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"},
	});
	let json = await response.json();
	return json;
}
async function fetchPost(resource, body) {
	if (!body) body = {};
	let response = await fetch(resource, {
		credentials: "include",
		method: "POST",
		headers: {"Accept": "application/json", "Content-Type": "application/json"},
		body: JSON.stringify(body),
	});
	let json = await response.json();
	return json;
}
async function fetchPut(resource, body) {
	if (!body) body = {};
	let response = await fetch(resource, {
		credentials: "include",
		method: "PUT",
		headers: {"Accept": "application/json", "Content-Type": "application/json"},
		body: JSON.stringify(body),
	});
	let json = await response.json();
	return json;
}
async function fetchDelete(resource, body) {
	if (!body) body = {};
	let response = await fetch(resource, {
		credentials: "include",
		method: "DELETE",
		headers: {"Accept": "application/json", "Content-Type": "application/json"},
		body: JSON.stringify(body),
	});
	let json = await response.json();
	return json;
}
let quill = new Quill(document.createElement("div"));
function undelta(delta) {
	quill.setContents(JSON.parse(delta));
	return quill.root.innerHTML.replace(/ target="_blank"/g, "");
}