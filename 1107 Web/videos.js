var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/vidzy');

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

router.get('/:id', function(req, res) {
    var collection = db.get('videos');
    collection.findOne({ _id: req.params.id }, function(err, video){
        if (err) throw err;
      	res.json(video);
    });
});

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

module.exports = router;
