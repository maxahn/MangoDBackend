const moreUSERS = [
  {
    username: "SandyCheeks", 
    email: 'sandycheeks@bikinibottom.com',
    mangoCount: 50034343,
    totalMangosEarned: 2340003400,
    dateJoined: new Date(),
  },
  { username: "Squidward", 
    email: 'squidward@bikinibottom.com',
    mangoCount: 150,
    totalMangosEarned: 150,
    dateJoined: new Date(),
  }
];

db = db.getSiblingDB("dogetherDB");
db.users.insertMany(moreUSERS);