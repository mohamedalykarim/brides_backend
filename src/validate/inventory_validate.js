const accountCapitalErrors = require("../errors/accounts_capital_errors")

module.exports = {
    validateGetOneTransaction : (inventoryId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate get one from inventory
            RESOLVE(true)
        })
    }, 
    validateAddInventory : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate add to inventory
            RESOLVE(true)
        })
    }, 
    validateUpdateInventory : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate update inventory
            RESOLVE(true)
        })
    }, 

    validateRemoveInventory : (inventoryId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate remove from inventory
            RESOLVE(true)
        })
    }, 

    validateGetRemains : (inventoryId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate get inventory remains
            RESOLVE(true)
        })
    }, 

    validateUpdateRemains : (inventoryId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            // TODO validate update inventory remains
            RESOLVE(true)
        })
    }, 
    
}