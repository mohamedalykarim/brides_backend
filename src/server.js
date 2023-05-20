const express = require('express');

const app = express()

require('dotenv').config()

var morgan = require('morgan')
app.use(morgan('dev'))

var cors = require('cors')
app.use(cors())





const userRoute = require("./routes/users")
const productRouter = require('./routes/products')
const accountsCapitalRouter = require("./routes/accounts_capital")
const customersRouter = require("./routes/customers")
const vendorsRouter = require("./routes/vendors")
const receivableRouter = require("./routes/accounts_receivable")
const expensesRouter = require("./routes/accounts_expenses")
const inventoryRouter = require("./routes/inventory")

app.use(express.json())

app.use("/api/users", userRoute)
app.use("/api/products/", productRouter)
app.use("/api/accounts/capital/", accountsCapitalRouter)
app.use("/api/customers/", customersRouter)
app.use("/api/vendors/", vendorsRouter)
app.use("/api/accounts/receivable/", receivableRouter)
app.use("/api/accounts/expenses/", expensesRouter)
app.use("/api/inventory/", inventoryRouter)


app.get('/', (req,res)=>{
    res.status(200).json({
        Message: "Welcome to API"
    })
})

//Handling Error 
app.use((err, req, res, next) => {
    // handle error here
    res.status(200).json({
        Message: err
    })
});

  


const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
    console.log(`Running Bride's Furnishings API server on port ${PORT}`);
})