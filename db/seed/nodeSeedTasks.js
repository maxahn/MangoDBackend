const { MongoClient, ObjectID } = require("../../node_modules/mongodb/index");
const { TASKS } = require("./dummyTasks");

const path = require("../../node_modules/path");
const envPath = path.join(__dirname, '../../.env');
require("../../node_modules/dotenv").config({path: envPath});

console.log(`DB_URI: ${process.env.DB_URI}`);

const setTasksUserID = (tasks, users) => {
  let i = 0;
  for (let task of tasks) {
    task.user_id = users[i]._id;
    i = (i + 1) % users.length;
  }
}

const maxMangos = 20;
const minMangos = 1;
const setMangoTransactions = (tasks, users) => {
  for (let task of tasks) {
    for (let user of users) {
      if (task.isPublic) {
        let mangoCount = Math.random() * (maxMangos - minMangos) + minMangos;
        mangoCount = Math.round(mangoCount);
        task.mangoTransactions.push({
          user_id: user._id,
          mangoCount, 
          timestamp: new Date()
        });
      }
    }
  }
}

const setClaps = (tasks, users) => {
  let i = 0;
  for (let task of tasks) {
    for (let user of users) {
      if (task.isPublic) {
        task.givenClaps.push(user._id);
      }
    }
  }
}

MongoClient.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(client => {
    console.log("Connected to MongoDB!");

    let db = client.db(process.env.DB_NAME);

    const users = db.collection('users');
    const tasks = db.collection('tasks');

    users.find({}).toArray().then((usersArray) => {
      if (usersArray.length >= 1) {
        console.log("users found, dropping tasks table...");
        setTasksUserID(TASKS, usersArray);
        setMangoTransactions(TASKS, usersArray);
        setClaps(TASKS, usersArray);
        return tasks.drop();
      } else {
        console.log("ERROR NO USERS: Run nodeSeedUsers.js script first!");
        return;
      }
    }).then(() => {
      console.log("Dropped tasks table!");
      return tasks.insertMany(TASKS);
    }).then(() => {
      console.log("Inserted TASKS!");
      console.log("Closing connection...");
      client.close();
    }).catch((err) => {
      console.error(err);
    });
  }).catch(error => {
  console.error(error);
});

