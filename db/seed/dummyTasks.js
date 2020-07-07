const { ObjectID } = require("../../node_modules/mongodb/index");
const TASKS = [
  {
    title: "Create dummy data for Task component",
    description: "For 436I",
    givenClaps: [],
    mangoTransactions: [],
    subTasks: [],
    dueDate: new Date(),
    isDone: false,
    isPublic: true,
    timestamp: new Date(),
  },
  {
    title: "Create task component",
    description: "For 436I",
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
    title: "Assassinate Albus Dumbledore",
    description: "For 436I",
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
