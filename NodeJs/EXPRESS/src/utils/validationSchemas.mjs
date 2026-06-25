export const createUserValidationSchema = {
    username:{
        notEmpty:{
            errorMessage:"User name must not be empty"
        },
        isLength:{
            options:{min:2,max:12},
            errorMessage:"Invalid username(Length should be 2-12)"
        },
        isString:{
            errorMessage:"UserName must be String"
        }
    },
    password:{
        notEmpty:{
            errorMessage:"password must be not empty"
        }
    }
}