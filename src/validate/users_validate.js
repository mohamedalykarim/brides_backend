const errors = require('../errors/user_errors')

module.exports = {
    validateLogin : async (userData) =>{
        return new Promise((RESOLVE , REJECT)=>{
            //TODO validate 
            RESOLVE(true)
        })
    },
    
    validateInt : async (number) =>{
        return new Promise((RESOLVE, REJECT) => {
            //TODO validate 
            number = parseInt(number);
            
            if(number == null || isNaN(number)){
                REJECT(errors.USER_ID_ERROR)
            }else{
                RESOLVE (true)
            } 
        })
    },

    checkIsAdmin : async (userData)=>{
        return new Promise((RESOLVE, REJECT)=>{
            //TODO validate 

            if(userData.userType === 1){
                RESOLVE(true)
            }else{
                REJECT("User is not administrator")
            }
        })
    },

    validateAddUser : async (userData) =>{
        return new Promise((RESOLVE , REJECT)=>{
            //TODO validate 
            RESOLVE(true)
        })
    },

    validateChangePassword : async (userData) =>{
        return new Promise((RESOLVE , REJECT)=>{
            //TODO validate 
            RESOLVE(true)
        })
    }
}