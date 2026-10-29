import "dotenv/config";
import http from "http";
import {
  productsearch,
  productpost,
  singleproduct,
  editproduct,
  productdelete,
  rateproduct,
  gettopratedproducts
} from "./APIs/Products.js";
import { register, login } from "./APIs/Auth.js";
import {
  getownprofile,
  getotherprofile,
  editprofile,
  editpassword,
  deleteuser
} from "./APIs/User.js";
import {
  usersearch,
  userpost,
  singleuser,
  edituser,
  userdelete,
  productsearch as adminProductsearch,
  productpost as adminProductpost,
  singleproduct as adminSingleproduct,
  editproduct as adminEditproduct,
  productdelete as adminProductdelete
} from "./APIs/Admin.js";
import { sendJson } from "./Utils/Utils.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  const method = req.method;
  const path = req.url.split("?")[0];
  const parts = path.split("/").filter(Boolean);
    // --- CORS HEADERS ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }
  // --------------------

  try {
    if (method === "POST" && path === "/auth/register") {
      return await register(req, res);
    }
    if (method === "POST" && path === "/auth/login") {
      return await login(req, res);
    }

    if (method === "GET" && path === "/users/me") {
      return await getownprofile(req, res);
    }
    if (method === "PUT" && path === "/users/me") {
      return await editprofile(req, res);
    }
    if (method === "PUT" && path === "/users/me/password") {
      return await editpassword(req, res);
    }
    if (method === "DELETE" && path === "/users/me") {
      return await deleteuser(req, res);
    }
    if (method === "GET" && parts[0] === "users" && parts.length === 2 && parts[1] !== "me") {
      return await getotherprofile(req, res);
    }

    if (method === "POST" && path === "/products/search") {
      return await productsearch(req, res);
    }
    if (method === "POST" && path === "/products") {
      return await productpost(req, res);
    }
        if (method === "GET" && path === "/topproducts") {
      return await gettopratedproducts(req, res);
    }
    if (parts[0] === "products" && parts.length === 2) {
      if (method === "GET") {
        return await singleproduct(req, res);
      }
      if (method === "PUT") {
        return await editproduct(req, res);
      }
      if (method === "DELETE") {
        return await productdelete(req, res);
      }
    }
    if (method === "POST" && parts[0] === "products" && parts.length === 3 && parts[2] === "rate") {
      return await rateproduct(req, res);
    }

    if (parts[0] === "admin") {
      if (method === "POST" && path === "/admin/users/search") {
        return await usersearch(req, res);
      }
      if (method === "POST" && path === "/admin/users") {
        return await userpost(req, res);
      }
      if (parts[1] === "users" && parts.length === 3) {
        if (method === "GET") {
          return await singleuser(req, res);
        }
        if (method === "PUT") {
          return await edituser(req, res);
        }
        if (method === "DELETE") {
          return await userdelete(req, res);
        }
      }

      if (method === "POST" && path === "/admin/products/search") {
        return await adminProductsearch(req, res);
      }
      if (method === "POST" && path === "/admin/products") {
        return await adminProductpost(req, res);
      }
      if (parts[1] === "products" && parts.length === 3) {
        if (method === "GET") {
          return await adminSingleproduct(req, res);
        }
        if (method === "PUT") {
          return await adminEditproduct(req, res);
        }
        if (method === "DELETE") {
          return await adminProductdelete(req, res);
        }
      }
    }

    return sendJson(res, 404, { error: "Route not found" });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      return sendJson(res, 500, { error: "Internal server error" });
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
