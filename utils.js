"use strict";

// もし時間まで出力するならばgetTimeをtrueにする．
// const Month = ("00" + (dt.getMonth() + 1)).slice(-2);
export const getNowYMD = (getTime) => {
  const dt = new Date();
  const Year = dt.getFullYear();
  const Month = `00${dt.getMonth() + 1}`.slice(-2);
  const Day = `00${dt.getDate()}`.slice(-2);
  let result = `${Year}-${Month}-${Day}`;
  if (getTime) {
    const Hour = `00${dt.getHours()}`.slice(-2);
    const Min = `00${dt.getMinutes()}`.slice(-2);
    const Sec = `00${dt.getSeconds()}`.slice(-2);
    result += ` (${Hour}:${Min}:${Sec})`;
  }
  return result;
};
