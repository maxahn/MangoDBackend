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
        id: "tempID123kfjsdkfjkdjf",
        description: "Talk to group members",
        isDone: true,
      },
      {
        id: "tempIDsldfkajsdf2343",
        description: "watch a mongodb video",
        isDone: false,
      },
      {
        id: "tempIDdkajfsklfdjajfd",
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
        id: "tempIDlakjdfsdjkfjkdjf13490",
        description: "Offer headmaster a drink",
        isDone: true,
      },
      {
        id: "tempID349udksjf3249jdfkjf",
        description: "make him finish the drink",
        isDone: true,
      },
      {
        id: "tempID2304ijfdsfdfjdjfj32r",
        description: "push him off a tower?",
        isDone: false,
      },
      {
        id: "tempID2i3oi4jifjdddidjacvz",
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

const USERS = [
  {
    username: "PatrickStar", 
    email: 'patrickstar@gmail.com',
    mangoCount: 234,
    totalMangosEarned: 500,
    dateJoined: new Date(),
  },
  { username: "SpongeBob", 
    email: 'spongebobhaspants@gmail.com',
    mangoCount: 50000,
    totalMangosEarned: 10003400034,
    dateJoined: new Date(),
  }
];

db = db.getSiblingDB("dogetherDB");
db.tasks.drop();
db.tasks.insertMany(TASKS);
db.users.drop();
db.users.insertMany(USERS);