import { readBody, sendJson } from '../Utils/Utils.js'
import { requireAuth } from '../Utils/Guards.js'
import userlist from '../TempDatabase/UserDB.js'
import bcrypt from 'bcryptjs'


async function getownprofile(req, res) {

  const me = requireAuth(req, res);
  if (!me) return; 

  const { password, ...profile } = me;
  return sendJson(res, 200, profile);
}
async function getotherprofile(req, res) {

    const path = req.url.split("?")[0]
    const parts = path.split("/").filter(Boolean)
    const id = Number(parts[parts.length - 1])
    if (Number.isNaN(id)) {
        return sendJson(res, 400, { error: "Invalid user ID" })
    }
    const user = userlist.find((u) => u.id === id);
  if (!user) {
    return sendJson(res, 404, { error: "User not found" });
  }

      const { password, ...profile } = user;
    return sendJson(res, 200, profile)
}

async function editprofile (req , res){
      const me = requireAuth(req, res);
  if (!me) return;

      let data;
      try {
        data = await readBody(req);
      } catch {
        return sendJson(res , 400 , { error: "Invalid JSON" });
      }
      if(data === null || typeof data !== "object" || Array.isArray(data)){
        return sendJson(res , 400 , {error : "Body is not a valid JSON"})
      }
      if(data.email !== undefined && (typeof data.email !== "string" || !data.email.includes("@"))){
        return sendJson(res , 400 , {error : "A valid email is required"})
      }
      if(data.username !== undefined && (typeof data.username !== "string" || data.username.trim() === "")){
        return sendJson(res , 400 , {error : "Username must be a non-empty string"})
      }
      if("password" in data){
  return sendJson(res , 400 , {error : "Cannot edit password through this API"})
}
      if(data.phone !== undefined && typeof data.phone !== "string"){
        return sendJson(res , 400 , {error : "Phone must be a string"})
      }
      if(data.name !== undefined){
        if(data.name === null || typeof data.name !== "object" || Array.isArray(data.name)){
          return sendJson(res , 400 , {error : "Name must be an object"})
        }
        if(data.name.firstname !== undefined && (typeof data.name.firstname !== "string" || data.name.firstname.trim() === "")){
          return sendJson(res , 400 , {error : "First name must be a non-empty string"})
        }
        if(data.name.lastname !== undefined && typeof data.name.lastname !== "string"){
          return sendJson(res , 400 , {error : "Last name must be a string"})
        }
      }
      if(data.address !== undefined){
        if(data.address === null || typeof data.address !== "object" || Array.isArray(data.address)){
          return sendJson(res , 400 , {error : "Address must be an object"})
        }
        if(data.address.geolocation !== undefined && (data.address.geolocation === null || typeof data.address.geolocation !== "object" || Array.isArray(data.address.geolocation))){
          return sendJson(res , 400 , {error : "Geolocation must be an object"})
        }
        if(data.address.geolocation?.lat !== undefined && typeof data.address.geolocation.lat !== "string"){
          return sendJson(res , 400 , {error : "Latitude must be a string"})
        }
        if(data.address.geolocation?.long !== undefined && typeof data.address.geolocation.long !== "string"){
          return sendJson(res , 400 , {error : "Longitude must be a string"})
        }
        if(data.address.city !== undefined && typeof data.address.city !== "string"){
          return sendJson(res , 400 , {error : "City must be a string"})
        }
        if(data.address.street !== undefined && typeof data.address.street !== "string"){
          return sendJson(res , 400 , {error : "Street must be a string"})
        }
        if(data.address.number !== undefined && (typeof data.address.number !== "number" || !Number.isFinite(data.address.number))){
          return sendJson(res , 400 , {error : "Address number must be a number"})
        }
        if(data.address.zipcode !== undefined && typeof data.address.zipcode !== "string"){
          return sendJson(res , 400 , {error : "Zipcode must be a string"})
        }
      }
      if(data.email !== undefined && userlist.some(u => u.id !== me.id && u.email === data.email)){
        return sendJson(res , 409 , {error : "Email already exists"})
      }
      if(data.username !== undefined && userlist.some(u => u.id !== me.id && u.username === data.username)){
        return sendJson(res , 409 , {error : "Username already exists"})
      }

      if(data.email !== undefined) me.email = data.email;
      if(data.username !== undefined) me.username = data.username;

      if(data.phone !== undefined) me.phone = data.phone;
      if(data.name?.firstname !== undefined) me.name.firstname = data.name.firstname;
      if(data.name?.lastname !== undefined) me.name.lastname = data.name.lastname;
      if(data.address?.geolocation?.lat !== undefined) me.address.geolocation.lat = data.address.geolocation.lat;
      if(data.address?.geolocation?.long !== undefined) me.address.geolocation.long = data.address.geolocation.long;
      if(data.address?.city !== undefined) me.address.city = data.address.city;
      if(data.address?.street !== undefined) me.address.street = data.address.street;
      if(data.address?.number !== undefined) me.address.number = data.address.number;
      if(data.address?.zipcode !== undefined) me.address.zipcode = data.address.zipcode;

      const { password, ...profile } = me;
      return sendJson(res , 200 , profile);
}
async function editpassword(req, res) {
  const me = requireAuth(req, res);
  if (!me) return;
  let data;
  try {
    data = await readBody(req);
  } catch {
    return sendJson(res, 400, { error: "Invalid JSON" });
  }
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return sendJson(res, 400, { error: "Body is not a valid JSON" });
  }
  if (typeof data.password !== "string" || data.password === "") {
    return sendJson(res, 400, { error: "password is empty" });
  }
  if (typeof data.newpassword !== "string" || data.newpassword === "") {
    return sendJson(res, 400, { error: "new password is empty" });
  }
  const ok = await bcrypt.compare(data.password, me.password);
  if (!ok) {
    return sendJson(res, 403, { error: "incorrect password" });
  }
  me.password = await bcrypt.hash(data.newpassword, 10);
  const { password, ...profile } = me;
  return sendJson(res, 200, profile);
}

async function deleteuser(req, res) {
  const me = requireAuth(req, res);
  if (!me) return;
  const index = userlist.indexOf(me);
  if (index === -1) {
    return sendJson(res, 404, { error: "User not found" });
  }
  userlist.splice(index, 1);
  return sendJson(res, 200, { message: "User deleted" });
}

export { getownprofile, getotherprofile, editprofile, editpassword, deleteuser }
