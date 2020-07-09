const { MongoClient, ObjectID } = require("../../node_modules/mongodb/index");
const { USERS } = require("./dummyUsers");

const path = require("../../node_modules/path");
const envPath = path.join(__dirname, '../../.env');
require("../../node_modules/dotenv").config({path: envPath});
//require("dotenv").config();

console.log(`DB_URI: ${process.env.DB_URI}`);

MongoClient.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(client => {
    console.log("Connected to MongoDB!");

    let db = client.db(process.env.DB_NAME);

    const users = db.collection('users');
    users.drop().then(() => {
      console.log("Dropped users table!");
      return users.insertMany(USERS);
    }).then(() => { 
      console.log("Inserted Users!")
      console.log("Closing connection...!")
      client.close();
    }).catch((err) => {
      console.error(err);
    });
  }).catch(error => {
  console.error(error);
});

