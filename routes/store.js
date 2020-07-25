const express = require('express');
const router = express.Router();
const ObjectID = require("mongodb").ObjectID;


/* PUT user: add new badge purchase to task */
router.put('/badge/purchase/:user_id', (req, res, next) => {
  const userID = ObjectID(req.params.user_id);
  const { badge } = req.body;
  const newMangoTransaction = {
    user_id: userID,
    mangoCount: (Number(badge.cost) * -1),
    timestamp: Date.now()
  };
  req.app.locals.users.updateOne(     // process mango transaction
    { _id: userID },
    {
      $inc: { mangoCount: (Number(badge.cost) * -1) },
      $push : { mangoTransactions: newMangoTransaction }
    }
  ).then((result) => {
    req.app.locals.users.updateOne(  // now add badge to user
      {_id: userID},
      {
        $push: {
          badges: {
            $each: [badge],
            $sort: {cost: -1}
          }
        }
      },
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