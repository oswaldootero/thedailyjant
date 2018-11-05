var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
/* GET New User page. */
router.get('/newuser', function(req, res) {
    //console.log(req);
    res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    var mongo = require('mongodb');
    var monk = require('monk');
    var db = monk('localhost:27017/thedailyjants');


    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('subscribers');

    // Submit to the DB
    collection.insert({
        "email": userEmail
    }, function(err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // And forward to success page
            console.log(doc);
            res.redirect("newuser");
        }
    });
});
module.exports = router;