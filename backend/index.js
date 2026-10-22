const http = require("http");
const { handleExample } = require("./example"); // "./" means "same folder as this file"

// لیست محصولات (فعلاً به‌جای پایگاه داده)
let products = [
  { id: 1, name: "Laptop",   price: 32000000, stock: 5 },
  { id: 2, name: "Mouse",    price: 450000,   stock: 40 },
  { id: 3, name: "Keyboard", price: 1200000,  stock: 18 }
];
let nextId = 4; // id محصول بعدی
  const url = req.url;       

// تابع کمکی: ارسال پاسخ JSON
function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(data));
}

// تابع کمکی: خواندن بدنه (Body) درخواست
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const method = req.method; // GET, POST, PUT, DELETE
  const url = req.url;       // مثل "/products" یا "/products/2"
  const id = Number(url.split("/")[2]); // "/products/2" ← 2

  // ۱) GET /products  ← لیست همه محصولات
  if (method === "GET" && url === "/products") {
    return sendJson(res, 200, products);
  }

  // ۲) GET /products/2  ← یک محصول
  if (method === "GET" && url.startsWith("/products/")) {
    const product = products.find((p) => p.id === id);
    if (!product) {
      return sendJson(res, 404, { error: "Product not found" });
    }
    return sendJson(res, 200, product);
  }

  // ۳) POST /products  ← ساخت محصول جدید
  if (method === "POST" && url === "/products") {
    let data;
    try {
      data = await readBody(req);
    } catch {
      return sendJson(res, 400, { error: "Invalid JSON" });
    }

    if (!data.name || typeof data.price !== "number") {
      return sendJson(res, 400, { error: "name and price are required" });
    }

    const product = {
      id: nextId,
      name: data.name,
      price: data.price,
      stock: data.stock || 0
    };
    nextId = nextId + 1;
    products.push(product);
    return sendJson(res, 201, product);
  }

  // ۴) PUT /products/2  ← ویرایش محصول
  if (method === "PUT" && url.startsWith("/products/")) {
    const product = products.find((p) => p.id === id);
    if (!product) {
      return sendJson(res, 404, { error: "Product not found" });
    }

    let data;
    try {
      data = await readBody(req);
    } catch {
      return sendJson(res, 400, { error: "Invalid JSON" });
    }

    if (data.name !== undefined) product.name = data.name;
    if (data.price !== undefined) product.price = data.price;
    if (data.stock !== undefined) product.stock = data.stock;
    return sendJson(res, 200, product);
  }

  // ۵) DELETE /products/2  ← حذف محصول
  if (method === "DELETE" && url.startsWith("/products/")) {
    const product = products.find((p) => p.id === id);
    if (!product) {
      return sendJson(res, 404, { error: "Product not found" });
    }

    products = products.filter((p) => p.id !== id);
    return sendJson(res, 200, { message: "Product deleted" });
  }

  // ۶) Demo routes: GET /example and GET /example/2
  // handleExample lives in example.js. We pass it sendJson because that
  // helper is defined here; the module returns true if it answered.
  if (handleExample(req, res, sendJson)) {
    return;
  }

  // هر درخواست دیگری که به بالا نخورد
  sendJson(res, 404, { error: "Route not found" });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});