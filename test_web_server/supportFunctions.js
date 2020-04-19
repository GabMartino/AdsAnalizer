const MongoClient = require('mongodb').MongoClient;
var accepts = require('mongodb-language-model').accepts;
//////////////////////// MAIN FUNCTION FOR DB CALLS
const url = 'mongodb://localhost:27017';
//const url = 'mongodb://80.112.184.23:810/';
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
        const result = await client.db(dbname).collection("ads").find(query).limit(10);
        return await result.toArray();
    }catch(e){
        console.log(e);
    }
}
async function categoriesHandler(client, query){
    try{
        const result = await client.db(dbname).collection("categories").find(query);
        return await result.toArray();
    }catch(e){
        console.log(e);
    }
}
async function adsAddHandler(client, query){
    try{
        query._id = "999999";
        const result = await client.db(dbname).collection("ads").insertOne(query);
        return await result;
    }catch(e){
        console.log(e);
    }
}
async function updateAdHandler(client, query){//just for reporting
    try{
        let newQuery = {
            _id : query._id
        }
        let result = await client.db(dbname).collection("ads").findOne(newQuery);
        if(result.report != undefined )
            result = await client.db(dbname).collection("ads").updateOne(result, {$set : {"report": query.report? result.report + 1 : result.report - 1}});
        else
            result = await client.db(dbname).collection("ads").updateOne(result, {$set : {"report": 1}});
        
        return await result;
    }catch(e){
        console.log(e);
    }
}
async function deleteAdHandler(client, query){
    try{
        const result = await client.db(dbname).collection("ads").deleteOne(query);
        return await result;
    }catch(e){
        console.log(e);
    }
}

async function geoDBHandler(client, query){
    try{
        const result = await client.db(dbname).collection("geo").find(query);
        return await result.toArray();
    }catch(e){
        console.log(e);
    }
}


