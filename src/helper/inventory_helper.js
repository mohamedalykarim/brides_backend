const pool = require("../database/pool")
const inventoryErrors = require("../errors/inventory_errors")

module.exports = {
    getAllTransactions : ()=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "SELECT * FROM inventory"
            pool.query(query, [], (error, result)=>{
                if(error){
                    REJECT(error)
                }else{

                    RESOLVE(result)
                }
            })
        })
    },

    getOneTransaction : (inventoryId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "SELECT * FROM inventory WHERE inventory_id = ?"
            pool.query(query, [inventoryId], (error, result)=>{
                if(error){
                    REJECT(error)
                }else{

                    RESOLVE(result[0])
                }
            })
        })
    },

    addToInventory : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "SELECT * FROM inventory WHERE inventory_id = ?"
            pool.query(query, [inventoryId], (error, result)=>{
                if(error){
                    REJECT(error)
                }else{

                    RESOLVE(result[0])
                }
            })
        })
    },


}