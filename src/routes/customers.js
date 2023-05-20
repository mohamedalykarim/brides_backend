const express = require("express")

const validateUser = require("../validate/users_validate")
const userHelper = require("../helper/user_helper")

const validateCutomer = require("../validate/customers_validate")
const customerHelper = require("../helper/customer_helper")


const router = express.Router()


// Get all customers
router.get("/", userHelper.verifyToken, async (req, res)=>{

    try {
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const customers = await customerHelper.getAllCustomers()

        res.status(200).json(customers)

    } catch (error) {
        res.status(500).json({Message : error})
    }
})


// Get customer Data
router.get("/:customerId", userHelper.verifyToken, async (req, res)=>{
    const customerId = req.params.customerId


    try {
        const validate = await validateCutomer.validateGetCustomer(customerId)

        const isAdmin = await validateUser.checkIsAdmin(req.userData)


        const customer = await customerHelper.getCustomer(customerId)

        res.status(200).json(customer)

    } catch (error) {
        res.status(500).json({Message : error})
    }
})

// Add Customer
router.post("/", userHelper.verifyToken, async (req, res)=>{
    const data = {
        customerName : req.body.customer_name,
        customerMobile : req.body.customer_mobile,
        customerFacebook : req.body.customer_facebook
    }

    try {
        const validate = await validateCutomer.validateAddCustomer(data)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const customer = await customerHelper.addNewCustomer(data)

        res.status(200).json(customer)

    } catch (error) {
        res.status(500).json({Message : error})
    }
})



// Edit Customer
router.put("/:customerId", userHelper.verifyToken, async (req, res)=>{
    const data = {
        customerId : req.params.customerId,
        customerName : req.body.customer_name,
        customerMobile : req.body.customer_mobile,
        customerFacebook : req.body.customer_facebook
    }
    
    try {
        const validate = await validateCutomer.validateEditProduct(data)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const customer = await customerHelper.editCustomer(data)
        res.status(200).json(customer)


    } catch (error) {
        res.status(500).json({Message : error})
    }
})

// Remove Customer
router.delete("/:customerId", userHelper.verifyToken, async (req, res)=>{

    const customerId = req.params.customerId

    try {
        const validate = await validateCutomer.validateRemoveCustomer(customerId)
        //TODO check if no invoice related to the customer
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const isDeleted = await customerHelper.deleteCustomer(customerId)

        if(isDeleted){
            res.status(200).json({
                Message: "Customer deleted successfully ",
                ProductId : customerId
            })
        }else{
            res.status(200).json({
                Message: "Customer Not found",
                ProductId : customerId
            })
        }
        

    } catch (error) {
        res.status(500).json({Message : error})
    }
})



module.exports = router