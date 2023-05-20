const pool = require("../database/pool")
const expensesErrors = require("../errors/accounts_expenses_errors")

module.exports = {
    addToExpensesAccount : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "INSERT INTO accounts_expenses SET transaction_details = ?, expenses_type = ?, value_credit = ?, value_debit = ?;"
            pool.query(query, [data.transactionDetails, data.expensesType, data.valueCredit, data.valueDebit], (error, result)=>{
                if(error){
                    REJECT(error)
                }else{
                    const insertedId = result.insertId

                    RESOLVE({
                        transactionId : insertedId,
                        transactionDetails: data.transactionDetails,
                        expensesType : data.expensesType,
                        valueCredit : data.valueCredit,
                        valueDebit : data.valueDebit
                    })
                }
            })
        })
    },

    getAllFromExpensesAccount : ()=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "SELECT * FROM accounts_expenses ORDER BY created_at DESC"
            pool.query(query, [], (error, result)=>{
                if (error) {
                    REJECT(error)
                    return
                }

                if(result.length === 0){
                    REJECT(expensesErrors.NO_TRANSACTIONS)
                    return
                }

                RESOLVE(result)
            })
        })
    }, 

    getFromExpensesAccount : (transactionId)=>{
        return new Promise((RESOLVE, REJECT)=>{
        const query = "SELECT * FROM accounts_expenses WHERE transaction_id = ?"
        pool.query(query, [transactionId], (error, result)=>{
            if (error) {
                REJECT(error)
                return
            }

            if(result.length === 0){
                REJECT(expensesErrors.NO_TRANSACTIONS)
                return
            }

            RESOLVE(result[0])


        })
        })
    },

    getFromExpensesAccountByType : (typeId)=>{
        return new Promise((RESOLVE, REJECT)=>{
        const query = "SELECT * FROM accounts_expenses WHERE expenses_type = ?"
        pool.query(query, [typeId], (error, result)=>{
            if (error) {
                REJECT(error)
                return
            }

            if(result.length === 0){
                REJECT(expensesErrors.NO_TRANSACTIONS)
                return
            }

            RESOLVE(result)

        })
        })
    },

    editInExpensesAccount : (data)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "UPDATE accounts_expenses SET transaction_details = ?, expenses_type = ?, value_credit = ?, value_debit = ? WHERE transaction_id = ?;"
            pool.query(query, 
                [
                    data.transactionDetails,
                    data.expensesType,
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
                        expensesType : data.expensesType,
                        transactionDetails : data.transactionDetails,
                        valueCredit : data.valueCredit,
                        valueDebit : data.valueDebit
                    })

                })
        })
    },

    removeFromExpensesAccount : (transactionId)=>{
        return new Promise((RESOLVE, REJECT)=>{
            const query = "DELETE FROM accounts_expenses WHERE transaction_id = ?";
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