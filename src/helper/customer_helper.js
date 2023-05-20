const pool = require("../database/pool")
const customerErrors = require("../errors/customer_errors")


module.exports = {
    getCustomer : async (customerId) =>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "SELECT * FROM customers WHERE customer_id = ?;"
            pool.query(query, [customerId], (error, result)=>{
                if(error){
                    REJECT(error)
                    return
                }
                if(result.length === 0){
                    REJECT(customerErrors.NO_CUSTOMER_FOUND)
                }

                RESOLVE(result[0])

            })
        })
        
    },

    getAllCustomers : async ()=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "SELECT * FROM customers ORDER BY customer_name ASC;"
            pool.query(query, [], (error, result)=>{
                if(error){
                    REJECT(error)
                    return
                }
                if(result.length === 0){
                    REJECT(customerErrors.NO_CUSTOMER_FOUND)
                }      
                
                RESOLVE(result)

            })
        })
    },

    addNewCustomer : async (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "INSERT INTO customers SET customer_name = ?, customer_mobile = ?, customer_facebook = ?;"
            pool.query(
                query, 
                [data.customerName, data.customerMobile, data.customerFacebook], 
                (error, result)=>{
                if(error){
                    REJECT(error)
                    return
                }


                const insertedId = result.insertId

                const customer = {
                    insertedId : insertedId,
                    customerName : data.customerName,
                    customerMobile : data.customerMobile,
                    customerFacebook : data.customerFacebook
                }

                RESOLVE(customer)


                
            })
        })
    },

    editCustomer : async(data)=>{
        console.log(data);

        return new Promise((RESOLVE, REJECT)=>{
            const query = "UPDATE customers SET customer_name = ?, customer_mobile = ?, customer_facebook = ? WHERE customer_id = ?;"
            pool.query(query, [data.customerName, data.customerMobile, data.customerFacebook, data.customerId], (error, result)=>{
                if(error){
                    REJECT(error)
                    return
                }

                const customer = {
                    customerId : data.customerId,
                    customerName : data.customerName,
                    customerMobile : data.customerMobile,
                    customerFacebook : data.customerFacebook
                }


                RESOLVE(customer)
                
            })
        })
    },

    deleteCustomer : async (customerId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "DELETE FROM customers WHERE customer_id = ?;"
            pool.query(query, [customerId], (error, result)=>{
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