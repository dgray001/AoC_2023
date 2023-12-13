import {readFileByLine} from "../util";

const patterns: string[][][] = [];
let curr_pattern: string[][] = [];

readFileByLine('input', async (line: string) => {
  if (!line) {
    if (curr_pattern.length > 0) {
      patterns.push(curr_pattern);
    }
    curr_pattern = [];
    return;
  }
  curr_pattern.push(line.trim().split(''));
}).then(() => {
  patterns.push(curr_pattern);
  let sum = 0;
  for (const pattern of patterns) {
    const rows = pattern.map(r => JSON.stringify(r));
    const inverted = pattern[0].map((_, i) => pattern.map(row => row[i]));
    const cols = inverted.map(r => JSON.stringify(r));
    let found = false;
    for (let i = 0; i < rows.length - 1; i++) {
      let difs = 0;
      for (let j = i + 1; j < rows.length; j++) {
        const k = i - (j - i) + 1;
        if (k < 0) {
          break;
        }
        if (rows[j] === rows[k]) {
          continue;
        }
        let ds = 0;
        for (let l = 0; l < rows[j].length; l++) {
          if (rows[j].charAt(l) === rows[k].charAt(l)) {
            continue;
          }
          ds++;
          if (ds > 1) {
            break;
          }
        }
        if (ds === 1) {
          difs += 1;
        } else {
          difs = 2;
          break;
        }
      }
      if (difs === 1) {
        sum += 100 * (i + 1);
        found = true;
        continue;
      }
    }
    if (found) {
      continue;
    }
    for (let i = 0; i < cols.length - 1; i++) {
      let difs = 0;
      for (let j = i + 1; j < cols.length; j++) {
        const k = i - (j - i) + 1;
        if (k < 0) {
          break;
        }
        if (cols[j] === cols[k]) {
          continue;
        }
        let ds = 0;
        for (let l = 0; l < cols[j].length; l++) {
          if (cols[j].charAt(l) === cols[k].charAt(l)) {
            continue;
          }
          ds++;
          if (ds > 1) {
            break;
          }
        }
        if (ds === 1) {
          difs += 1;
        } else {
          difs = 2;
          break;
        }
      }
      if (difs === 1) {
        sum += (i + 1);
        found = true;
        continue;
      }
    }
    if (found) {
      continue;
    }
    console.error('!!');
  }
  console.log(sum);
});
