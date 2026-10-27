import jwt from "jsonwebtoken";
import { sendJson } from "./Utils.js";
import userlist from "../TempDatabase/UserDB.js";

// Fail loudly at startup instead of silently returning 401 for every request.
// Start the server with: node --env-file=.env index.js
if (!process.env.SECRET) {
  throw new Error("SECRET is missing. Start the server with: node --env-file=.env index.js");
}

// Step 1: read "Authorization: Bearer <token>"
// Step 2: verify the signature + expiry
// Step 3: turn the token's subject (sub) into an actual user
// Returns the user, or null if any step fails. Sends nothing.
function getUser(req) {
  const header = req.headers["authorization"] || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;

  try {
    const payload = jwt.verify(token, process.env.SECRET);
    return userlist.find((u) => u.id === Number(payload.sub)) || null;
  } catch {
    // bad signature, expired token, malformed string
    return null;
  }
}

// Gate for logged-in-only endpoints.
// Returns the user, OR sends 401 and returns null.
function requireAuth(req, res) {
  const user = getUser(req);
  if (!user) {
    sendJson(res, 401, { error: "Authentication required" });
    return null;
  }
  return user;
}

export { getUser, requireAuth };
