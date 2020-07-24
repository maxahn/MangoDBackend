const sumMangos = (mangoTransactions) => {
  if (mangoTransactions) {
    return mangoTransactions.reduce((acc, curr) => {
      return acc + curr.mangoCount;
    }, 0);
  }
  return 0;
}

exports.sumMangos = sumMangos;