const cutomerErrors = require("../errors/customer_errors")

module.exports = {
    validateGetCustomer : (customerId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate get customer
            RESOLVE(true)
        })
    },

    validateAddCustomer : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate add customer
            RESOLVE(true)
        })
    },

    validateEditProduct : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate edit customer
            RESOLVE(true)
        })
    },

    validateRemoveCustomer : (customerId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate delete customer
            RESOLVE(true)
        })
    },


}