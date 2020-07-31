const MANGOTREEDATA =  {
  fullGrowthMinutes: 240,
  maxMangos: 30,
  minMangos: 2, 
  maxLevel: 3,
  bonus: 0.2,
  levelToMaxMangos: (level) => {
    return level * 3 + (level - 1) * 2;
  }
}

exports.MANGOTREEDATA = MANGOTREEDATA;