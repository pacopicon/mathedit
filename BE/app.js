require('dotenv').config();

const express     			= require('express');
const app         			= express();
const bodyParser  			= require('body-parser');
const router = require('./router')

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//CORS middleware
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,PATCH,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers,Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization,x-access-token');
  next();
}
app.use(allowCrossDomain)

app.use('/api', router);

app.set('port', (process.env.BACKEND_PORT || 4000));

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});