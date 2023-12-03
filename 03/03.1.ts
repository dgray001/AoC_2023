import {readFileByLine, isNumeric} from "../util";

export interface P2D {
  x: number;
  y: number;
}

export interface Num {
  n: number;
  s: P2D;
  e: P2D;
}

export function adjacent(n: Num, p: P2D): boolean {
  if (p.x < n.s.x - 1) {
    return false;
  }
  if (p.x > n.e.x + 1) {
    return false;
  }
  if (p.y < n.s.y - 1) {
    return false;
  }
  if (p.y > n.e.y + 1) {
    return false;
  }
  return true;
}

const symbols: P2D[] = [];
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
      if (c === '.') {
        continue;
      } else {
        symbols.push({x: i, y: j});
      }
    }
  }
  if (in_num) {
    numbers.push({n: parseInt(curr_num), s: {x: i, y: line.length - curr_num.length}, e: {x: i, y: line.length - 1}});
  }
  i++;
}).then(() => {
  console.log(numbers);
  console.log(symbols);
  for (const n of numbers) {
    for (const s of symbols) {
      if (adjacent(n, s)) {
        sum += n.n;
        break;
      }
    }
  }
  console.log(sum);
});
