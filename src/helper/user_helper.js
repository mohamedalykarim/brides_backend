const jwt = require("jsonwebtoken")
const pool = require("../database/pool")
const bcrypt = require("bcrypt")
const userErrors = require("../errors/user_errors")

const userLogin = async (userData)=>{

    return new Promise((RESOLVE, REJECT)=>{
        // LOGIN DATABASE
        const query = "SELECT * FROM users WHERE users.username = ?";

        pool.query(query, [userData.username], (error, result)=>{
            if(error){
                REJECT(userErrors.USER_PASSWORD_ERROR)
                return
            } 
            if(result.length === 0){
                RESOLVE({
                    status: false,
                    message : "User doesn't exists"
                })
                return  
            } 

            const userDatabase = result[0];
            const user = {
                username  : userDatabase.username,
                name : userDatabase.name,
                userType : userDatabase.user_type_id,
            }

            // Check user password with db password
            bcrypt.compare(userData.password, userDatabase.password).then(function(result) {
                if(!result){
                    RESOLVE({
                        status : false,
                        message: "Password isn't correct"
                    })
                }

                jwt.sign(user, process.env.JWT_SECRET_KEY, {expiresIn: "10h", }, (error, token)=>{
                    if(error){
                        REJECT({
                            status : false,
                            message: "Can't sign you in"
                        })
                        return
                    } 

                    RESOLVE({
                        status : true,
                        message: "You signed in",
                        data:{
                            token : token
                        }
                    })
                })

            });
            

            

        })
    })
}

const verifyToken = async (req, res, next) =>{
    return new Promise((RESOLVE, REJECT) => {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader === 'undefined') {
            REJECT(userErrors.VERIFY_TOKEN_ERROR)
        }else{
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1]
            req.token = bearerToken;

            jwt.verify(req.token, process.env.JWT_SECRET_KEY, (error, authData)=>{
                if(error){
                    REJECT(userErrors.VERIFY_TOKEN_ERROR) 
                }else{
                    req.userData = authData
                    RESOLVE(true)
                    next()
                }
            })

            
        }

    })


}

const getUserDataById = async (userId) => {
    return new Promise((RESOLVE, REJECT)=>{
        const query = "SELECT * FROM users, user_type WHERE users.user_id = ? AND users.user_type_id = user_type.user_type_id";
        pool.query(query, [userId], (error, result)=>{
            if(error){
                REJECT(userErrors.USER_DATA_ERROR)
                return
            } 
            if(result.length === 0){
                REJECT(userErrors.USER_DATA_ERROR)
                return  
            } 

            const userDatabase = result[0];
            const user = {
                username  : userDatabase.username,
                name : userDatabase.name,
                userTypeId : userDatabase.user_type_id,
                userType : userDatabase.user_type_name,
                userPassword : userDatabase.password
            }

            RESOLVE(user)


        })
    })
}


const getUserDataByUsername = async (username) => {
    return new Promise((RESOLVE, REJECT)=>{
        const query = "SELECT * FROM users WHERE username = ?";
        pool.query(query, [username], (error, result)=>{
            if(error){
                REJECT(userErrors.USER_DATA_ERROR)
                return
            } 
            if(result.length === 0){
                RESOLVE({
                    status: false,
                    message: "User doesn't exist",
                })
                return  
            } 

            const userDatabase = result[0];
            const user = {
                username  : userDatabase.username,
                name : userDatabase.name,
                userTypeId : userDatabase.user_type_id,
                userType : userDatabase.user_type_name,
                userPassword : userDatabase.password
            }

            RESOLVE({
                status : true,
                message: "User Data is retrieved",
                data : user
            })


        })
    })
}

const addNewUser = async (userData)=>{
    return new Promise(async (RESOLVE, REJECT)=> {

        try {
            const oldUser = await getUserDataByUsername(userData.username)

        if(oldUser.status === true && oldUser.data.username === userData.username){
            RESOLVE({
                status: false,
                message : "Username is exists"
            })
        }else{


            bcrypt.genSalt(10, function(err, salt) {
                if(err) {
                    REJECT(err)
                    return
                }
    
                bcrypt.hash(userData.password, salt, function(err, hash) {
                    if(err) {
                        REJECT(err)
                        return
                    }

                    // Store hash in your password DB.
                    const query = "INSERT INTO users (username, name, password, salt, user_type_id) VALUES (?,?,?,?,?); SELECT LAST_INSERT_ID() as id;"
                    pool.query(query, 
                        [
                            userData.username,
                            userData.name,
                            hash,
                            salt,
                            userData.isAdmin
                        ], 
                        (error, result)=>{
                            if(error){
                                REJECT(error)
                                return
                            } 
                            
    
                            const insertedId = result[1][0].id
                            RESOLVE({
                                status : true,
                                message : "User inserted",
                                data: {
                                    id: insertedId,
                                    username : userData.username,
                                    name : userData.name,
                                    userTypeId : userData.isAdmin
                                }
                            })
    
                        })
    
                });
            });

        }
        
            
        } catch (error) {
            REJECT({
                status : false, 
                Message : error.Message
            })            
        }

        

        
    })
}

const updateUserPassword = async (user, oldPassword, newPassword, dbPassword)=>{

    return new Promise(async (RESOLVE, REJECT)=>{

        bcrypt.compare(oldPassword, dbPassword).then(function(result) {
            if(!result){
                REJECT(userErrors.USER_PASSWORD_ERROR)
                return
            }else{


                bcrypt.genSalt(10, function(err, salt) {
                    if(err) {
                        REJECT(err)
                        return
                    }

                    bcrypt.hash(newPassword, salt, function(err, hash) {
                        if(err) {
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
                            (error, result)=>{
                                if(error){
                                    REJECT(error)
                                    return
                                }

                                jwt.sign(user, process.env.JWT_SECRET_KEY, {expiresIn: "10h", }, (error, token)=>{
                                    if(error){
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
    userLogin ,
    //verify token
    verifyToken,
    // Get user By Id
    getUserDataById, 
    // Get user By Id
    getUserDataByUsername, 
    // Add new User
    addNewUser,
    // Update user Data
    updateUserPassword
}