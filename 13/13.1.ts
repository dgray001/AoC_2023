import {readFileByLine} from "../util";

const patterns: boolean[][][] = [];
let curr_pattern: boolean[][] = [];

readFileByLine('input', async (line: string) => {
  if (!line) {
    if (curr_pattern.length > 0) {
      patterns.push(curr_pattern);
    }
    curr_pattern = [];
    return;
  }
  curr_pattern.push(line.trim().split('').map(c => c === '#'));
}).then(() => {
  patterns.push(curr_pattern);
  let sum = 0;
  for (const pattern of patterns) {
    const rows = pattern.map(r => JSON.stringify(r));
    const inverted = pattern[0].map((_, i) => pattern.map(row => row[i]));
    const cols = inverted.map(r => JSON.stringify(r));
    let found = false;
    for (let i = 0; i < rows.length - 1; i++) {
      found = true;
      for (let j = i + 1; j < rows.length; j++) {
        const k = i - (j - i) + 1;
        if (k < 0) {
          break;
        }
        if (rows[j] === rows[k]) {
          continue;
        }
        found = false;
        break;
      }
      if (found) {
        sum += 100 * (i + 1);
        break;
      }
    }
    if (found) {
      continue;
    }
    for (let i = 0; i < cols.length - 1; i++) {
      found = true;
      for (let j = i + 1; j < cols.length; j++) {
        const k = i - (j - i) + 1;
        if (k < 0) {
          break;
        }
        if (cols[j] === cols[k]) {
          continue;
        }
        found = false;
        break;
      }
      if (found) {
        sum += (i + 1);
        break;
      }
    }
    if (!found) {
      console.error('error');
    }
  }
  console.log(sum);
});
