const express = require('express');
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


/* GET tasks listing for feed, aggregated with user info. */
router.get('/feed', function(req, res, next) {
 req.app.locals.tasks.aggregate([
   { $lookup:
       {
         from: 'users',
         localField: 'user_id',
         foreignField: '_id',
         as: 'userDetails'
       }
   }
 ]).toArray()
   .then(result => {
     res.setHeader('Content-Type', 'application/json');
     res.status(200).send(JSON.stringify(result));
   })
   .catch(error => {
     console.error(error);
   })
});

/* PUT task: add clap to task */
router.put('/feed/claps/:task_id', (req, res, next) => {
  const task_id = ObjectID(req.params.task_id);
  const { value, donor } = req.body;
  const donor_id = ObjectID(donor);
  req.app.locals.tasks.updateOne(
    { _id: task_id },
    {
      $inc: { clapsReceived: value }
    },
    {
      $push : { givenClaps: donor_id }
    }
  ).then((result) => {
    res.status(200).end();
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });

});

/* PUT task: add mangos to task */
router.put('/feed/mangos/:task_id', (req, res, next) => {
  const task_id = ObjectID(req.params.task_id);
  const { numMango, donor } = req.body;
  const donor_id = ObjectID(donor);
  const newMangoTransaction = {
    user_id: donor_id,
    mangoCount: numMango,
    timestamp: Date.now()
  };
  req.app.locals.tasks.updateOne(
    { _id: task_id },
    {
      $inc: { mangosReceived: numMango }
    },
    {
      $push : { mangoTransactions: newMangoTransaction }
    }
  ).then((result) => {
    res.status(200).end();
  }).catch(err => {
    console.error(err);
    res.status(503).end();
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
    clapsReceived: 0,
    mangoTransactions: [],
    mangosReceived: 0,
    subTasks: [],
    isDone: false,
    timestamp: Date.now()
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

router.put('/:task_id', (req, res, next) => {
  const task_id = ObjectID(req.params.task_id);
  // WARNING: need to make sure client sends all of these fields,
  // or they may be set to null
  const { description, isDone, isPublic, dueDate } = req.body;
  req.app.locals.tasks.updateOne(
    { _id: task_id },
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


router.get('/:task_id/givenClaps', (req, res, next) => { 
  const task_id = ObjectID(req.params.task_id);
  req.app.locals.tasks.findOne(
    { _id: task_id },
    { givenClaps: 1 }
  ).then(foundTask => {
    res.status(200).send(foundTask.givenClaps);
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });
});


router.get('/:task_id/subTasks', (req, res, next) => { 
  const task_id = ObjectID(req.params.task_id);
  req.app.locals.tasks.findOne(
    { _id: task_id },
    { subTasks: 1 }
  ).then(task => {
    res.status(200).send(task.subTasks);
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });
});


router.get('/:task_id/mangoTransactions', (req, res, next) => { 
  const task_id = ObjectID(req.params.task_id);
  req.app.locals.tasks.findOne(
    { _id: task_id },
    { mangoTransactions: 1 }
  ).then(task => {
    res.status(200).send(task.mangoTransactions);
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });
});

// untested due to sending ObjectID in body
router.post('/:task_id/givenClaps', (req, res, next) => { 
  const task_id = ObjectID(req.params.task_id);
  const { user_id } = req.body;
  req.app.locals.tasks.updateOne(
    { _id: task_id },
    { 
      "$push": {
        "givenClaps": user_id 
      }
    }
  ).then(() => {
    res.status(200).end();
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });
});


router.post('/:task_id/subTasks', (req, res, next) => { 
  const task_id = ObjectID(req.params.task_id);
  const { description } = req.body; 
  const newSubTask = {
    id: new ObjectID(),
    description,
    isDone: false
  };
  req.app.locals.tasks.updateOne(
    { _id: task_id },
    { 
      "$push": {
        "subTasks":  newSubTask
      }
    }
  ).then(() => {
    res.status(200).send(newSubTask);
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });
});

// untested due to sending ObjectID in body
router.post('/:task_id/mangoTransactions', (req, res, next) => { 
  const task_id = ObjectID(req.params.task_id);
  const { user_id, mangoCount, totalMangoCount } = req.body; 
  const newMangoTransaction = {
    user_id,
    mangoCount, 
    timestamp: Date.now()
  };
  req.app.locals.tasks.updateOne(
    { _id: task_id },
    { 
      "$set": {
        mangosGiven: totalMangoCount
      },
      "$push": {
        "mangoTransactions":  newMangoTransaction
      }
    }
  ).then(() => {
    res.status(200).send(newMangoTransaction);
  }).catch(err => {
    console.error(err);
    res.status(503).end();
  });

});

module.exports = router;