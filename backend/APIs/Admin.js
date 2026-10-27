import userlist from '../TempDatabase/UserDB.js'
import productlist from '../TempDatabase/ProductDB.js'
import { readBody, sendJson } from '../Utils/Utils.js'
import { requireAuth } from '../Utils/Guards.js'
import bcrypt from 'bcryptjs'

let uNextId = userlist.reduce((max, u) => Math.max(max, u.id), 0) + 1;
let pNextId = productlist.reduce((max, p) => Math.max(max, p.id), 0) + 1;

function requireAdmin(req, res) {
    const me = requireAuth(req, res)
    if (!me) return null
    if (me.role !== "admin") {
        sendJson(res, 403, { error: "Admin access required" })
        return null
    }
    return me
}

function publicUser(user) {
    const { password, ...profile } = user
    return profile
}

async function usersearch(req, res) {
    const me = requireAdmin(req, res)
    if (!me) return
    let data;
    try {
        data = await readBody(req)
    } catch {
        return sendJson(res, 400, { error: "Invalid JSON" })
    }
    if (data === null || typeof data !== "object") {
        return sendJson(res, 400, { error: "Body is not a valid JSON" })
    }
    const Input = {
        search: typeof data.search === "string" ? data.search.trim().toLowerCase() : "",
        role: typeof data.sort?.role === "string" ? data.sort.role.trim().toLowerCase() : "",
        asc: data.sort?.asc !== false,
        id: data.sort?.id === true,
        username: data.sort?.username === true,
        email: data.sort?.email === true,
    }
    let filteredusers = [...userlist]
    if (Input.search) {
        filteredusers = filteredusers.filter(u =>
            u.username.toLowerCase().includes(Input.search) ||
            u.email.toLowerCase().includes(Input.search) ||
            u.name.firstname.toLowerCase().includes(Input.search) ||
            u.name.lastname.toLowerCase().includes(Input.search)
        )
    }
    if (Input.role) {
        filteredusers = filteredusers.filter(u => u.role === Input.role)
    }
    if (Input.id) {
        filteredusers = filteredusers.sort((a, b) => {
            if (Input.asc) {
                return a.id - b.id
            } else {
                return b.id - a.id
            }
        })
    }
    if (Input.username) {
        filteredusers = filteredusers.sort((a, b) => {
            if (Input.asc) {
                return a.username.localeCompare(b.username)
            } else {
                return b.username.localeCompare(a.username)
            }
        })
    }
    if (Input.email) {
        filteredusers = filteredusers.sort((a, b) => {
            if (Input.asc) {
                return a.email.localeCompare(b.email)
            } else {
                return b.email.localeCompare(a.email)
            }
        })
    }
    return sendJson(res, 200, filteredusers.map(publicUser))
}

