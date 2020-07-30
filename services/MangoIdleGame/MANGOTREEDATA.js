const MANGOTREEDATA =  {
  ripeMangoHourLength: 4,
  maxMangos: 10,
  minMangos: 1, 
  maxLevel: 3,
  levelToMaxMangos: (level) => {
    return level * 3 + (level - 1) * 2;
  }
}

exports.MANGOTREEDATA = MANGOTREEDATA;