const str = "المساعدة \n 1. المساعدة \n 2. المساعدة";


function formatRightToLeftMessage(str) {
  const strArr = str.split("\n");
  const newVal = [strArr[0]];

  for (let i = 1; i < strArr.length; i++){
    const answerArr = strArr[i].split(".");
    const newStr = answerArr[1] + " ." + answerArr[0];
    newVal.push(newStr);
  }

  return newVal;
}

const result = formatRightToLeftMessage(str);

console.log(result);