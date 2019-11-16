const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');
const port = process.env.PORT || 3000;


app.listen(port);

console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./app/routes/appRoutes'); //importing route
routes(app); //register the route