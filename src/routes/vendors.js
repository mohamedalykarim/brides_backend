const express = require("express")

const validateUser = require("../validate/users_validate")
const userHelper = require("../helper/user_helper")

const validateVendor = require("../validate/vendors_validate")
const helper = require("../helper/vendor_helper")

const router = express.Router()

// Get all vendors
router.get("/", userHelper.verifyToken, async (req, res)=>{

    try {
        const isAdmin = await validateUser.checkIsAdmin(req.userData)
        const vendors = await helper.getAllVendors()

        console.log("test");


        res.status(200).json(vendors)

    } catch (error) {
        res.status(500).json({Message : error})
    }
})


// Get vendor Data
router.get("/:vendorId", userHelper.verifyToken, async (req, res)=>{
    const vendorId = req.params.vendorId


    try {
        const validate = await validateVendor.validateGetVendor(vendorId)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)


        const vendor = await helper.getVendor(vendorId)

        res.status(200).json(vendor)

    } catch (error) {
        res.status(500).json({Message : error})
    }
})

// Add Vendor
router.post("/", userHelper.verifyToken, async (req, res)=>{
    const data = {
        vendorName : req.body.vendor_name,
        vendorMobile : req.body.vendor_mobile,
        vendorFacebook : req.body.vendor_facebook
    }


    try {
        const validate = await validateVendor.validateAddVendor(data)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const vendor = await helper.addNewVendor(data)



        res.status(200).json(vendor)

    } catch (error) {
        res.status(500).json({Message : error})
    }
})

// Edit Vendor
router.put("/:vendorId", userHelper.verifyToken, async (req, res)=>{
    const data = {
        vendorId : req.params.vendorId,
        vendorName : req.body.vendor_name,
        vendorMobile : req.body.vendor_mobile,
        vendorFacebook : req.body.vendor_facebook
    }
    
    try {
        const validate = await validateVendor.validateEditProduct(data)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const vendor = await helper.editVendor(data)
        res.status(200).json(vendor)


    } catch (error) {
        res.status(500).json({Message : error})
    }
})

// Remove Vendor
router.delete("/:vendorId", userHelper.verifyToken, async (req, res)=>{
    const vendorId = req.params.vendorId

    try {
        const validate = await validateVendor.validateRemoveVendor(vendorId)
        //TODO check if no invoice related to the vendor
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const isDeleted = await helper.deleteVendor(vendorId)

        if(isDeleted){
            res.status(200).json({
                Message: "Vendor deleted successfully ",
                ProductId : vendorId
            })
        }else{
            res.status(200).json({
                Message: "Vendor Not found",
                ProductId : vendorId
            })
        }
        

    } catch (error) {
        res.status(500).json({Message : error})
    }
})



module.exports = router