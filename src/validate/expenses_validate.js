const accountExpensesErrors = require("../errors/accounts_expenses_errors")

module.exports = {
    validateAddToExpenses : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate add to expenses account
            RESOLVE(true)
        })
    }, 
    validatGetFromExpensesAccount : (transactionId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate get from expenses account
            RESOLVE(true)
        })
    },

    validatGetFromExpensesAccountByType : (typeId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate get from expenses account
            RESOLVE(true)
        })
    },

    validateEditExpensesTransaction : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate edit expenses transaction
            RESOLVE(true)
        })
    },

    validateDeleteTransaction :  (transactionId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate delete expenses transaction
            RESOLVE(true)
        })
    },

}