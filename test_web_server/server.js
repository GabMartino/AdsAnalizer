
// IMPORT
const express = require('express')
const app = express()
const port = 3001
const support = require('./supportFunctions');
var cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
const upload = multer() // for parsing multipart/form-data
app.use(cors({origin: true}))
//app.options('*', cors());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const test = require('assert');

//HANDLERS

app.put('/login', upload.array(), support.loginHandler )
app.put('/logout', upload.array(), support.logoutHandler )
app.post('/users', upload.array(), support.signupHandler )
app.get('/categories', support.handleCategoriesRequests )
app.get('/ads', support.handleAdsRequest )
app.post('/ads', support.handleAdsAddRequest )
app.get('/geos', support.handleGeosRequests )


//STARTING POINT
app.listen(port, () => {
                        console.log(`Example app listening on port ${port}!`);
                        }
                  )