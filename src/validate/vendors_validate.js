const vendorErrors = require("../errors/vendor_errors")

module.exports = {

    validateGetVendor : (vendorId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate get vendor
            RESOLVE(true)
        })
    },

    validateAddVendor : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate add Vendor
            RESOLVE(true)
        })
    },

    validateEditProduct : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate edit Vendor
            RESOLVE(true)
        })
    },

    validateRemoveVendor : (vendorId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate delete Vendor
            RESOLVE(true)
        })
    },
    
}