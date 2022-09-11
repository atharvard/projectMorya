const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");
const employeeSchema = new mongoose.Schema({
    firstname : {
        type:String,
        required:true
    },

    lastname:{
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        
    },

    password:{
        type:String,
        required:true
    },

    confirmpassword :{
        type:String,
        required:true
    } ,

    gender:{
        type:String, 
        required:true
    },

    interest: {
        type:String,
        required:true
    },

    profession: {
        type:String,
        required:true
    },

    age:{
        type:Number,
        required:true
    },
    phone:{
        type:Number,
        require:true
    }, //added token schema so that we can get token id
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

});

// Defining the generateAuthToken()  function for generating tokken
// .methods  wehen we work for the instance
//require tokem
employeeSchema.methods.generateAuthToken = async function(){
    try{

        // genereating the token bu using jwt.sign({unique:id, " string of min 32 char"})
        // get  _id  from our get data of emploeeSchema using this._id and convert it to string
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        // set the values of tokens-token  as the value of jwt,].sign generated token
        this.tokens = this.tokens.concat({token:token})
        // now we have to save it\
        await this.save();
        return token;
    } catch (error){
        res.send("error part" + error );
        console.log("error part" + error);
    }

}



// converting into HASHING
//Post and pre method, post for after the work is done
// before saving run these function
employeeSchema.pre("save", async function(next) {
    //use of template litrals to show the output
    //using this. what were user is feeding  we can access it
// if we modified due to any circumstances then using isModified
    if(this.isModified("password"))   {
   
        // this.password -->  user which inserting the password
        this.password =  await bcrypt.hash(this.password, 10);
    
        this.confirmpassword =  await bcrypt.hash(this.password, 10);;
    }
    next();

})


// we need to create collection
//  defining model;
const Register = new mongoose.model("Register", employeeSchema);

// export module register
module.exports = Register;