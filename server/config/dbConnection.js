const mongoose = require("mongoose");


const dbConnect = () =>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("DB Connected successfully");

    })
    .catch((error) =>{
        console.log("DB Connection failed");
        console.log(error);
     

    })

}
module.exports = dbConnect;
