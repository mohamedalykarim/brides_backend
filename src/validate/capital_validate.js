const accountCapitalErrors = require("../errors/accounts_capital_errors")

module.exports = {
    validateAddToCapital : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate add to capital account
            RESOLVE(true)
        })
    }, 
    validatGetFromCapitalAccount : (transactionId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate get from capital account
            RESOLVE(true)
        })
    },

    validateEditCapitalTransaction : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate edit capital transaction
            RESOLVE(true)
        })
    },

    validateDeleteTransaction :  (transactionId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate delete capital transaction
            RESOLVE(true)
        })
    },

}