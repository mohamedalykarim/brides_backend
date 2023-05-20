const express = require('express')

const validateUser = require("../validate/users_validate")
const userHelper = require("../helper/user_helper")

const validateInventory = require("../validate/inventory_validate")
const inventoryHelper = require("../helper/inventory_helper")

const router = express.Router();

// get all Inventory
router.get("/", userHelper.verifyToken, async (req, res)=>{
    try {
        const isAdmin = validateUser.checkIsAdmin(req.userData)
        const allTransactions = await inventoryHelper.getAllTransactions()


        res.status(200).json(allTransactions)

    } catch (error) {
        res.status(500).json(error)
    }

})

// get one inventory transaction by id
router.get("/:inventoryId", userHelper.verifyToken, async (req, res)=>{
    const inventoryId = req.params.inventoryId

    try {
        const validate = await validateInventory.validateGetOneTransaction(inventoryId)
        const isAdmin = validateUser.checkIsAdmin(req.userData)
        const transaction = await inventoryHelper.getOneTransaction(inventoryId)

        res.status(200).json(transaction)

    } catch (error) {
        res.status(500).json(error)
    }
})

// add inventory
router.post("/", userHelper.verifyToken, async (req, res)=>{
    const data = {
        purchaseInvoiceId : req.body.purchase_invoice_id,
        salesInvoiceid : req.body.sale_invoice_id,
        productId : req.body.product_id,
        inventoryDetails : req.body.inventory_details,
        inventoryType : req.body.inventory_type,
        count : req.body.count,
        cost : req.body.cost,
        remain : req.body.remain
    }

    try {
        const validate = await validateInventory.validateAddInventory(data)
        const isAdmin = validateUser.checkIsAdmin(req.userData)
        const added = await inventoryHelper.addToInventory(data)


    } catch (error) {
        res.status(500).json(error)
    }
    
})

// update inventory
router.put("/:inventoryId", userHelper.verifyToken, async (req, res)=>{

    const data = {
        inventoryId : req.params.inventoryId,
        purchaseInvoiceId : req.body.purchase_invoice_id,
        salesInvoiceid : req.body.sale_invoice_id,
        productId : req.body.product_id,
        inventoryDetails : req.body.inventory_details,
        inventoryType : req.body.inventory_type,
        count : req.body.count,
        cost : req.body.cost,
        remain : req.body.remain
    }

    try {
        const validate = await validateInventory.validateUpdateInventory(data)
        const isAdmin = validateUser.checkIsAdmin(req.userData)
        const added = await inventoryHelper.updateInventory(data)


    } catch (error) {
        res.status(500).json(error)
    }
    
})

// Remove from inventory
router.delete("/:inventoryId", userHelper.verifyToken, async (req, res)=>{
    const inventoryId = req.params.inventoryId;

    try {
        const validate = await validateInventory.validateRemoveInventory(inventoryId)
        const isAdmin = validateUser.checkIsAdmin(req.userData)
        const isDeleted = await inventoryHelper.removeFromInventory(inventoryId)

        if(isDeleted){
            res.status(200).json({
                Message: "Removed from inventory successfully ",
                ProductId : inventoryId
            })
        }else{
            res.status(200).json({
                Message: "Not found in inventory",
                ProductId : inventoryId
            })
        }

    } catch (error) {
        res.status(500).json(error)
    }
})

// get remains of a product
router.get("/remain/:productId", userHelper.verifyToken, async (req, res)=>{
    const productId = req.params.productId

    try {
        const validate = await validateInventory.validateGetRemains(productId)
        const isAdmin = validateUser.checkIsAdmin(req.userData)
        const remain = await inventoryHelper.getRemains(productId)

        res.status(200).json(remain)

    } catch (error) {
        res.status(500).json(error)
    }
})

// update remains of a product
router.get("/remain/:productId", userHelper.verifyToken, async (req, res)=>{

    const productId = req.params.productId

    try {
        const validate = await validateInventory.validateUpdateRemains(productId)
        const isAdmin = validateUser.checkIsAdmin(req.userData)
        const isUpdated = await inventoryHelper.updateRemains(productId)

        if(isUpdated){
            res.status(200).json({
                Message: "Remains updated ",
                ProductId : productId
            })
        }else{
            res.status(200).json({
                Message: "Update remains doesn't completed",
                ProductId : productId
            })
        }



    } catch (error) {
        res.status(500).json(error)
    }

    
})


module.exports = router