const jwt = require("jsonwebtoken")
const pool = require("../database/pool")
const bcrypt = require("bcrypt")
const userErrors = require("../errors/user_errors")

const ACCESS_TOKEN_EXPIRE_TIME = "30s"

const userLogin = async (userData) => {

    return new Promise((RESOLVE, REJECT) => {
        try {
            // LOGIN DATABASE
            const query = "SELECT * FROM users WHERE users.username = ?";

            pool.query(
                query,
                [userData.username],
                async (error, result) => {
                    if (error) {
                        REJECT(userErrors.USER_PASSWORD_ERROR)
                        return
                    }
                    if (result.length === 0) {
                        RESOLVE({
                            status: false,
                            message: "User doesn't exists"
                        })
                        return
                    }

                    const userDatabase = result[0];
                    const user = {
                        username: userDatabase.username,
                        name: userDatabase.name,
                        user_type: userDatabase.user_type_id,
                    }

                    // Check user password with db password
                    const match = await bcrypt.compare(userData.password, userDatabase.password);

                    if (!match) {
                        RESOLVE({
                            status: false,
                            message: "Wrong password"
                        })
                    } else {
                        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE_TIME, })
                        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d", })

                        const query = "UPDATE users SET refresh_token = ? WHERE username = ?"
                        pool.query(
                            query,
                            [refreshToken, user.username],
                            (error, result) => {
                                if (error) {
                                    RESOLVE({
                                        status: false,
                                        message: error.message

                                    })
                                    return
                                }


                                RESOLVE({
                                    status: true,
                                    message: "You signed in",
                                    data: {
                                        accessToken: accessToken,
                                        refreshToken: refreshToken,
                                        user: user
                                    }
                                })

                            }
                        )


                    }

                })

        } catch (error) {
            RESOLVE({
                status: false,
                message: error.message
            })

        }
    })
}

const verifyToken = async (req, res, next) => {
    console.log("testing from verify token");

    const authHeaders = req.headers['authorization'];
    if (!authHeaders) return res.status(403).json({
        status: false,
        message: "Auth error"
    })

    const token = authHeaders.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (error, decoded) => {
            if (error) return res.status(403).json({
                status: false,
                message: error.message
            })

            req.user = decoded
            next()
        }
    )


}

const refresh = async (refreshToken) => {
    return new Promise((RESOLVE, REJECT) => {
        const query = "SELECT * FROM users WHERE refresh_token = ?"
        pool.query(
            query,
            [refreshToken],
            (error, results) => {
                if (error) REJECT({
                    status: false,
                    message: "No refesh token exists"
                })

                if (results?.length === 0) REJECT({
                    status: false,
                    message: "No refesh token exists"
                })


                jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET,
                    (error, decoded) => {
                        if (error) REJECT({
                            status: false,
                            message: "Doesn't varified"
                        })


                        const accessToken = jwt.sign(
                            { usernmae: decoded.username, name: decoded.name, user_type: decoded.user_type },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: ACCESS_TOKEN_EXPIRE_TIME }
                        )

                        RESOLVE({
                            status: true,
                            message: "Access token updated",
                            data: {
                                token: accessToken
                            }
                        })


                    }
                )
            }
        )
    })
}

const logout = async (refreshToken) => {
    return new Promise((RESOLVE, REJECT) => {
        const query = "UPDATE users SET refresh_token = '' WHERE refresh_token = ?"
        pool.query(
            query,
            [refreshToken],
            (error, result) => {
                if (error) REJECT({
                    status: false,
                    message: error.message
                })

                RESOLVE({
                    status: true,
                    message: "Refresh token cleared successfully"
                })
            }
        )
    })
}

const getUserDataById = async (userId) => {
    return new Promise((RESOLVE, REJECT) => {
        const query = "SELECT * FROM users WHERE id = ?";
        pool.query(query, [userId], (error, result) => {
            if (error) {
                REJECT(error.message)
                return
            }
            if (result.length === 0) {
                REJECT(userErrors.USER_DATA_ERROR)
                return
            }

            const userDatabase = result[0];
            const user = {
                username: userDatabase.username,
                name: userDatabase.name,
                userTypeId: userDatabase.user_type_id,
            }

            RESOLVE(user)


        })
    })
}


const getUserDataByUsername = async (username) => {
    return new Promise((RESOLVE, REJECT) => {
        const query = "SELECT * FROM users WHERE username = ?";
        pool.query(query, [username], (error, result) => {
            if (error) {
                REJECT(userErrors.USER_DATA_ERROR)
                return
            }
            if (result.length === 0) {
                RESOLVE({
                    status: false,
                    message: "User doesn't exist",
                })
                return
            }

            const userDatabase = result[0];
            const user = {
                username: userDatabase.username,
                name: userDatabase.name,
                userTypeId: userDatabase.user_type_id,
                userType: userDatabase.user_type_name,
                userPassword: userDatabase.password
            }

            RESOLVE({
                status: true,
                message: "User Data is retrieved",
                data: user
            })


        })
    })
}

const addNewUser = async (userData) => {
    return new Promise(async (RESOLVE, REJECT) => {

        try {
            const oldUser = await getUserDataByUsername(userData.username)

            if (oldUser.status === true && oldUser.data.username === userData.username) {
                RESOLVE({
                    status: false,
                    message: "Username is exists"
                })
            } else {


                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        REJECT(err)
                        return
                    }

                    bcrypt.hash(userData.password, salt, function (err, hash) {
                        if (err) {
                            REJECT(err)
                            return
                        }

                        // Store hash in your password DB.
                        const query = "INSERT INTO users (username, name, password, user_type_id) VALUES (?,?,?,?); SELECT LAST_INSERT_ID() as id;"
                        pool.query(query,
                            [
                                userData.username,
                                userData.name,
                                hash,
                                userData.isAdmin
                            ],
                            (error, result) => {
                                if (error) {
                                    REJECT(error)
                                    return
                                }


                                const insertedId = result[1][0].id
                                RESOLVE({
                                    status: true,
                                    message: "User inserted",
                                    data: {
                                        id: insertedId,
                                        username: userData.username,
                                        name: userData.name,
                                        userTypeId: userData.isAdmin
                                    }
                                })

                            })

                    });
                });

            }


        } catch (error) {
            REJECT({
                status: false,
                Message: error.Message
            })
        }




    })
}

const updateUserPassword = async (user, oldPassword, newPassword, dbPassword) => {

    return new Promise(async (RESOLVE, REJECT) => {

        bcrypt.compare(oldPassword, dbPassword).then(function (result) {
            if (!result) {
                REJECT(userErrors.USER_PASSWORD_ERROR)
                return
            } else {


                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        REJECT(err)
                        return
                    }

                    bcrypt.hash(newPassword, salt, function (err, hash) {
                        if (err) {
                            REJECT(err)
                            return
                        }

                        const query = "UPDATE users SET password = ? WHERE user_id = ?";
                        pool.query(
                            query,
                            [
                                hash,
                                user.userId
                            ],
                            (error, result) => {
                                if (error) {
                                    REJECT(error)
                                    return
                                }

                                jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10h", }, (error, token) => {
                                    if (error) {
                                        REJECT(userErrors.USER_JWT_SIGN_ERROR)
                                        return
                                    }

                                    RESOLVE(token)
                                })

                            }
                        )


                    });

                });


            }
        })



    })
}

module.exports = {
    userLogin,
    //verify token
    verifyToken,
    refresh,
    logout,
    // Get user By Id
    getUserDataById,
    // Get user By Id
    getUserDataByUsername,
    // Add new User
    addNewUser,
    // Update user Data
    updateUserPassword
}