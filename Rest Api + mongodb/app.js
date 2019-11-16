const express = require("express");
const app = express();
const morgan =  require("morgan");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

// Routes which should handle requests
const productroutes = require("./api/routes/products");
const orderroutes = require("./api/routes/orders");
const userroutes = require("./api/routes/user");

mongoose.connect("mongodb+srv://rest-api-practice:"+process.env.MONGO_ATLAS_PW +"@rest-api-practice-vgiq6.mongodb.net/test?retryWrites=true",{
    useNewUrlParser : true,
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));

//public available uploads folder 
app.use('/uploads' , express.static('uploads'));

//request data from many methods json , urlencded , etc....
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());


app.use((req,res,next)=>{

    res.header('Access-Control-Allow-Origin' ,'*'),
    res.header('Access-Control-Allow-Headers' , 'Origin , X-Requested-With, Content-Type , Accept , Authorization');

    if(req.method === 'OPTIONS')
    {
        req.header('Access-Control-Allow-Methods' , 'PUT , POST , PATCH , DELETE , GET');
        return res.status(200).json({});
    }
    next();
});

app.use("/products" , productroutes);
app.use("/orders" , orderroutes);
app.use("/user" , userroutes);

//when URL not Found
app.use((req , res , next)=>{
    const error = new Error("Not found");
    error.status=404;
    next(error);
});

//When error occur in database
app.use((error,req,res,next)=>{
    res.status(error.status || 500).json({
        error : {
            message : error.message,
        }
    });
});

module.exports = app;