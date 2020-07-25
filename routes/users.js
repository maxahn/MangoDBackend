const express = require('express');
const router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const { uuidv4 } = require('uuidv4');

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.app.locals.users.find().toArray()
    .then(result => {
      res.setHeader('Content-Type', 'application/json');
      res.send(result);
    })
    .catch(error => {
      console.error(error);
      res.status(503).end();
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
      res.status(503).end();
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
      res.status(503).end();
    });
});

// Registers new user
// API request should have 'username' and 'email' in body
router.post('/', function(req, res, next) {
  const newUser = {
    auth0_id: req.body.auth0_id,
    username: req.body.username,
    email: req.body.email,
    profileUrl: uuidv4(),
    avatar: req.body.avatar,
    mangoCount: 0,
    totalMangosEarned: 0,
    totalClapsEarned: 0,
    tasksCompleted: 0,
    followers: [],
    following: [],
    badges: [],
    mangoTransactions: [],
    dateJoined: Date.now()
  }; // Make sure there's no bad stuff in body

  req.app.locals.users.insertOne(newUser).then(result => {
    res.setHeader('Content-Type', 'application/json');

    newUser._id = result.insertedId;
    res.send(newUser);
  }).catch(error => {
    console.error(error);
    res.status(503).end();
  });
});

// Updates the profileUrl for a given user
router.put('/:user_id/urlChange/:profileUrl', (req, res, next) => {
  const user_id = ObjectID(req.params.user_id);
  const newUrlName = req.params.profileUrl;

  req.app.locals.users.updateOne(
    { _id: user_id },
    {
      $set: { profileUrl: newUrlName }
    }
  ).then((result) => {
    res.status(200).send(newUrlName);
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });
})

// Get the user info via the profileUrl
router.get('/profileUrl/:profileUrl', (req, res, next) => {
  const profileUrl = req.params.profileUrl;

  req.app.locals.users.findOne({
    profileUrl: profileUrl
  })
    .then(result => {
      res.setHeader('Content-Type', 'application/json');
      res.send(result);
    })
    .catch(error => {
      console.error(error);
      res.status(503).end();
    });
})

// update user stats when task is complete 
router.put('/:user_id/taskComplete', (req, res, next) => {
  const user_id = ObjectID(req.params.user_id);
  const { mangosEarned } = req.body;
  console.log(`${user_id} earned ${mangosEarned} mangos!`);
  return req.app.locals.users.updateOne(
    { _id: user_id },
    {
      $inc: {
        mangoCount: mangosEarned,
        totalMangosEarned: mangosEarned,
        tasksCompleted: 1
      }
    }
  ).then((result) => {
    res.status(200).send(result);
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });
});

// history
router.post('/:_id/mangoTransactions', (req, res, next) => {
  const { _id } = req.params;
  const {
    type, 
    task_id,
  } = req.body;
  const { users, tasks } = req.app.locals;
  switch (type) {
    case 'TASK_COMPLETE': {
      tasks.findOne({
        _id: task_id 
      }).then(result => {
        console.dir(result);
        const { mangoTransactions } = result;
        // const mangosGained = mangoTransactions.reduce((acc, curr) => acc + curr);
        return users.updateOne(
          { _id: _id },
          { 
            $push: {
              mangoHistory: {
                type,
                amount
              }
            }
          }
        );
      }).catch(err => {
        console.error(err);
      });
    }
    default: {
      return;
    }
  }
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

/* PUT: Add a follower (currUser) to a user  */
router.put('/follow/:user_id', (req, res, next) => {
  const { currUser } = req.body;
  const currentUserID = ObjectID(currUser);
  const userID = ObjectID(req.params.user_id);
  req.app.locals.users.updateOne(    // first add the currUser as a follower
    { _id: userID },
    {
      $addToSet: { followers: currentUserID }
    }
  ).then((result) => {
    req.app.locals.users.updateOne(  // now add the user to the "following" array of currUser
      {_id: currentUserID},
      {
        $addToSet: { following: userID }
      }
    ).then((result) => {
      res.status(200).end();
    }).catch(err => {
      console.error(err);
      res.status(503).end();
    })                               // end of second query
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });
});

/* PUT: Remove a follower (currUser) from a user  */
router.put('/unfollow/:user_id', (req, res, next) => {
  const { currUser } = req.body;
  const currentUserID = ObjectID(currUser);
  const userID = ObjectID(req.params.user_id);
  req.app.locals.users.updateOne(    // remove currUser from array of "followers"
    { _id: userID },
    {
      $pull: { followers: currentUserID }
    }
  ).then((result) => {
    req.app.locals.users.updateOne(  // now remove the user from the "following" array of currUser
      {_id: currentUserID},
      {
        $pull: { following: userID }
      }
    ).then((result) => {
      res.status(200).end();
    }).catch(err => {
      console.error(err);
      res.status(503).end();
    })                               // end of second query
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });
});


module.exports = router;