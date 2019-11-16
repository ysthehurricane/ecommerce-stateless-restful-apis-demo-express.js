steps for rest api

1)create a project folder
2)open cmd
3)navigate in folder
4)type npm init
5)follow process by entering and last type yes
6)open project in editor
7)open package.json

8)install dependenccy
	- install node.js
	- install express framework = npm install --save express
	
	
9)create file server.js  on main route
10)create file app.js  on main route
11) Start the server :-
	-install package = npm install --save-dev nodemon for running server without restart when change occured
	-go in package.json file
		
		"scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start":"nodemon server.js"
		},
	
	-run = npm start


12) handling routes	
	- create folder api -> routes ->products.js (store all products routes)
	
13)install package for log in terminal (optional) = npm install --save morgan
	
	Add in app.js 
	
	const morgan =  require("morgan");


// Routes which should handle requests
const productroutes = require("./api/routes/products");
const orderroutes = require("./api/routes/orders");

app.use(morgan('dev'));



14)Error handling

	//when URL not Found
app.use((req , res , next)=>{
    const error = new Error("Not found");
    error.status = 404;
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


15)Extracting request body or body parsing

	-install package = npm install --save body-parser
	
16)fixing CORS errror 

17)add headers

//headers-cors
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');

    if(req.method === 'OPTIONS'){
        req.header('Access-Control-Allow-Methods','PUT , POST , PATCH , DELETE , GET');
        return res.status(200).json({});
    }
    next();
});