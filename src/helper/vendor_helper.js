const pool = require("../database/pool")
const vendorErrors = require("../errors/vendor_errors")


module.exports = {
    getVendor : async (vendorId) =>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "SELECT * FROM vendors WHERE vendor_id = ?;"
            pool.query(query, [vendorId], (error, result)=>{
                if(error){
                    REJECT(error)
                    return
                }
                if(result.length === 0){
                    REJECT(vendorErrors.NO_VENDOR_FOUND)
                }

                RESOLVE(result[0])

            })
        })
        
    },

    getAllVendors : async ()=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "SELECT * FROM vendors ORDER BY vendor_name ASC;"
            pool.query(query, [], (error, result)=>{
                if(error){
                    REJECT(error)
                    return
                }
                if(result.length === 0){
                    REJECT(vendorErrors.NO_VENDOR_FOUND)
                }      
                
                RESOLVE(result)

            })
        })
    },

    addNewVendor : async (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "INSERT INTO vendors SET vendor_name = ?, vendor_mobile = ?, vendor_facebook = ?;"
            pool.query(
                query, 
                [data.vendorName, data.vendorMobile, data.vendorFacebook], 
                (error, result)=>{
                if(error){
                    REJECT(error)
                    return
                }


                const insertedId = result.insertId

                const vendor = {
                    insertedId : insertedId,
                    vendorName : data.vendorName,
                    vendorMobile : data.vendorMobile,
                    vendorFacebook : data.vendorFacebook
                }

                RESOLVE(vendor)


                
            })
        })
    },

    editVendor : async(data)=>{
        console.log(data);

        return new Promise((RESOLVE, REJECT)=>{
            const query = "UPDATE vendors SET vendor_name = ?, vendor_mobile = ?, vendor_facebook = ? WHERE vendor_id = ?;"
            pool.query(query, [data.vendorName, data.vendorMobile, data.vendorFacebook, data.vendorId], (error, result)=>{
                if(error){
                    REJECT(error)
                    return
                }

                const vendor = {
                    vendorId : data.vendorId,
                    vendorName : data.vendorName,
                    vendorMobile : data.vendorMobile,
                    vendorFacebook : data.vendorFacebook
                }


                RESOLVE(vendor)
                
            })
        })
    },

    deleteVendor : async (vendorId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "DELETE FROM vendors WHERE vendor_id = ?;"
            pool.query(query, [vendorId], (error, result)=>{
                if(error){
                    REJECT(error)
                    return
                }else{
                    if(result.affectedRows === 1) {
                        RESOLVE(true)
                    }else{
                        RESOLVE(false)
                    }
                }
                
            })
        })
    }
}