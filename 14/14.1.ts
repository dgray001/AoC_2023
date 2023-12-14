import {readFileByLine} from "../util";

interface ColData {
  blocks: number[];
  rocks: number[];
}

const cols: ColData[] = [];

let curr_row = 0;

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  const chars = line.trim().split('');
  if (cols.length === 0) {
    for (const _ of chars) {
      cols.push({blocks: [], rocks: []});
    }
  }
  for (const [i, c] of chars.entries()) {
    if (c === 'O') {
      cols[i].rocks.push(curr_row);
    } else if (c === '#') {
      cols[i].blocks.push(curr_row);
    }
  }
  curr_row++;
}).then(() => {
  let sum = 0;
  for (const [i, col] of cols.entries()) {
    let last_row = 0;
    let row = 0;
    let curr_block = 0;
    if (curr_block < col.blocks.length) {
      row = col.blocks[curr_block];
    } else {
      row = curr_row;
    }
    for (const r of col.rocks) {
      if (r < row) {
        sum += curr_row - last_row;
        last_row++;
        continue;
      }
      while(true) {
        last_row = row + 1;
        curr_block++;
        if (curr_block < col.blocks.length) {
          row = col.blocks[curr_block];
        } else {
          row = curr_row;
        }
        if (r < row) {
          sum += curr_row - last_row;
          last_row++;
          break;
        }
      }
    }
  }
  console.log(sum);
});
