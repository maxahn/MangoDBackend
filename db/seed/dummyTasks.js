const { ObjectID } = require("../../node_modules/mongodb/index");
const TASKS = [
  {
    description: "Create dummy data for Task component",
    givenClaps: [],
    mangoTransactions: [],
    subTasks: [],
    dueDate: new Date(),
    isDone: false,
    isPublic: true,
    timestamp: new Date(),
  },
  {
    description: "Create task component",
    givenClaps: [], // id of users who has given claps
    mangoTransactions: [],
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
    mangoTransactions: [],
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