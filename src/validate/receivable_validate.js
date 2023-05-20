const accountReceivableErrors = require("../errors/accounts_Receivable_errors")

module.exports = {
    validateAddToReceivable : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate add to receivable account
            RESOLVE(true)
        })
    }, 
    validatGetFromReceivableAccount : (transactionId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate get from receivable account
            RESOLVE(true)
        })
    },

    validatGetFromReceivableAccountByCustomer : (customerId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate get from receivable account by customer
            RESOLVE(true)
        })
    },

    validateEditReceivableTransaction : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate edit receivable transaction
            RESOLVE(true)
        })
    },

    validateDeleteTransaction :  (transactionId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate delete receivable transaction
            RESOLVE(true)
        })
    },

}