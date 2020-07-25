const express = require('express');
const router = express.Router();
const path = require('path');


const taskRoutes = require('./tasks');
router.use('/tasks', taskRoutes);

const userRoutes = require('./users');
router.use('/users', userRoutes);

const storeRoutes = require('./store');
router.use('/store', storeRoutes);

router.use(function(req, res) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});


module.exports = router;
