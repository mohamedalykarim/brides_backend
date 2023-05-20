const express = require('express')

const validateUser = require("../validate/users_validate")
const userHelper = require("../helper/user_helper")

const validateReceivable = require("../validate/receivable_validate")
const accountReceivableHelper = require("../helper/account_receivable_helper")


const router = express.Router();

// Add to receivable account
router.post("/", userHelper.verifyToken, async (req, res)=>{
    const data = {
        customerId : req.body.customer_id,
        transactionDetails: req.body.transaction_details,
        valueCredit : req.body.value_credit,
        valueDebit : req.body.value_debit
    }

    try {
        const validate = await validateReceivable.validateAddToReceivable(data);
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const transaction = await accountReceivableHelper.addToReceivableAccount(data)
        res.status(200).json(transaction)


    } catch (error) {
        res.status(500).json(error)
    }
})

// Get ALL Receivable account
router.get("/", userHelper.verifyToken, async (req, res)=>{
    try {
        const isAdmin = await validateUser.checkIsAdmin(req.userData)
        const allTransactions = await accountReceivableHelper.getAllFromReceivableAccount()

        res.status(200).json(allTransactions)
        
    } catch (error) {
        res.status(500).json(error)
    }
})

// Get a transaction from receivable accont
router.get("/:receivableTransactionId", userHelper.verifyToken, async (req, res)=>{
    const transactionId = req.params.receivableTransactionId
    try {
        const validate = await validateReceivable.validatGetFromReceivableAccount(transactionId)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)
        const transaction = await accountReceivableHelper.getFromReceivableAccount(transactionId)

        res.status(200).json(transaction)


    } catch (error) {
        res.status(500).json(error)
    }
})

// Get a transaction from receivable account by customer
router.get("/customer/:customerId", userHelper.verifyToken, async (req, res)=>{
    const customerId = req.params.customerId
    try {
        const validate = await validateReceivable.validatGetFromReceivableAccountByCustomer(customerId)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)
        const transactions = await accountReceivableHelper.getFromReceivableAccountByCustomer(customerId)

        res.status(200).json(transactions)


    } catch (error) {
        res.status(500).json(error)
    }
})

// Edit transaction of receivable account 
router.put("/:receivableTransactionId", userHelper.verifyToken, async (req, res)=>{

    const data = {
        transactionId : req.params.receivableTransactionId,
        customerId : req.body.customer_id,
        transactionDetails : req.body.transaction_details,
        valueCredit : req.body.value_credit,
        valueDebit : req.body.value_debit
    }

    try {

        const validate = await validateReceivable.validateEditReceivableTransaction(data)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const transaction = await accountReceivableHelper.editInReceivableAccount(data)


        res.status(200).json(transaction)
        
    } catch (error) {
        res.status(500).json(error)
    }
})

// Remove a transaction from receivable account
router.delete("/:receivableTransactionId", userHelper.verifyToken, async(req, res)=>{
    const transactionId = req.params.receivableTransactionId

    try {
        const validate = await validateReceivable.validateDeleteTransaction(transactionId)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const isDeleted = await accountReceivableHelper.removeFromReceivableAccount(transactionId)

        if(isDeleted){
            res.status(200).json({
                Message: "Transaction deleted successfully ",
                ProductId : transactionId
            })
        }else{
            res.status(200).json({
                Message: "Transaction Not found",
                ProductId : transactionId
            })
        }

        
    } catch (error) {
                res.status(500).json(error)

    }

})


module.exports = router