// @ts-nocheck

// https://unpoly.com/templates#template-engine-example
up.on("up:template:clone", '[type="text/minimustache"]', (event) => {
	const filled = event.target.innerHTML.replace(/{{(\w+)}}/g, (_, v) =>
		up.util.escapeHTML(event.data[v]),
	);
	event.nodes = up.element.createNodesFromHTML(filled);
});
