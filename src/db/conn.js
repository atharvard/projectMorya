// acquire mongoose to connect with database
const mongoose = require("mongoose");
// connecting Mongoose
// youtubeResgistration is the database folder name
mongoose.connect("mongodb://localhost:27017/Resgistrations", {
    // to avoid depression warning
    useNewUrlParser:true,
    useUnifiedTopology:true,
   
    // then and catch provide as if and else,  
}).then(() => {
    console.log("Connection sucessful");
}).catch((e) => {
    console.log("No connection");
})

