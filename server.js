const express = require("express")
const cors = require("cors");
const { urlencoded } = require("express");
const { db } = require("./model/index");
const mongoose = require('mongoose');
const dbConfig = require('./config/db.config');
const { DB } = require("./config/db.config");


const app = express();

const corsoption = {
    origin: "exp://192.168.0.110:19000",
}

app.use(cors(corsoption))
app.use(express.json())
app.use(urlencoded({extended:true}))


mongoose
  .connect(`mongodb+srv://farmerApp:0lxK9CUpqN2iiNDz@cluster0.x6r2lng.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


require('./routes/auth.routes')(app);


app.get("/",(req,res)=>{
    res.json({"message":"This is a new application for all with new updates"})
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});