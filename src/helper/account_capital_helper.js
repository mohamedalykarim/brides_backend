const pool = require("../database/pool")
const accounts_capital_errors = require("../errors/accounts_capital_errors")
const capitalErrors = require("../errors/accounts_capital_errors")

module.exports = {
    addToCapitalAccount: (data) => {
        return new Promise((RESOLVE, REJECT) => {
            const query = "INSERT INTO accounts_capital SET transaction_details = ?, value_credit = ?, value_debit = ?;"
            pool.query(query, [data.transactionDetails, data.valueCredit, data.valueDebit], (error, result) => {
                if (error) {
                    REJECT(error)
                } else {
                    const insertedId = result.insertId

                    RESOLVE({
                        transactionId: insertedId,
                        transactionDetails: data.transactionDetails,
                        valueCredit: data.valueCredit,
                        valueDebit: data.valueDebit
                    })
                }
            })
        })
    },

    getAllFromCapitalAccount: () => {
        return new Promise((RESOLVE, REJECT) => {
            const query = "SELECT * FROM transactions_capital ORDER BY created_at DESC"
            pool.query(query, [], (error, result) => {
                if (error) {
                    REJECT(error)
                    return
                }

                if (result.length === 0) {
                    REJECT(accounts_capital_errors.NO_TRANSACTIONS)
                    return
                }

                RESOLVE(result)
            })
        })
    },

    getFromCapitalAccount: (transactionId) => {
        return new Promise((RESOLVE, REJECT) => {
            const query = "SELECT * FROM accounts_capital WHERE transaction_id = ?"
            pool.query(query, [transactionId], (error, result) => {
                if (error) {
                    REJECT(error)
                    return
                }

                if (result.length === 0) {
                    REJECT(accounts_capital_errors.NO_TRANSACTIONS)
                    return
                }

                RESOLVE(result[0])


            })
        })
    },

    editInCapitalAccount: (data) => {
        return new Promise((RESOLVE, REJECT) => {
            const query = "UPDATE accounts_capital SET transaction_details = ?, value_credit = ?, value_debit = ? WHERE transaction_id = ?;"
            pool.query(query,
                [
                    data.transactionDetails,
                    data.valueCredit,
                    data.valueDebit,
                    data.transactionId
                ],
                (error, result) => {
                    if (error) {
                        REJECT(error)
                        return
                    }

                    RESOLVE({
                        transactionId: data.transactionId,
                        transactionDetails: data.transactionDetails,
                        valueCredit: data.valueCredit,
                        valueDebit: data.valueDebit
                    })

                })
        })
    },

    removeFromCapitalAccount: (transactionId) => {
        return new Promise((RESOLVE, REJECT) => {
            const query = "DELETE FROM accounts_capital WHERE transaction_id = ?";
            pool.query(query, [transactionId], (error, result) => {
                if (error) {
                    REJECT(error)
                    return
                } else {
                    if (result.affectedRows === 1) {
                        RESOLVE(true)
                    } else {
                        RESOLVE(false)
                    }
                }

            })

        })
    }


}