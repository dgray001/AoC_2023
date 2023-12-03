import {readFileByLine, isNumeric} from "../util";
import {Num, P2D, adjacent} from "./03.1";

const gears: P2D[] = [];
const numbers: Num[] = [];

let sum = 0;

let i = 0;
readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  let curr_num = '';
  let in_num = false;
  for (let j = 0; j < line.length; j++) {
    const c = line.charAt(j);
    if (isNumeric(c)) {
      in_num = true;
      curr_num += c;
    } else {
      if (in_num) {
        numbers.push({n: parseInt(curr_num), s: {x: i, y: j - curr_num.length}, e: {x: i, y: j - 1}});
        curr_num = '';
        in_num = false;
      }
      if (c === '*') {
        gears.push({x: i, y: j});
      }
    }
  }
  if (in_num) {
    numbers.push({n: parseInt(curr_num), s: {x: i, y: line.length - curr_num.length}, e: {x: i, y: line.length - 1}});
  }
  i++;
}).then(() => {
  console.log(numbers);
  console.log(gears);
  let num1 = 0;
  for (const g of gears) {
    num1 = 0;
    for (const n of numbers) {
      if (adjacent(n, g)) {
        if (!!num1) {
          sum += num1 * n.n;
          break;
        } else {
          num1 = n.n;
        }
      }
    }
  }
  console.log(sum);
});
