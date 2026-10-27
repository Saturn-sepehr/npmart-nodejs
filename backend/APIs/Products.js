import productlist from '../TempDatabase/ProductDB.js'
import { readBody, sendJson } from '../Utils/Utils.js'
import { requireAuth } from '../Utils/Guards.js'


let pNextId = productlist.reduce((max, p) => Math.max(max, p.id), 0) + 1;

async function productsearch(req , res) {
    let data;
    try{
        data = await readBody(req)
    }catch{
        return sendJson(res , 400 , { error: "Invalid JSON"})
        
    }
    if(data === null || typeof data !== "object"){
        return sendJson(res , 400 , {error : "Body is not a valid JSON"})

    }
    const Input = {
        search : typeof data.search === "string" ? data.search.trim().toLowerCase() : "",
        category: typeof data.sort?.category === "string" ? data.sort.category.trim().toLowerCase() : "",
        asc: data.sort?.asc !== false,
        id: data.sort?.id === true,
        price: data.sort?.price === true,
        rating: data.sort?.rating === true,

    }
    let filteredproducts = [...productlist]
    if(Input.search){
        filteredproducts = filteredproducts.filter(p => p.title.toLowerCase().includes(Input.search))
    }
    if(Input.category){
        filteredproducts = filteredproducts.filter(p => p.category === Input.category)
    }

    
        if(Input.id) {
        filteredproducts = filteredproducts.sort((a,b) => {
            if(Input.asc){
               return a.id - b.id
            }else{
                return b.id - a.id
            }
        })
    }
        if(Input.price) {
        filteredproducts = filteredproducts.sort((a,b) => {
            if(Input.asc){
               return a.price - b.price
            }else{
                return b.price - a.price
            }
        })
    }
     if(Input.rating) {
        filteredproducts = filteredproducts.sort((a,b) => {
            if(Input.asc){
               return a.rating.rate - b.rating.rate
            }else{
                return b.rating.rate - a.rating.rate
            }
        })
    }
    return sendJson(res , 200 , filteredproducts)
}



async function productpost (req , res){
    const me = requireAuth(req, res)
    if (!me) return

    let data;
    try {
      data = await readBody(req);
    } catch {
      return sendJson(res, 400, { error: "Invalid JSON" });
    }

    if (!data.title || typeof data.price !== "number") {
      return sendJson(res, 400, { error: "name and price are required" });
    }

    const product = {
      id: pNextId,
      userId: me.id,
      title : data.title,
      price: data.price,
      description : data.description,
      category : data.category,
      image: data.image,
      rating:{rate : 0 , count:0}
    };
    pNextId = pNextId + 1;
    productlist.push(product);
    return sendJson(res, 201, product);
}

async function singleproduct (req , res){
      const path = req.url.split("?")[0];
      const parts = path.split("/").filter(Boolean);
      const id = Number(parts[parts.length - 1]);
      const product = productlist.find(p => p.id === id)
      if(!product) {
        return sendJson(res , 404 , {message : "No product with this ID exists"})
      }
      return sendJson(res , 200 , product)
}

async function editproduct (req , res){
      const me = requireAuth(req, res)
      if (!me) return

      const path = req.url.split("?")[0];
      const parts = path.split("/").filter(Boolean);
      const id = Number(parts[parts.length - 1]);

      if(Number.isNaN(id)) {
        return sendJson(res , 400 , {error : "Invalid product ID"})
      }

      const product = productlist.find(p => p.id === id)

      if(!product) {
        return sendJson(res , 404 , {message : "No product with this ID exists"})
      }

      if(product.userId !== me.id) {
        return sendJson(res , 403 , {error : "You can only edit your own products"})
      }
      let data;
      try {
        data = await readBody(req);
      } catch {
        return sendJson(res , 400 , { error: "Invalid JSON" });
      }
      if(data === null || typeof data !== "object" || Array.isArray(data)){
        return sendJson(res , 400 , {error : "Body is not a valid JSON"})
      }
      if(data.title !== undefined && (typeof data.title !== "string" || data.title.trim() === "")){
        return sendJson(res , 400 , {error : "Title must be a non-empty string"})
      }
      if(data.price !== undefined && (typeof data.price !== "number" || !Number.isFinite(data.price) || data.price < 0)){
        return sendJson(res , 400 , {error : "Price must be a non-negative number"})
      }
      if(data.description !== undefined && typeof data.description !== "string"){
        return sendJson(res , 400 , {error : "Description must be a string"})
      }
      if(data.category !== undefined && (typeof data.category !== "string" || data.category.trim() === "")){
        return sendJson(res , 400 , {error : "Category must be a non-empty string"})
      }
      if(data.image !== undefined && (typeof data.image !== "string" || data.image.trim() === "")){
        return sendJson(res , 400 , {error : "Image must be a non-empty string"})
      }
      if(data.title !== undefined) product.title = data.title;
      if(data.price !== undefined) product.price = data.price;
      if(data.description !== undefined) product.description = data.description;
      if(data.category !== undefined) product.category = data.category;
      if(data.image !== undefined) product.image = data.image;
      return sendJson(res , 200 , product);
}

async function productdelete (req , res){
      const me = requireAuth(req, res)
      if (!me) return

      const path = req.url.split("?")[0];
      const parts = path.split("/").filter(Boolean);
      const id = Number(parts[parts.length - 1]);

      if(Number.isNaN(id)) {
        return sendJson(res , 400 , {error : "Invalid product ID"})
      }

      const product = productlist.find(p => p.id === id)

      if(!product) {
        return sendJson(res , 404 , {message : "No product with this ID exists"})
      }

      if(product.userId !== me.id) {
        return sendJson(res , 403 , {error : "You can only delete your own products"})
      }

      const index = productlist.indexOf(product)
      productlist.splice(index , 1)

      return sendJson(res , 200 , {message : "Product deleted"})
}


async function rateproduct (req , res){
      const path = req.url.split("?")[0];
      const parts = path.split("/").filter(Boolean);
      const id = Number(parts[parts.length - 1]);
      const product = productlist.find(p => p.id === id)
      if(!product) {
        return sendJson(res , 404 , {message : "No product with this ID exists"})
      }
    let data
    try{
        data = await readBody(req)
    }catch{
        return sendJson(res , 400 , { error: "Invalid data"})
        
    }
    if(data === null || typeof data !== "object" || typeof data.rating !== "number" || data.rating < 0 || data.rating > 5){
        return sendJson(res , 400 , {error : "Rating must be a number from 0-5"})

    }

    const meanrating = product.rating.rate
    const ratingcount = product.rating.count
    product.rating.count = ratingcount + 1
    product.rating.rate = (meanrating * ratingcount + data.rate) / (ratingcount + 1)
    return sendJson(res , 200 , product.rating.rate)
}

export {
    productsearch,
    productpost,
    singleproduct,
    editproduct,
    productdelete,
    rateproduct
}

