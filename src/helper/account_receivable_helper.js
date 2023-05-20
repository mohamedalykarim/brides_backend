const pool = require("../database/pool")
const receivableErrors = require("../errors/accounts_receivable_errors")

module.exports = {
    addToReceivableAccount : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "INSERT INTO accounts_receivable SET customer_id = ?, transaction_details = ?, value_credit = ?, value_debit = ?;"
            pool.query(query, [data.customerId, data.transactionDetails, data.valueCredit, data.valueDebit], (error, result)=>{
                if(error){
                    REJECT(error)
                }else{
                    const insertedId = result.insertId

                    RESOLVE({
                        transactionId : insertedId,
                        customerId : data.customerId,
                        transactionDetails: data.transactionDetails,
                        valueCredit : data.valueCredit,
                        valueDebit : data.valueDebit
                    })
                }
            })
        })
    },

    getAllFromReceivableAccount : ()=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "SELECT * FROM accounts_receivable ORDER BY created_at DESC"
            pool.query(query, [], (error, result)=>{
                if (error) {
                    REJECT(error)
                    return
                }

                if(result.length === 0){
                    REJECT(receivableErrors.NO_TRANSACTIONS)
                    return
                }

                RESOLVE(result)
            })
        })
    }, 

    getFromReceivableAccount : (transactionId)=>{
        return new Promise((RESOLVE, REJECT)=>{
        const query = "SELECT * FROM accounts_receivable WHERE transaction_id = ?"
        pool.query(query, [transactionId], (error, result)=>{
            if (error) {
                REJECT(error)
                return
            }

            if(result.length === 0){
                REJECT(receivableErrors.NO_TRANSACTIONS)
                return
            }

            RESOLVE(result[0])


        })
        })
    },

    getFromReceivableAccountByCustomer : (customerId)=>{
        return new Promise((RESOLVE, REJECT)=>{
        const query = "SELECT * FROM accounts_receivable WHERE customer_id = ?"
        pool.query(query, [customerId], (error, result)=>{
            if (error) {
                REJECT(error)
                return
            }

            if(result.length === 0){
                REJECT(receivableErrors.NO_TRANSACTIONS)
                return
            }

            RESOLVE(result)

        })
        })
    },

    editInReceivableAccount : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "UPDATE accounts_receivable SET customer_id = ?, transaction_details = ?, value_credit = ?, value_debit = ? WHERE transaction_id = ?;"
            pool.query(query, 
                [
                    data.customerId,
                    data.transactionDetails,
                    data.valueCredit,
                    data.valueDebit,
                    data.transactionId
                ], 
                (error, result)=>{
                    if (error) {
                        REJECT(error)
                        return
                    }

                    RESOLVE({
                        transactionId : data.transactionId,
                        customerId : data.customerId,
                        transactionDetails : data.transactionDetails,
                        valueCredit : data.valueCredit,
                        valueDebit : data.valueDebit
                    })

                })
        })
    },

    removeFromReceivableAccount : (transactionId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "DELETE FROM accounts_receivable WHERE transaction_id = ?";
            pool.query(query, [transactionId], (error, result)=> {
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