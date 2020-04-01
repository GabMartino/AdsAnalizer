const MongoClient = require('mongodb').MongoClient;
//////////////////////// MAIN FUNCTION FOR DB CALLS
//const url = 'mongodb://localhost:27017';
const url = 'mongodb://80.112.184.23:810/';
const dbname = "maga";
async function sendDBRequest(callbackFunction, query){
    let client = {};
    var result = {};
    try{
        client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
        await client.connect();
        result = await callbackFunction(client, query);
    }catch(e){
        console.log(e);
    }finally{
        await client.close();
    }
    return result;
}

//////////// HANDLERS FOR DB CALLS
async function loginDBHandler(client, query){
    try{
        const result = await client.db(dbname).collection("users").findOne(query);
        return await result;
    }catch(e){
        console.log(e);
    }
}
async function signupDBHandler(client, query){
    try{
        const result = await client.db(dbname).collection("users").insertOne(query);
        return await result;
    }catch(e){
        console.log(e);
    }
}
async function adsDBHandler(client, query){
    try{
        const result = await client.db(dbname).collection("ads").find(query);
        return await result.toArray();
    }catch(e){
        console.log(e);
    }
}

module.exports = {
    

    loginHandler: async function (req, res){
        console.log(req.body);
        var query = { email: req.body.email , password: req.body.password };
        var result = await sendDBRequest(loginDBHandler, query).catch(console.err);
        console.log("After login Handler");
        console.log(result);
        if(result){
            res.send("ok");
        }else{
            res.send("notFound");
        }
    },

    signupHandler: async function (req, res){
        var query = {   name: req.body.name,
                        email: req.body.email , 
                        password: req.body.pass,
                        telephone: req.body.phone,
                     };
        var result = await sendDBRequest(signupDBHandler, query).catch(console.err);
        //console.log(result);
        if(result.insertedId){
            res.send("ok");
        }else{
            res.send("error");
        }
        
    },


    handleAdsRequest: async function (req, res){
        console.log(req.query);    
        var query = {};
        if(req.query.constructor === Object && Object.keys(req.query).length === 0) {
            console.log('Object missing');
        }else{
            var query = {
                $or: [
                    {subject: { $regex: req.query.src,  $options: 'i' }},
                    {body: { $regex: req.query.src,  $options: 'i' }}
                ]
                
            };
        }
        /*
        */
        /*
        "body": /req.query.src/,
            "category.id": req.query.cat,
            "geo.region": req.query.geo,
            "geo.province": req.query.geoprov,
            "features[0].value": {$gte: req.query.min},
        */
        console.log(query);
        var result = await sendDBRequest(adsDBHandler, query).catch(console.err);
        console.log(result);
        if(result){
            res.json(result);
        }else{
            res.send("notFound");
        }
    },


    handleGeosRequests: async function (req, res){
        if(req.query.val == 0){
            let region = '[{"_id":"13","name":"Abruzzo","level":{"$numberInt":"0"},"neighbors":["11","12","14"]}]';
            res.json(JSON.parse(region));
        }else if( req.query.val != 0){
            let ads = '[{"_id":"069","name":"Chieti","level":{"$numberInt":"1"},"regionId":"13","shortName":"CH"},{"_id":"068","name":"Pescara","level":{"$numberInt":"1"},"regionId":"13","shortName":"PE"}]';
            
            res.json(JSON.parse(ads));
        }
    }

}
