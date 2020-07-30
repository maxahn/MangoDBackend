const MANGOTREEDATA = require("./MANGOTREEDATA").MANGOTREEDATA;
const { uuid } = require('uuidv4');

const initializeMangoTree = () => {
  let mangos = [];
  let level = 1;
  let startDate = new Date();
  // console.log(MANGOTREEDATA.levelToMaxMangos(level));
  for (let i = 0; i < MANGOTREEDATA.levelToMaxMangos(level); i++) {
    mangos.push(startDate.getTime());
  }

  return {
    id: uuid(),
    level: 0,
    mangos
  };
}

exports.initializeMangoTree = initializeMangoTree;