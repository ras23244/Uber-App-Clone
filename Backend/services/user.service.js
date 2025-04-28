const userModel= require('../models/user.model')
// is functoin ka kaam hai user ko create krna ..databse se interact krna
//isliye user.service file alg bni hai
// user se related mongo db ka interaton isse hi hoga

module.exports.createUser = async ({
    firstname,lastname,email,password
})=>{
    if(!firstname || !email || !password){
        throw new Error('All fiels are required');
    }
    const user= userModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password
    })

    return user;
}
