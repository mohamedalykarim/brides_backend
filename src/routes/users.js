const express = require('express');

const userHelper = require('../helper/user_helper')
const validateUser = require("../validate/users_validate");
const pool = require('../database/pool');
const jwt = require('jsonwebtoken');
const { ref } = require('joi');

const router = express.Router();

// Welcoming to users
router.get('/', (req, res) => {
    res.status(200).json({
        Message: "Welcome to Users"
    })
})



// login to system
router.post("/login", async (req, res) => {
    const userData = {
        username: req.body.username,
        password: req.body.password
    }


    try {
        const validate = await validateUser.validateLogin(userData)
        const results = await userHelper.userLogin(userData)

        if (results?.status === true) {
            res.cookie('jwt', results.data.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            })
            res.json({
                status: true,
                message: "You are signed in",
                data: {
                    token: results.data.accessToken,
                    user: results.data.user
                }
            })
        } else {
            res.status(200).json(results)
        }

    } catch (error) {
        res.status(403).json(error)
    }
})

router.post('/refresh', async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).json({
        status: false,
        message: "No refesh token exists"
    })

    try {
        const refreshToken = cookies.jwt
        const result = await userHelper.refresh(refreshToken)

        if (result?.status === true) {
            res.status(200).json(result)
        } else {
            res.status(200).json(result)
        }


    } catch (error) {
        res.status(401).json(error)
    }

})

router.get('/logout', async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).json({
        status: false,
        message: "No refesh token exists"
    })

    try {
        const refreshToken = cookies.jwt
        const result = await userHelper.logout(refreshToken)

        if (result?.status === true) {
            res.clearCookie('jwt', { httpOnly: true, })
            res.status(200).json({
                status: true,
                message: "User Loged out successfully"
            })
        } else {
            res.status(401).json({
                status: false,
                message: "Logout error"
            })

        }


    } catch (error) {
        res.status(401).json(error)
    }



})

// Get user Data
router.get("/:userId", userHelper.verifyToken, async (req, res) => {

    const userId = req.params.userId

    try {
        const validate = await validateUser.validateInt(userId)

        const user = await userHelper.getUserDataById(userId)

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ Message: error })
    }
})

// Add User
router.post("/", async (req, res) => {
    const userData = {
        username: req.body.username,
        name: req.body.name,
        password: req.body.password,
        isAdmin: req.body.is_admin ? 1 : 0
    }


    try {
        const validate = validateUser.validateAddUser(userData)
        // const isAdmin = validateUser.checkIsAdmin(req.userData)

        const data = await userHelper.addNewUser(userData)

        res.status(200).json(data)



    } catch (error) {
        res.status(500).json({ Message: error })
    }
})

// Change User password
router.put("/:userId/edit_password", userHelper.verifyToken, async (req, res) => {
    const data = {
        userId: req.params.userId,
        oldPassword: req.body.old_password,
        newPassword: req.body.new_password
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
            Message: "Password succesfully updated",
            token: token
        })

    } catch (error) {
        res.status(500).json({ Message: error })
    }
})

module.exports = router