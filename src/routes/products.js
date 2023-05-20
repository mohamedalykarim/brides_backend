const express = require('express')

const validateProduct = require("../validate/products_validate")
const validateUser = require("../validate/users_validate")
const productHelper = require("../helper/product_helper")
const userHelper = require("../helper/user_helper")


const router = express.Router();


// Get Product
router.get("/:productId", userHelper.verifyToken, async (req, res)=>{
    const productId = req.params.productId


    try {
        const validate = await validateProduct.validateGetProduct(productId)
        const product = await productHelper.getProductDataById(productId)
        res.status(200).json(product)

    } catch (error) {
        res.status(500).json({Message : error})
    }
})


// Get ALL Product
router.get("/", userHelper.verifyToken, async (req, res)=>{
    try{
        const products = await productHelper.getAllProducts()
        res.status(200).json(products)
    }catch (error) {
        res.status(500).json({Message : error})
    }
})

// Add Product
router.post("/", userHelper.verifyToken, async (req, res)=>{
    data = {
        productName  : req.body.product_name,
        productModel : req.body.product_model,
        productCategory : req.body.product_category
    }

    try {
        const validate = await validateProduct.validateAddProduct(data)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const product = await productHelper.addProduct(data)

        res.status(200).json(product)


    } catch (error) {
        res.status(500).json({Message : error})
    }
})

// Edit Product
router.put("/:productId", userHelper.verifyToken, async (req, res)=>{
    const data = {
        productId : req.params.productId,
        productName  : req.body.product_name,
        productModel : req.body.product_model,
        productCategory : req.body.product_category
    }
    
    try {
        const validate = await validateProduct.validateEditProduct(data)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const product = await productHelper.editProduct(data)
        res.status(200).json(product)


    } catch (error) {
        res.status(500).json({Message : error})
    }
})

// Remove Product
router.delete("/:productId", userHelper.verifyToken, async (req, res)=>{

    const productId = req.params.productId

    try {
        const validate = await validateProduct.validateRemoveProduct(productId)
        //TODO check if no invoice has the product
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const isDeleted = await productHelper.deleteProduct(productId)

        if(isDeleted){
            res.status(200).json({
                Message: "Product deleted successfully ",
                ProductId : productId
            })
        }else{
            res.status(200).json({
                Message: "Product Not found",
                ProductId : productId
            })
        }

        
        

    } catch (error) {
        res.status(500).json({Message : error})
    }
})


module.exports = router