const { MANGO_TREE_DATA } = require("./MANGO_TREE_DATA");
const { uuid } = require('uuidv4');
const { getMinuteDifference } = require("../Date");

const initializeMangoTree = () => {
  let mangos = [];
  let level = 1;
  let startDate = new Date();
  for (let i = 0; i < MANGO_TREE_DATA.levelToMaxMangos(level); i++) {
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
  return getMinuteDifference(timestamp, now) / fullGrowthMinutes;
};

const enforceRange = (num, max, min) => {
  return Math.min(Math.max(num, min), max);
}

const calculateMangoBonus = (ripePercentage) => {
  const randomNum = Math.random();
  const { maxMangos, bonus } = MANGO_TREE_DATA;
  const maxMangoBonus = maxMangos * bonus;
  let mangoBonus = (randomNum < ripePercentage ) ? maxMangoBonus * randomNum : 0; 
  return enforceRange(mangoBonus, maxMangoBonus, 0);
}

const calculateMangoWorth = (mangoTimestamp) => {
  const { fullGrowthMinutes, minMangos, maxMangos, bonus } = MANGO_TREE_DATA;
  const per =  getRipePercentage(mangoTimestamp, fullGrowthMinutes);
  let base = Math.floor((maxMangos - minMangos) * per) + minMangos;
  base = enforceRange(base, maxMangos, minMangos);
  const mangoBonus = calculateMangoBonus(per);
  return base + mangoBonus; 
}

exports.initializeMangoTree = initializeMangoTree;
exports.calculateMangoWorth = calculateMangoWorth;