async function userpost(req, res) {
    const me = requireAdmin(req, res)
    if (!me) return
    let data;
    try {
        data = await readBody(req);
    } catch {
        return sendJson(res, 400, { error: "Invalid JSON" });
    }

    if (data === null || typeof data !== "object" || Array.isArray(data)) {
        return sendJson(res, 400, { error: "Body is not a valid JSON" });
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

    if (data.role !== undefined && data.role !== "user" && data.role !== "admin") {
        return sendJson(res, 400, { error: "Role must be user or admin" });
    }

    if (userlist.some((u) => u.email === data.email || u.username === data.username)) {
        return sendJson(res, 409, { error: "Email or username already exists" });
    }

    const user = {
        id: uNextId,
        role: data.role === "admin" ? "admin" : "user",
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

    uNextId = uNextId + 1;
    userlist.push(user);
    return sendJson(res, 201, publicUser(user));
}

async function singleuser(req, res) {
    const me = requireAdmin(req, res)
    if (!me) return
    const path = req.url.split("?")[0];
    const parts = path.split("/").filter(Boolean);
    const id = Number(parts[parts.length - 1]);
    const user = userlist.find(u => u.id === id)
    if (!user) {
        return sendJson(res, 404, { message: "No user with this ID exists" })
    }
    return sendJson(res, 200, publicUser(user))
}

async function edituser(req, res) {
    const me = requireAdmin(req, res)
    if (!me) return
    const path = req.url.split("?")[0];
    const parts = path.split("/").filter(Boolean);
    const id = Number(parts[parts.length - 1]);

    if (Number.isNaN(id)) {
        return sendJson(res, 400, { error: "Invalid user ID" })
    }

    const user = userlist.find(u => u.id === id)

    if (!user) {
        return sendJson(res, 404, { message: "No user with this ID exists" })
    }
    let data;
    try {
        data = await readBody(req);
    } catch {
        return sendJson(res, 400, { error: "Invalid JSON" });
    }
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
        return sendJson(res, 400, { error: "Body is not a valid JSON" })
    }
    if (data.email !== undefined && (typeof data.email !== "string" || !data.email.includes("@"))) {
        return sendJson(res, 400, { error: "A valid email is required" })
    }
    if (data.username !== undefined && (typeof data.username !== "string" || data.username.trim() === "")) {
        return sendJson(res, 400, { error: "Username must be a non-empty string" })
    }
    if (data.password !== undefined && (typeof data.password !== "string" || data.password === "")) {
        return sendJson(res, 400, { error: "Password must be a non-empty string" })
    }
    if (data.role !== undefined && data.role !== "user" && data.role !== "admin") {
        return sendJson(res, 400, { error: "Role must be user or admin" })
    }
    if (data.phone !== undefined && typeof data.phone !== "string") {
        return sendJson(res, 400, { error: "Phone must be a string" })
    }
    if (data.name !== undefined) {
        if (data.name === null || typeof data.name !== "object" || Array.isArray(data.name)) {
            return sendJson(res, 400, { error: "Name must be an object" })
        }
        if (data.name.firstname !== undefined && (typeof data.name.firstname !== "string" || data.name.firstname.trim() === "")) {
            return sendJson(res, 400, { error: "First name must be a non-empty string" })
        }
        if (data.name.lastname !== undefined && typeof data.name.lastname !== "string") {
            return sendJson(res, 400, { error: "Last name must be a string" })
        }
    }
    if (data.address !== undefined) {
        if (data.address === null || typeof data.address !== "object" || Array.isArray(data.address)) {
            return sendJson(res, 400, { error: "Address must be an object" })
        }
        if (data.address.geolocation !== undefined && (data.address.geolocation === null || typeof data.address.geolocation !== "object" || Array.isArray(data.address.geolocation))) {
            return sendJson(res, 400, { error: "Geolocation must be an object" })
        }
        if (data.address.geolocation?.lat !== undefined && typeof data.address.geolocation.lat !== "string") {
            return sendJson(res, 400, { error: "Latitude must be a string" })
        }
        if (data.address.geolocation?.long !== undefined && typeof data.address.geolocation.long !== "string") {
            return sendJson(res, 400, { error: "Longitude must be a string" })
        }
        if (data.address.city !== undefined && typeof data.address.city !== "string") {
            return sendJson(res, 400, { error: "City must be a string" })
        }
        if (data.address.street !== undefined && typeof data.address.street !== "string") {
            return sendJson(res, 400, { error: "Street must be a string" })
        }
        if (data.address.number !== undefined && (typeof data.address.number !== "number" || !Number.isFinite(data.address.number))) {
            return sendJson(res, 400, { error: "Address number must be a number" })
        }
        if (data.address.zipcode !== undefined && typeof data.address.zipcode !== "string") {
            return sendJson(res, 400, { error: "Zipcode must be a string" })
        }
    }
    if (data.email !== undefined && userlist.some(u => u.id !== user.id && u.email === data.email)) {
        return sendJson(res, 409, { error: "Email already exists" })
    }
    if (data.username !== undefined && userlist.some(u => u.id !== user.id && u.username === data.username)) {
        return sendJson(res, 409, { error: "Username already exists" })
    }

    if (data.email !== undefined) user.email = data.email;
    if (data.username !== undefined) user.username = data.username;
    if (data.role !== undefined) user.role = data.role;
    if (data.password !== undefined) user.password = await bcrypt.hash(data.password, 10);
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.name?.firstname !== undefined) user.name.firstname = data.name.firstname;
    if (data.name?.lastname !== undefined) user.name.lastname = data.name.lastname;
    if (data.address?.geolocation?.lat !== undefined) user.address.geolocation.lat = data.address.geolocation.lat;
    if (data.address?.geolocation?.long !== undefined) user.address.geolocation.long = data.address.geolocation.long;
    if (data.address?.city !== undefined) user.address.city = data.address.city;
    if (data.address?.street !== undefined) user.address.street = data.address.street;
    if (data.address?.number !== undefined) user.address.number = data.address.number;
    if (data.address?.zipcode !== undefined) user.address.zipcode = data.address.zipcode;
    return sendJson(res, 200, publicUser(user));
}

async function userdelete(req, res) {
    const me = requireAdmin(req, res)
    if (!me) return
    const path = req.url.split("?")[0];
    const parts = path.split("/").filter(Boolean);
    const id = Number(parts[parts.length - 1]);

    if (Number.isNaN(id)) {
        return sendJson(res, 400, { error: "Invalid user ID" })
    }

    const user = userlist.find(u => u.id === id)

    if (!user) {
        return sendJson(res, 404, { message: "No user with this ID exists" })
    }

    const index = userlist.indexOf(user)
    userlist.splice(index, 1)

    return sendJson(res, 200, { message: "User deleted" })
}

