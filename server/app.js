const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const path = require("path");
const handleError = require("./utils/logger");
const RecordsApi = require("./controllers/Records");

const app = express();
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());


MongoClient.connect(process.env.DATABASE_CONNECTION_URI,{useUnifiedTopology:true})
.then(client=>{
    console.log("Connected to database")
    const database = client.db(process.env.DATABASE);
    const collection = database.collection(process.env.COLLECTION);
    app.get("/records",(req,res)=>{
        const records = new RecordsApi(collection,res,req);
        return records.retrieveRecords();
    })
})
.catch(e=>{
    //personal universal logging service
    const data = {
        application:"HostGuest",
        filePath:path.join(__dirname,"app"),
        request:"retrieveRecords",
        time:new Date().getTime(),
        errorMessage:e.message,
        secretCode:process.env.SECRET_CODE
    }
    handleError(data);
    throw new Error(e);
});


app.listen(process.env.PORT,()=>console.log("App running successfully"));
module.exports = app;
