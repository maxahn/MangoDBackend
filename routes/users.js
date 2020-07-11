const express = require('express');
const router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });


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


// Get a user by auth0_id
router.get('/auth0/:auth0_id', function(req, res, next) {
  let auth0_id = req.params.auth0_id;

  req.app.locals.users.findOne({
    auth0_id: auth0_id
  })
    .then(result => {
      res.setHeader('Content-Type', 'application/json');

      if (!result) {
        // If mongoDB findOne doesn't find a user of this auth0_id, it will return null.
        // So return an error
        res.status(404).send();
      } else {
        res.send(result);
      }
    })
    .catch(error => {
      console.error(error);
    });
});


// Registers new user
// API request should have 'username' and 'email' in body
router.post('/', function(req, res, next) {
  const newUser = {
    auth0_id: req.body.auth0_id,
    username: req.body.username,
    email: req.body.email,
    avatar: req.body.avatar,
    mangoCount: 0,
    totalMangosEarned: 0,
    totalClapsEarned: 0,
    tasksCompleted: 0,
    dateJoined: Date.now()
  }; // Make sure there's no bad stuff in body

  req.app.locals.users.insertOne(newUser).then(result => {
    res.setHeader('Content-Type', 'application/json');

    newUser._id = result.insertedId;
    res.send(newUser);
  }).catch(error => {
    console.error(error);
  });
});

/* PUT user: add clap to user  */
router.put('/feed/claps/:user_id', (req, res, next) => {
  const { value } = req.body;
  const userID = ObjectID(req.params.user_id);
  req.app.locals.users.updateOne(
    { _id: userID },
    {
      $inc: { totalClapsEarned: value }
    }
  ).then((result) => {
    res.status(200).end();
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });

});

/* PUT user: add mango to user  */
router.put('/feed/mangos/:user_id', (req, res, next) => {
  const { numMango } = req.body;
  const userID = ObjectID(req.params.user_id);
  req.app.locals.users.updateOne(
    { _id: userID },
    {
      $inc: { totalMangosEarned: numMango, mangoCount: numMango }
    }
  ).then((result) => {
    res.status(200).end();
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });
});

/* PUT user: update user's avatar  */
router.put('/profile/avatar/:user_id', upload.single('image'), (req, res, next) => {
   const user_id = ObjectID(req.params.user_id);
   const { image } = req.body;
   req.app.locals.users.updateOne(
    { _id: user_id },
    {
      $set: { avatar: image }
    }
  ).then((result) => {
    res.status(200).end();
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });
});

/* PUT user: update username of user  */
router.put('/profile/name/:user_id', (req, res, next) => {
  const { newName } = req.body;
  const userID = ObjectID(req.params.user_id);
  req.app.locals.users.updateOne(
    { _id: userID },
    {
      $set: { username: newName }
    }
  ).then((result) => {
    res.status(200).end();
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });
});


module.exports = router;