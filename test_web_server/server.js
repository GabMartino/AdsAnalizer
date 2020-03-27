
// IMPORT
const express = require('express')
const app = express()
const port = 3001
var cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
const upload = multer() // for parsing multipart/form-data
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

//HANDLERS

app.post('/login', upload.array(), loginHandler )

function loginHandler(req, res){
    console.log(req.body);
    res.send("ok");

}

app.post('/signup', upload.array(), signupHandler )

function signupHandler(req, res){
    console.log(req.body);
    res.send("ok");
    
}

app.get('/categories', fieldsSearchBarHandler )


function fieldsSearchBarHandler(req, res){
    categories = [];
    categories.push('[{"_id":"13","name":"Per la casa e la persona","parentId":"13"},{"_id":"16","name":"Abbigliamento e accessori","parentId":"13"}]');
    
    res.json(JSON.parse(categories));

}


//STARTING POINT
app.listen(port, () => {
                        console.log(`Example app listening on port ${port}!`);
                        }
                  )