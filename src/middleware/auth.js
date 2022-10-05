// authentication AUTH for the secret page

// require the jwt token
const jwt = require("jsonwebtoken")
// import register that is the collevtion name of our database
const Register = require("../models/registers");

// auth is parameter we set foe the secret page, and next is the input to go to the nexxt process or next user
const auth = async (req, res, next) => {
    try{
        // request for getiing token
        const token = req.cookies.jwt;
        // verify the token with the the secret key thriugh which we are generating the token
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        console.log(verifyUser);

        // Database id is match with verifyUser 
        // _id  is database, will compare with veriyUser 
        const user = await Register.findOne({_id:verifyUser._id});
        console.log(user);

        //to use in logout page, there is need to require token and user
        req.token = token;
        req.user = user;




        // without next page secret page will remain in loading state,
        // by next command will will go for request to render the page
        next();

    }catch(error){
        res.status(401).send(error);
    }

}

// there is need to export this module so that app.js can read it 
// also add require in app.js  so that it can read
module.exports = auth;