async function productsearch(req, res) {
    const me = requireAdmin(req, res)
    if (!me) return
    let data;
    try {
        data = await readBody(req)
    } catch {
        return sendJson(res, 400, { error: "Invalid JSON" })
    }
    if (data === null || typeof data !== "object") {
        return sendJson(res, 400, { error: "Body is not a valid JSON" })
    }
    const Input = {
        search: typeof data.search === "string" ? data.search.trim().toLowerCase() : "",
        category: typeof data.sort?.category === "string" ? data.sort.category.trim().toLowerCase() : "",
        asc: data.sort?.asc !== false,
        id: data.sort?.id === true,
        price: data.sort?.price === true,
        rating: data.sort?.rating === true,
    }
    let filteredproducts = [...productlist]
    if (Input.search) {
        filteredproducts = filteredproducts.filter(p => p.title.toLowerCase().includes(Input.search))
    }
    if (Input.category) {
        filteredproducts = filteredproducts.filter(p => p.category === Input.category)
    }
    if (Input.id) {
        filteredproducts = filteredproducts.sort((a, b) => {
            if (Input.asc) {
                return a.id - b.id
            } else {
                return b.id - a.id
            }
        })
    }
    if (Input.price) {
        filteredproducts = filteredproducts.sort((a, b) => {
            if (Input.asc) {
                return a.price - b.price
            } else {
                return b.price - a.price
            }
        })
    }
    if (Input.rating) {
        filteredproducts = filteredproducts.sort((a, b) => {
            if (Input.asc) {
                return a.rating.rate - b.rating.rate
            } else {
                return b.rating.rate - a.rating.rate
            }
        })
    }
    return sendJson(res, 200, filteredproducts)
}

async function productpost(req, res) {
    const me = requireAdmin(req, res)
    if (!me) return
    let data;
    try {
        data = await readBody(req);
    } catch {
        return sendJson(res, 400, { error: "Invalid JSON" });
    }

    if (data === null || typeof data !== "object" || Array.isArray(data)) {
        return sendJson(res, 400, { error: "Body is not a valid JSON" });
    }

    if (!data.title || typeof data.price !== "number") {
        return sendJson(res, 400, { error: "name and price are required" });
    }

    const product = {
        id: pNextId,
        userId: me.id,
        title: data.title,
        price: data.price,
        description: data.description,
        category: data.category,
        image: data.image,
        rating: { rate: 0, count: 0 }
    };
    pNextId = pNextId + 1;
    productlist.push(product);
    return sendJson(res, 201, product);
}

async function singleproduct(req, res) {
    const me = requireAdmin(req, res)
    if (!me) return
    const path = req.url.split("?")[0];
    const parts = path.split("/").filter(Boolean);
    const id = Number(parts[parts.length - 1]);
    const product = productlist.find(p => p.id === id)
    if (!product) {
        return sendJson(res, 404, { message: "No product with this ID exists" })
    }
    return sendJson(res, 200, product)
}

async function editproduct(req, res) {
    const me = requireAdmin(req, res)
    if (!me) return
    const path = req.url.split("?")[0];
    const parts = path.split("/").filter(Boolean);
    const id = Number(parts[parts.length - 1]);

    if (Number.isNaN(id)) {
        return sendJson(res, 400, { error: "Invalid product ID" })
    }

    const product = productlist.find(p => p.id === id)

    if (!product) {
        return sendJson(res, 404, { message: "No product with this ID exists" })
    }
    let data;
    try {
        data = await readBody(req);
    } catch {
        return sendJson(res, 400, { error: "Invalid JSON" });
    }
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
        return sendJson(res, 400, { error: "Body is not a valid JSON" })
    }
    if (data.title !== undefined && (typeof data.title !== "string" || data.title.trim() === "")) {
        return sendJson(res, 400, { error: "Title must be a non-empty string" })
    }
    if (data.price !== undefined && (typeof data.price !== "number" || !Number.isFinite(data.price) || data.price < 0)) {
        return sendJson(res, 400, { error: "Price must be a non-negative number" })
    }
    if (data.description !== undefined && typeof data.description !== "string") {
        return sendJson(res, 400, { error: "Description must be a string" })
    }
    if (data.category !== undefined && (typeof data.category !== "string" || data.category.trim() === "")) {
        return sendJson(res, 400, { error: "Category must be a non-empty string" })
    }
    if (data.image !== undefined && (typeof data.image !== "string" || data.image.trim() === "")) {
        return sendJson(res, 400, { error: "Image must be a non-empty string" })
    }
    if (data.title !== undefined) product.title = data.title;
    if (data.price !== undefined) product.price = data.price;
    if (data.description !== undefined) product.description = data.description;
    if (data.category !== undefined) product.category = data.category;
    if (data.image !== undefined) product.image = data.image;
    return sendJson(res, 200, product);
}

async function productdelete(req, res) {
    const me = requireAdmin(req, res)
    if (!me) return
    const path = req.url.split("?")[0];
    const parts = path.split("/").filter(Boolean);
    const id = Number(parts[parts.length - 1]);

    if (Number.isNaN(id)) {
        return sendJson(res, 400, { error: "Invalid product ID" })
    }

    const product = productlist.find(p => p.id === id)

    if (!product) {
        return sendJson(res, 404, { message: "No product with this ID exists" })
    }

    const index = productlist.indexOf(product)
    productlist.splice(index, 1)

    return sendJson(res, 200, { message: "Product deleted" })
}

export {
    usersearch,
    userpost,
    singleuser,
    edituser,
    userdelete,
    productsearch,
    productpost,
    singleproduct,
    editproduct,
    productdelete
}
