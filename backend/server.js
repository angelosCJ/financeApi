const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({origin:"*"}));

mongoose.connect("mongodb+srv://kadurienzo:ballsdeep%402025@mern.zylr0.mongodb.net/Sales?retryWrites=true&w=majority&appName=MERN").
then(()=> console.log("Connected to MongoDB")).
catch((error)=> console.log("Unable to connect to the Database",error));

const PORT = 8800;

app.listen(PORT,()=>{
  console.log("Succssesfuly connected to the server with port 8800");
});