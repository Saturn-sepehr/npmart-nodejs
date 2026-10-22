// A tiny example API module.
// Its only purpose is to show how a route can live in its own file and be
// "imported" into index.js. It is NOT part of the products homework API.
//
// This project uses CommonJS ("type": "commonjs" in package.json), so:
//   export here       ->  module.exports = { ... }
//   import elsewhere  ->  const { ... } = require("./example")
//
// If this project used ES modules ("type": "module"), the same thing would be:
//   export { examples, handleExample }
//   import { examples, handleExample } from "./example.js"

const examples = [
  { id: 1, name: "Widget", note: "This data lives in example.js" },
  { id: 2, name: "Gadget", note: "index.js only calls the function" }
];

function handleExample(req, res, sendJson) {
  const method = req.method;
  const url = req.url.split("?")[0]; // ignore query strings for this demo

  // GET /example  -> all items
  if (method === "GET" && url === "/example") {
    sendJson(res, 200, examples);
    return true; // "I handled this request"
  }

  // GET /example/2 -> one item
  if (method === "GET" && url.startsWith("/example/")) {
    const id = Number(url.split("/")[2]);
    const item = examples.find((e) => e.id === id);

    if (!item) {
      sendJson(res, 404, { error: "Example not found" });
      return true;
    }

    sendJson(res, 200, item);
    return true;
  }

  return false; // not an /example route -> let index.js keep looking
}

// Export two things in one object:
//   examples      -> the data
//   handleExample -> the function that answers the HTTP request
module.exports = { examples, handleExample };
