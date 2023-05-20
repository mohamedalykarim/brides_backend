const pool = require("../database/pool")
const productError = require("../errors/product_errors")

module.exports = {

    // Get product by id
    getProductDataById : async (productId) => {
        return new Promise((RESOLVE, REJECT)=>{
            const query = "SELECT * FROM products WHERE product_id = ?";
            pool.query(query, [productId], (error, result)=>{
                if(error){
                    REJECT(error)
                    return
                } 
                if(result.length === 0){
                    REJECT(productError.PRODUCT_NOT_EXISTS)
                    return  
                } 

                const productDatabase = result[0];
                const product = {
                    productName  : productDatabase.product_name,
                    productModel : productDatabase.product_model,
                    productCategory : productDatabase.product_category
                }

                RESOLVE(product)


            })
        })
    }, 

    // Get all products
    getAllProducts : async () => {
        return new Promise((RESOLVE, REJECT)=>{
            const query = "SELECT * FROM products ORDER BY product_category ASC, product_model ASC, product_name ASC";
            pool.query(query, [], (error, results)=>{
                if(error){
                    REJECT(error)
                    return
                } 
                if(results.length === 0){
                    REJECT(productError.PRODUCT_NOT_EXISTS)
                    return  
                } 

                const products = [];


                results.forEach((result)=>{
                    products.push({
                        productName  : result.product_name,
                        productModel : result.product_model,
                        productCategory : result.product_category
                    })

                })


                RESOLVE(products)


            })
        })
    }, 

    // Add Product
    addProduct : async (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "INSERT INTO products SET product_category = ?, product_model = ?, product_name = ?; SELECT LAST_INSERT_ID() as id;"
            console.log(data);
            pool.query(
                query, 
                [data.productCategory, data.productModel, data.productName],
                (error , result) =>{
                    if(error){
                        REJECT(error)
                        return
                    } 

                    const insertedId = result[1][0].id

                    const product = {
                        productId : insertedId,
                        productName  : data.productName,
                        productModel : data.productModel,
                        productCategory : data.productCategory
                    }

                    RESOLVE(product)
                

                })

        })
    },

    //Edit product
    editProduct : async (data)=>{
        return new Promise((RESOLVE, REJECT)=> {
            const query = "UPDATE products SET product_name = ?, product_model = ?, product_category = ? WHERE product_id = ?"
            pool.query(query, [data.productName, data.productModel, data.productCategory, data.productId], (error, result)=>{
                if(error){
                    REJECT(error)
                    return
                }else{
                    data = {
                        productId : data.productId,
                        productName  : data.productName,
                        productModel : data.productModel,
                        productCategory : data.productCategory
                    }


                    RESOLVE(data)
                }

                

            })
        })        
    },

    //Delete product
    deleteProduct : async (productId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "DELETE FROM products WHERE product_id = ?";
            pool.query(query, [productId], (error, result)=> {
                if(error){
                    REJECT(error)
                    return
                }else{
                    if(result.affectedRows === 1) {
                        RESOLVE(true)
                    }else{
                        RESOLVE(false)
                    }
                }

            })
        })
    }

}