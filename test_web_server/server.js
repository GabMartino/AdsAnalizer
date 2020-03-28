
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

app.post('/users', registerNewUserHandler )


function registerNewUserHandler(req, res){
    //console.log(req.body);
    res.send("ok");
}

app.get('/ads', handleAdsRequest )

function handleAdsRequest(req, res){
    let ads = [];
    ads.push('[{"_id":"5e7a8605053d37588fbe9206","advertiser":{"phone":"0000000000","name":"Andonio","userId":"0"},"geo":{"province":{"id":"069","shortName":"CH","value":"Chieti"},"town":{"value":"Casalbordino"},"region":{"id":"13","value":"Abruzzo"}},"date":"2020-03-24 23:13:25","features":[{"name":"Prezzo","value":{"$numberInt":"200"}},{"name":"Tipologia","value":"Superfiga"}],"subject":"Maglia figa","body":"maglia figa ma brutta, ma troppo figa, che la mia maglia � pi� figa della tua","category":{"id":"16","label":"maglia","parentId":"13"}},{"_id":"5e7a8605053d37588fbe9205","advertiser":{"phone":"0000000000","name":"Andonio","userId":"0"},"geo":{"province":{"id":"069","shortName":"CH","value":"Chieti"},"town":{"value":"Casalbordino"},"region":{"id":"13","value":"Abruzzo"}},"date":"2020-03-24 23:13:25","features":[{"name":"Prezzo","value":{"$numberInt":"300"}},{"name":"Tipologia","value":"Superfiga"}],"subject":"Scarpe fighe","body":"scarpe fighe fighe, ma troppo fighe, che le mie sono pi� fighe delle tue","category":{"id":"16","label":"scarpe","parentId":"13"}}]');
    //console.log(ads);
    res.json(JSON.parse(ads));
}

app.get('/geos/', handleGeosRequests )

function handleGeosRequests(req, res){
    if(req.query.val == 0){
        let region = '[{"_id":"13","name":"Abruzzo","level":{"$numberInt":"0"},"neighbors":["11","12","14"]}]';
        res.json(JSON.parse(region));
    }else if( req.query.val != 0){
        let ads = '[{"_id":"069","name":"Chieti","level":{"$numberInt":"1"},"regionId":"13","shortName":"CH"},{"_id":"068","name":"Pescara","level":{"$numberInt":"1"},"regionId":"13","shortName":"PE"}]';
        
        res.json(JSON.parse(ads));
    }
}

//STARTING POINT
app.listen(port, () => {
                        console.log(`Example app listening on port ${port}!`);
                        }
                  )