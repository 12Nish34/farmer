const express = require("express")
const cors = require("cors");
const { urlencoded } = require("express");
const { db } = require("./model/index");
const mongoose = require('mongoose');
const dbConfig = require('./config/db.config');
const { DB } = require("./config/db.config");


const app = express();

const corsoption = {
    origin: "http:localhost:8080",
}

app.use(cors(corsoption))
app.use(express.json())
app.use(urlencoded({extended:true}))


mongoose
  .connect(`mongodb://u4zumvyczwesdqbltwpf:pBfUbow771LUikJWIFfF@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/brnycibq9z8zjnp?replicaSet=rs0`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


require('./routes/auth.routes')(app);
require('./routes/categorie/cat.routes')(app);


app.get("/",(req,res)=>{
    res.json({"message":"This is a new application for all with new updates"})
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});