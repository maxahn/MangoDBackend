const MANGOTREEDATA = require("./MANGOTREEDATA").MANGOTREEDATA;
const { uuid } = require('uuidv4');
const { getMinuteDifference } = require("../Date");

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

const getRipePercentage = (timestamp, fullGrowthMinutes) => {
  const now = new Date().getTime();
  console.log(`timestamp: ${timestamp}, full: ${fullGrowthMinutes}`);
  return getMinuteDifference(timestamp, now) / fullGrowthMinutes;
};

const enforceRange = (num, max, min) => {
  return Math.min(Math.max(num, min), max);
}

const calculateMangoWorth = (mangoTimestamp) => {
  console.dir(MANGOTREEDATA);
  const { fullGrowthMinutes, minMangos, maxMangos, bonus } = MANGOTREEDATA;
  const per =  getRipePercentage(mangoTimestamp, fullGrowthMinutes);
  let base = Math.floor((maxMangos - minMangos) * per) + minMangos;
  base = enforceRange(base, maxMangos, minMangos);
  const randomNum = Math.random();
  const maxMangoBonus = maxMangos * bonus;
  let mangoBonus = (randomNum < per ) ? maxMangoBonus * randomNum : 0; 
  mangoBonus = enforceRange(mangoBonus, maxMangoBonus, 0);
  return base + mangoBonus; 
}

console.log(calculateMangoWorth(new Date().getTime() - (100000*60*3)));

exports.initializeMangoTree = initializeMangoTree;
exports.calculateMangoWorth = calculateMangoWorth;