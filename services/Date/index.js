const unixTimestampToMinutes = (ts) => {
  return ts / (60 * 1000);
};

const getMinuteDifference = (tsBefore, tsAfter) => {
  return unixTimestampToMinutes(tsAfter - tsBefore);
};

exports.getMinuteDifference = getMinuteDifference;