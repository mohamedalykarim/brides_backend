const express = require('express');

const userHelper = require('../helper/user_helper')
const validateUser = require("../validate/users_validate")

const router = express.Router();

// Welcoming to users
router.get('/', (req,res)=>{
    res.status(200).json({
        Message: "Welcome to Users"
    })
})



// login to system
router.post("/login",  async (req,res)=>{
    const userData = {
        username: req.body.username,
        password: req.body.password
    }


    try {
        const validate = await validateUser.validateLogin(userData)

        const results = await userHelper.userLogin(userData)
        res.status(200).json(results)

    } catch (error) {
        res.status(500).json(error)
    }
})

// Get user Data
router.get("/:userId", userHelper.verifyToken, async (req, res)=>{
    const userId = req.params.userId


    try {
        const validate = await validateUser.validateInt(userId)

        const user = await userHelper.getUserDataById(userId)

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({Message : error})
    }
})

// Add User
router.post("/", async (req, res)=>{
    const userData = {
        username : req.body.username,
        name : req.body.name,
        password : req.body.password,
        isAdmin : req.body.is_admin ? 1 : 0
    }


    try {
        const validate = validateUser.validateAddUser(userData)
        // const isAdmin = validateUser.checkIsAdmin(req.userData)

        const data = await userHelper.addNewUser(userData)

        res.status(200).json(data)



    } catch (error) {
        res.status(500).json({Message : error})
    }
})

// Change User password
router.put("/:userId/edit_password", userHelper.verifyToken, async (req, res)=>{
    const data = {
        userId : req.params.userId,
        oldPassword : req.body.old_password,
        newPassword : req.body.new_password
    }

    try {
        const validate = validateUser.validateChangePassword(data)
        const user = await userHelper.getUserDataById(data.userId)

        const token = await userHelper.updateUserPassword(
            user,
            data.oldPassword,
            data.newPassword,
            user.userPassword
        )

        res.status(200).json({
            Message : "Password succesfully updated",
            token : token
        })

    } catch (error) {
        res.status(500).json({Message : error})
    }
})

module.exports = router