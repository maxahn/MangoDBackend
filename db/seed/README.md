Seed instructions:

1. If you don't have any users in the database, run 'node nodeSeedUsers.js' first. This will populate users from the dummyUsers.js file. If you do have users you want to use in your DB, skip this step because it will drop the user table before populating.

2. Now run 'node nodeSeedTasks.js'. This will assign user ids to the tasks and also add claps and mangoTransactions.

3. Done.

Other notes: Make sure to run npm install before running the script since it's dependent on some packages. 