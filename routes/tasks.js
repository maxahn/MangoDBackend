const express = require('express');
const app = require('../app');
const router = express.Router();
const ObjectID = require("mongodb").ObjectID;

/* GET tasks listing. */
router.get('/', function(req, res, next) {
  req.app.locals.tasks.find().toArray()
    .then(result => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(result);
    })
    .catch(error => {
      console.error(error);
    });
});


/* GET tasks by User */
router.get('/:user_id', function(req, res, next) {
  const user_id  = ObjectID(req.params.user_id);
  req.app.locals.tasks.find({user_id}).toArray()
  .then(result => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(result);
  })
  .catch(err => {
    res.status(503).end();
    console.error(err);
  });
});

/* POST new task, returns new created document ID */
router.post('/:user_id', function(req, res, next) {
  const user_id = ObjectID(req.params.user_id); 
  const { description, isPublic, dueDate } = req.body;
  const newTask = { 
    description, 
    isPublic,
    dueDate,
    user_id,
    givenClaps: [],
    mangoTransactions: [],
    subTasks: [],
    isDone: false,
    // NOTE: maybe timestamp should be created on the client so it will be congruent with the user's timezone 
    timestamp: new Date() 
  };

  req.app.locals.tasks.insertOne(newTask).then((result) => {
    const { insertedId } = result;
    console.dir(insertedId);
    res.status(200).send(insertedId);
  }).catch(err => {
    console.log(err);
    res.status(503).end();
  });
});

/* PUT task: updates indiscriminately the specified fields, 
whether or not they actually changed */ 

router.put('/:user_id/:task_id', (req, res, next) => {
  const user_id = ObjectID(req.params.user_id);
  const task_id = ObjectID(req.params.task_id);
  const { description, isDone, isPublic, dueDate } = req.body;
  req.app.locals.tasks.updateOne(
    { _id: task_id, user_id },
    {
      $set: {
        description, 
        isDone,
        isPublic,
        dueDate
      }
    }
  ).then((result) => {
    res.status(200).end();
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });
});

module.exports = router;