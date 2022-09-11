// dotenv package require
require('dotenv').config();
// require express
const express = require("express");

//acquiring path.join module
const path = require("path");

//require hbs for partials
const hbs = require("hbs"); //bbut need to registerPartials

//app constant will have all the function of express 
const app = express()

// require bcrypt module
const bcrypt = require("bcryptjs");

// connecting the mongoose databse in the running file
require("./db/conn");


//require/get the modules
const Register= require("./models/registers");



// declareing the port no. so that anyone can view the profect
const port = process.env.PORT || 4000;

// to run our index.html i.e staic folder  <app.use(express.static())> using path.join module
// path module is inbuilt module of expressJS, so we have to require it.
// __dirname is module rapper function, it willl display the current directory
//  and ../public will be the location to move on. but we have tell express about the change in path
const static_path = path.join(__dirname, "../public");

// getting views folder location 
const template_path = path.join(__dirname, "../templates/views");

// path of partails
const partials_path = path.join(__dirname, "../templates/partials");


// these for postman so that json data can be readable, but here we are not using postman
app.use(express.json());
// our own html code for form we can get the data of form easily, TO REMOVE UNDefiNE TAG
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));


// tell the app.js file to set view wngine and also about using handle bars
app.set("view engine", "hbs");

// defining the template path to express
app.set("views", template_path); //here views folder will go to template path 
// and template path will go to template/views location

// imported partials package but need to register it
hbs.registerPartials(partials_path);//also add path

// to get bydefault to index.hbs we need to chnage send as render

// defining root folder and using callback function 
app.get("/", (req, res) => {
    // render--> which file we want render/showcase
    res.render("index")
});
// defining 
app.get("/register", (req, res) => {
    // render--> which file we want render/showcase
    res.render("register")
});


app.get("/login", (req, res) => {
    // render--> which file we want render/showcase
    res.render("login")
});


// Post for Register
// to get the data of register page to mongoDB we need post request
// create a new user in our database
app.post("/register", async (req, res) => {
    try{
        // getting the data
        // checking password are same or not'
        //console.log(req.body.firstname);
        //res.send(req.body.firstname);
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if(password === confirmpassword){
            // if password match then store in our data variable
            // through these we can get the data
            // name attributes help to get the datta
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname:req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
                gender: req.body.gender,
                interest: req.body.interest,
                profession: req.body.profession,
                age: req.body.age,
                profile: req.body.profile,
                phone: req.body.phone
            })
            
            // hashing is  also a middleware here

            // Middleware for token
            console.log("the success part" + registerEmployee);
            // getting the data if the password match and then generating the token
            const token = await registerEmployee.generateAuthToken();
            // .generateAuthToken() these function will copy the the data from the above the and save it to .generateAuthToken()
            // now using these function we are going to use in register.js
            console.log("the token pasrt" + token);


            // saving the get data
            const registered = await registerEmployee.save();
            console.log("the page pasrt" + registered);
            res.status(201).render("index");

        }else{
            res.send("Password are not matching")
        }
    } catch(error){
        res.status(400).send(error);
    }
});


// login check post 
app.post("/login", async (req, res) => {
    // here we are worj=king with async function therefore use try and catch
    try{
        // Now try to get what user is entering in email and password
        const email = req.body.email;
        const password = req.body.password;
        // Now validating woth our database
        // validating using findone with our database
       // Register.findOne({databaseEmail:UserENteremail}) if matches 
        // /Register.findOne({email:email})
        //but here both are same so we can make it as, 
        const useremail = await Register.findOne({email});

        // to match with the bcrypted password of data base with user entering passwoord
        const isMatch = await bcrypt.compare(password, useremail.password);
        // ismatch will give true value or false value

        //  MIDDLEWARE, AFTEER COMPARING   GENERATE A TOKEN FOR INDIVIDUAL LOGIN
        const token = await useremail.generateAuthToken();  
        console.log("the token pasrt" + token);


       
        if(isMatch){
            res.status(201).render("index");
        }else{
            res.send("Invalid Email details")
        }
    }catch (error) {
        res.status(400).send("Invalid Email details")
    }
})


app.get("/about", (req, res) => {
    // render--> which file we want render/showcase
    res.render("about")
});



app.get("*", (req, res) => {
    res.render('404error', {
        errorMsg: 'Opps! Page not found'
    })
});

// to use, requiring Bcryptjs package
// const bcrypt = require("bcryptjs");

//hashing the return password by async function with passing parameter
// const securePassword = async (password) => {
//     //hashing the password
//     const passwordHash = await bcrypt.hash(password, 10)
//     console.log(passwordHash);
//     //10 rounds , more the no. of round more it will secure

//     // to confirm password which user is inserting and  register hashing password
//     // comapre to match the password
//     const passwordMatch = await bcrypt.compare(password, passwordHash)
//     console.log(passwordMatch);
// }






// listening to the port 3000 
app.listen(port, () => {
    console.log(`Server is running at port No. ${port}`)
});