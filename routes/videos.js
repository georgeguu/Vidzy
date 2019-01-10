var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/vidzy');

// Create an API endpoint for GETTING ALL video with an ID
//we use router.get method for handling an HTTP GET request.
router.get('/', function(req, res) {
    var collection = db.get('videos');

    var search = req.query.search;
    var searchCriteria = {};

    if (search) searchCriteria = { title : {'$regex': search, '$options':'i'} };

    collection.find(searchCriteria, function(err, videos){ //The second argument is a callback method that is executed when the result is returned 
        if (err) throw err;                    //from the database. This method follows the “error-first” callback pattern, which is the
      	res.json(videos);                      //standard protocol for callback methods in Node. With this pattern, the first argument 
    });                                        //of a callback method should be an error object, and the second should be the result (if any).
});

// Create an API endpoint for ADDING videos.
// we use router.post method for handling an HTTP POST request, which is the REST convention for creating new objects.
// We’ll use Express routes to create this endpoint and Monk to store a video document in Mongo
router.post('/', function(req, res){
    var collection = db.get('videos');
    collection.insert({
        title: req.body.title,
        gnere: req.body.genre,
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});

// Create an API endpoint for GETTING a video with an ID
router.get('/:id', function(req, res) {
    var collection = db.get('videos');
    //You can access the value of this parameter using req.params.id. We’re looking for a document with _id equal to req.params.id.
    collection.findOne({ _id: req.params.id }, function(err, video){ 
        if (err) throw err;
        res.json(video);
    });
});

// Create an API endpoint for UPDATTING a video with an ID
// This handler will be called only when there is an HTTP PUT request to this endpoint.
// 
router.put('/:id', function(req, res){
    var collection = db.get('videos');
    // We use the update method of the collection object to update a document. The first argument is the criteria object. We’re trying to update only the document with _id equal to req.params.id. The second argument represents the values to update.
    collection.update({
        _id: req.params.id
    },
    {
        title: req.body.title,
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});

// Create an API endpoint for DELETING a video with an ID
router.delete('/:id', function(req, res){
    var collection = db.get('videos');
    collection.remove({ _id: req.params.id }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});
module.exports = router; //module.exports should be the last line of your module
