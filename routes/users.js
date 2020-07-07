const express = require('express');
const router = express.Router();
const ObjectID = require("mongodb").ObjectID;

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.app.locals.users.find().toArray()
    .then(result => {
      res.setHeader('Content-Type', 'application/json');
      res.send(result);
    })
    .catch(error => {
      console.error(error);
    });
});

// Get a user by id
router.get('/:id', function(req, res, next) {
  let id = ObjectID(req.params.id);

  req.app.locals.users.findOne({
    _id: id
  })
    .then(result => {
      res.setHeader('Content-Type', 'application/json');
      res.send(result);
    })
    .catch(error => {
      console.error(error);
    });
});


// Registers new user
// API request should have 'username' and 'email' in body
router.post('/', function(req, res, next) {
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    mangoCount: 0,
    totalMangosEarned: 0,
    dateJoined: Date.now()
  }; // Make sure there's no bad stuff in body

  req.app.locals.users.insertOne(newUser).then(result => {
    res.setHeader('Content-Type', 'application/json');

    newUser._id = result.insertedId;
    res.send(newUser);
  }).catch(error => {
    console.error(error);
  });
})


module.exports = router;
