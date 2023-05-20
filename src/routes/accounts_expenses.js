const express = require('express')

const validateUser = require("../validate/users_validate")
const userHelper = require("../helper/user_helper")

const validateExpenses = require("../validate/expenses_validate")
const accountExpensesHelper = require("../helper/account_expenses_helper")


const router = express.Router();

// Add to expenses account
router.post("/", userHelper.verifyToken, async (req, res)=>{
    const data = {
        transactionDetails: req.body.transaction_details,
        expensesType : req.body.expenses_type,
        valueCredit : req.body.value_credit,
        valueDebit : req.body.value_debit
    }

    try {
        const validate = await validateExpenses.validateAddToExpenses(data);
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const transaction = await accountExpensesHelper.addToExpensesAccount(data)
        res.status(200).json(transaction)


    } catch (error) {
        res.status(500).json(error)
    }
})

// Get ALL expenses account
router.get("/", userHelper.verifyToken, async (req, res)=>{
    try {
        const isAdmin = await validateUser.checkIsAdmin(req.userData)
        const allTransactions = await accountExpensesHelper.getAllFromExpensesAccount()

        res.status(200).json(allTransactions)
        
    } catch (error) {
        res.status(500).json(error)
    }
})

// Get a transaction from expenses accont
router.get("/:expensesTransactionId", userHelper.verifyToken, async (req, res)=>{
    const transactionId = req.params.expensesTransactionId
    try {
        const validate = await validateExpenses.validatGetFromExpensesAccount(transactionId)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)
        const transaction = await accountExpensesHelper.getFromExpensesAccount(transactionId)

        res.status(200).json(transaction)


    } catch (error) {
        res.status(500).json(error)
    }
})

// Get a transaction from expenses accont by type
router.get("/type/:typeId", userHelper.verifyToken, async (req, res)=>{
    const typeId = req.params.typeId
    try {
        const validate = await validateExpenses.validatGetFromExpensesAccountByType(typeId)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)
        const transaction = await accountExpensesHelper.getFromExpensesAccountByType(typeId)

        res.status(200).json(transaction)


    } catch (error) {
        res.status(500).json(error)
    }
})

// Edit transaction of expenses account 
router.put("/:expensesTransactionId", userHelper.verifyToken, async (req, res)=>{

    const data = {
        transactionId : req.params.expensesTransactionId,
        transactionDetails : req.body.transaction_details,
        expensesType : req.body.expenses_type,
        valueCredit : req.body.value_credit,
        valueDebit : req.body.value_debit
    }

    try {

        const validate = await validateExpenses.validateEditExpensesTransaction(data)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const transaction = await accountExpensesHelper.editInExpensesAccount(data)


        res.status(200).json(transaction)
        
    } catch (error) {
        res.status(500).json(error)
    }
})

// Remove a transaction from expenses account
router.delete("/:expensesTransactionId", userHelper.verifyToken, async(req, res)=>{
    const transactionId = req.params.expensesTransactionId

    try {
        const validate = await validateExpenses.validateDeleteTransaction(transactionId)
        const isAdmin = await validateUser.checkIsAdmin(req.userData)

        const isDeleted = await accountExpensesHelper.removeFromExpensesAccount(transactionId)

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