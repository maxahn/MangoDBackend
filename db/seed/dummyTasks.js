const { ObjectID } = require("../../node_modules/mongodb/index");
const TASKS = [
  {
    description: "Create dummy data for Task component",
    givenClaps: [],
    clapsReceived: 5,
    mangoTransactions: [],
    mangosReceived: 32,
    subTasks: [],
    dueDate: new Date(),
    isDone: false,
    isPublic: true,
    timestamp: new Date(),
  },
  {
    description: "Create task component",
    givenClaps: [], // id of users who has given claps
    clapsReceived: 2482,
    mangoTransactions: [],
    mangosReceived: 1203,
    subTasks: [
      {
        id: new ObjectID(),
        description: "Talk to group members",
        isDone: true,
      },
      {
        id: new ObjectID(),
        description: "watch a mongodb video",
        isDone: false,
      },
      {
        id: new ObjectID(),
        description: "create the data",
        isDone: false,
      },
    ],
    isDone: false,
    isPublic: true,
    dueDate: new Date(),
    timestamp: new Date(),
  },
  {
    description: "Assassinate Albus Dumbledore",
    givenClaps: [],
    clapsReceived: 999,
    mangoTransactions: [],
    mangosReceived: 999,
    subTasks: [
      {
        id: new ObjectID(),
        description: "Offer headmaster a drink",
        isDone: true,
      },
      {
        id: new ObjectID(),
        description: "make him finish the drink",
        isDone: true,
      },
      {
        id: new ObjectID(),
        description: "push him off a tower?",
        isDone: false,
      },
      {
        id: new ObjectID(),
        description: "nah abra kadabra him",
        isDone: false,
      },
    ],
    isDone: false,
    dueDate: null,
    isPublic: false,
    timestamp: new Date(),
  },
];

exports.TASKS = TASKS;