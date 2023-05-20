const express = require('express')

const validateUser = require("../validate/users_validate")
const userHelper = require("../helper/user_helper")

const validateCapital = require("../validate/capital_validate")
const accountCapitalHelper = require("../helper/account_capital_helper")


const router = express.Router();

// Add to capital account
router.post("/", userHelper.verifyToken, async (req, res)=>{
    const data = {
        transactionDetails: req.body.transaction_details,
        valueCredit : req.body.value_credit,
        valueDebit : req.body.value_debit
    }

    try {
        const validate = await validateCapital.validateAddToCapital(data);
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const transaction = await accountCapitalHelper.addToCapitalAccount(data)
        res.status(200).json(transaction)


    } catch (error) {
        res.status(500).json(error)
    }
})

// Get ALL capital account
router.get("/", userHelper.verifyToken, async (req, res)=>{
    try {
        const isAdmin = await validateUser.checkIsAdmin(req.userData)
        const allTransactions = await accountCapitalHelper.getAllFromCapitalAccount()

        res.status(200).json(allTransactions)
        
    } catch (error) {
        res.status(500).json(error)
    }
})

// Get a transaction from capital accont
router.get("/:capitalTransactionId", userHelper.verifyToken, async (req, res)=>{
    const transactionId = req.params.capitalTransactionId
    try {
        const validate = await validateCapital.validatGetFromCapitalAccount(transactionId)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)
        const transaction = await accountCapitalHelper.getFromCapitalAccount(transactionId)

        res.status(200).json(transaction)


    } catch (error) {
        res.status(500).json(error)
    }
})

// Edit transaction of capital account 
router.put("/:capitalTransactionId", userHelper.verifyToken, async (req, res)=>{

    const data = {
        transactionId : req.params.capitalTransactionId,
        transactionDetails : req.body.transaction_details,
        valueCredit : req.body.value_credit,
        valueDebit : req.body.value_debit
    }

    try {

        const validate = await validateCapital.validateEditCapitalTransaction(data)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const transaction = await accountCapitalHelper.editInCapitalAccount(data)


        res.status(200).json(transaction)
        
    } catch (error) {
        res.status(500).json(error)
    }
})

// Remove a transaction from capital account
router.delete("/:capitalTransactionId", userHelper.verifyToken, async(req, res)=>{
    const transactionId = req.params.capitalTransactionId

    try {
        const validate = await validateCapital.validateDeleteTransaction(transactionId)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const isDeleted = await accountCapitalHelper.removeFromCapitalAccount(transactionId)

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