module.exports = {
    

    loginHandler: async function (req, res){
        console.log(req.body);
        var query = { email: req.body.email , password: req.body.pass };
        var result = await sendDBRequest(loginDBHandler, query).catch(console.err);
        console.log("After login Handler");
        //console.log(result);
        if(result){
            //To not response back the password
            var responseBack = {
                id: result._id,
                name: result.name,
                email: result.email,
                telephone: result.telephone,
                admin: result.admin 
            }
            res.cookie("sessionId",Math.random() * Math.floor(99999999));
            res.cookie("userId",result._id);
            res.cookie("name",result.name);
            res.cookie("admin", result.admin);
            res.send("ok");
        }else{
            res.send("notFound");
        }
    },
    logoutHandler: async function (req, res){
        //console.log(req.body);
        res.send("OK");
    },

    signupHandler: async function (req, res){
        var query = {   name: req.body.name,
                        email: req.body.email , 
                        password: req.body.pass,
                        telephone: req.body.phone,
                        admin: false
                     };
        var result = await sendDBRequest(signupDBHandler, query).catch(console.err);
        //console.log(result);
        if(result.insertedId){
            res.send("ok");
        }else{
            res.send("error");
        }
        
    },
    deleteAdsRequest: async function (req, res){
        
        console.log(req.query);    
        let query = {};
        if(req.params.val){
            query = {
                _id: req.params.val
            }
        }
        var result = await sendDBRequest(deleteAdHandler, query).catch(console.err);
        //console.log(result);
        if(result){
            res.send("ok");
        }else{
            res.send("error");
        }
        
    },
    handleAdsAddRequest: async function (req, res){
        //console.log(req.body);
        var result = await sendDBRequest(adsAddHandler, req.body).catch(console.err);
        //console.log(result);
        if(result){
            res.send("ok");
        }else{
            res.send("error");
        }
        
    },
    reportAdRequest: async function (req, res){
        
        console.log("Report request");
        let query = {}
        if(req.params.val){
            query = {
                _id: req.params.val,
                report: req.body.report
            }
        }
        //var document = await sendDBRequest(adsDBHandler, query).catch(console.err);
        /*let newField = {
            'report': req.body.report
        }
        console.log(document[0]);*/
        var result = await sendDBRequest(updateAdHandler, query).catch(console.err);
        
        if(result){
            res.send("ok");
        }else{
            res.send("error");
        }
        
    },

    handleAdsRequest: async function (req, res){
        //console.log(req);
        console.log(req.query);    
        var query = {};
        if(req.params.val){
            query = {
                _id: req.params.val
            }
        }
        if(req.query.constructor === Object && Object.keys(req.query).length === 0) {
            console.log('Object missing');
        }else if(req.query.uid != undefined){
            query = {
                'advertiser.userId': req.query.uid
            };
            
        }else{
            query = {
                $and: []
            };
            if(req.query.pag != undefined){
                query = {};
            }
            if(req.query.src != undefined && req.query.src != ''){
                query.$and.push({
                        
                    $or: [
                        {'subject': { $regex: req.query.src,  $options: 'i' }},
                        {'body': { $regex: req.query.src,  $options: 'i' }}
                    ],
                                           
                });
            }
            if(req.query.cat != undefined){
                query.$and.push( {
                    $or: [ {'category.id':  req.query.cat},
                        {'category.parentId':  req.query.cat}
                        ]
                });
            }
            if(req.query.geo != undefined){
                query.$and.push( { 
                    $or: [ {'geo.region.id':  req.query.geo },
                        {'geo.province.id':  req.query.geo }
                        ]
                });
            }
          
            if(req.query.min != undefined && req.query.max != undefined){
                
                query.$and.push({
                    $and: [
                        {
                            'features.0.value': { $gte: parseFloat(req.query.min)}
                        },{
                            'features.0.value': { $lte: parseFloat(req.query.max) }
                        }
                    ]

                });
            }else if(req.query.min != undefined){
                query.$and.push({
                    $and: [
                        {
                            'features.0.value': { $gte: parseFloat(req.query.min)}
                        }
                    ]

                });
            }else if(req.query.max != undefined){
                query.$and.push({
                    $and: [{
                            'features.0.value': { $lte: parseFloat(req.query.max) }
                        }
                    ]

                });
            }else if(req.query.rep != undefined){
                query.$and.push({
                    'report': { $gt: 0}
                });
            }
            if(Array.isArray(query.$and)){
                for( var i = query.$and.length -1 ; i >= 0; i--){
                    var obj = query.$and[i];
                    if(obj[Object.keys(obj)[0]] == undefined){
                        query.$and.splice(i,1);
                    }
                }
            }
            
        }
        console.log(query);
        var result = await sendDBRequest(adsDBHandler, query).catch(console.err);
        //console.log(result);
        if(result){
            res.json(result);
        }else{
            res.send("notFound");
        }
    },


    handleGeosRequests: async function (req, res){
        if(req.params.val == 0){
           
            var query = {
                level: 0
            };
            var result = await sendDBRequest(geoDBHandler, query).catch(console.err);
            
            res.json(result);
        }else{
            var query = {
                level: 1,
                regionId: req.params.val
            };
           
            var result = await sendDBRequest(geoDBHandler, query).catch(console.err);
            //console.log(result);
            res.json(result);
        }
    },

    handleCategoriesRequests: async function(req, res){
        if(req.params.val == 0){
            var query = {
                $where: 'this.parentId == this._id'
            };
            //console.log("vediamo")
            //console.log(query);
            var result = await sendDBRequest(categoriesHandler, query).catch(console.err);
            //console.log(result);
            res.json(result);
        }else if( req.params.val != 0){
            var query = {
                $and: [
                    { parentId: req.params.val},
                    {
                        $where: 'this.parentId != this._id'
                    }
                ]
               
            };
            var result = await sendDBRequest(categoriesHandler, query).catch(console.err);
            
            res.json(result);
        }

    }
}
