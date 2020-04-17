
// IMPORT
const express = require('express')
const app = express()
var session = require('express-session')
const port = 3001
const support = require('./supportFunctions');
var cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
const upload = multer() // for parsing multipart/form-data

//app.options('*', cors());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const test = require('assert');
const options = {
      credentials: true,
      origin: true,
      allowedHeaders: 'Origin,X-Requested-With,Content-Type,Authorization,Accept',
      methods: ['GET', 'PUT', 'POST', 'DELETE','OPTIONS']};
const options2 = {
      origin: true,
      
      methods: ['GET', 'PUT', 'POST', 'DELETE','OPTIONS']};
             
app.use(cors(options))
//From first sequence diagram
app.get('/categories/:val', support.handleCategoriesRequests )
app.get('/geos/:val', support.handleGeosRequests )
app.get('/ads', support.handleAdsRequest )
app.get('/ads/:val', support.handleAdsRequest ) //from specific Id
app.options('/ads/:val', cors(options));
app.put('/ads/:val', support.reportAdRequest );


app.post('/users', upload.array(), support.signupHandler )
app.put('/login', support.loginHandler )
app.put('/logout', upload.array(), support.logoutHandler )

app.options('/ads/:val', cors(options));
app.delete('/ads/:val', support.deleteAdsRequest)
app.post('/ads', support.handleAdsAddRequest )


//STARTING POINT
app.listen(port, () => {
                        console.log(`Example app listening on port ${port}!`);
                        }
                  )