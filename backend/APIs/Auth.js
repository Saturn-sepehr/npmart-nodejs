import { readBody, sendJson } from '../Utils/Utils.js'
import userlist from '../TempDatabase/UserDB.js'
import 'dotenv/config'
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

async function register(req , res) {
    let data;
    try {
      data = await readBody(req);
    } catch {
      return sendJson(res, 400, { error: "Invalid JSON" });
    }

    if (typeof data.email !== "string" || !data.email.includes("@")) {
      return sendJson(res, 400, { error: "A valid email is required" });
    }

    if (typeof data.username !== "string" || !data.username) {
      return sendJson(res, 400, { error: "Username is required" });
    }

    if (typeof data.password !== "string" || !data.password) {
      return sendJson(res, 400, { error: "Password is required" });
    }

    if (!data.name || typeof data.name.firstname !== "string" || !data.name.firstname) {
      return sendJson(res, 400, { error: "name.firstname is required" });
    }

    if (userlist.some((u) => u.email === data.email || u.username === data.username)) {
      return sendJson(res, 409, { error: "Email or username already exists" });
    }

    const id = userlist.reduce((max, u) => Math.max(max, u.id), 0) + 1;

    const user = {
      id,
      role: "user",
      email: data.email,
      username: data.username,
      password: await bcrypt.hash(data.password, 10),
      name: {
        firstname: data.name.firstname,
        lastname: typeof data.name.lastname === "string" ? data.name.lastname : "",
      },
      phone: typeof data.phone === "string" ? data.phone : "",
      address: {
        geolocation: {
          lat: typeof data.address?.geolocation?.lat === "string" ? data.address.geolocation.lat : "",
          long: typeof data.address?.geolocation?.long === "string" ? data.address.geolocation.long : "",
        },
        city: typeof data.address?.city === "string" ? data.address.city : "",
        street: typeof data.address?.street === "string" ? data.address.street : "",
        number: typeof data.address?.number === "number" ? data.address.number : 0,
        zipcode: typeof data.address?.zipcode === "string" ? data.address.zipcode : "",
      },
    };

    userlist.push(user);
    return sendJson(res, 201, user);
}

async function login(req , res) {
  let data;
  try {
    data = await readBody(req);
  } catch {
    return sendJson(res, 400, { error: "Invalid JSON" });
  }
  const user = userlist.find(u => u.username === data.username)
  if (!user) {
    return sendJson(res, 401, { error: "Invalid credentials" });
}
    if (typeof data.username !== "string" || typeof data.password !== "string") {
      return sendJson(res, 400, { error: "Username and password fields must be filled" });
    }



    if (!(await bcrypt.compare(data.password, user.password))) {
  return sendJson(res, 401, { error: "Invalid credentials" });
}

    
    const token = jwt.sign({sub: user.id , role: user.role}, process.env.SECRET ,{expiresIn:"1h"}  )

    return sendJson(res, 200, token);
}




export { register, login };