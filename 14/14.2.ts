import {readFileByLine} from "../util";

interface ColData {
  blocks: number[];
  rocks: number[];
}

const cols: ColData[] = [];
const rows: ColData[] = [];

let curr_row = 0;

function runCycle() {
  for (const row of rows) {
    row.rocks = [];
  }
  // north
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
        rows[last_row].rocks.push(i);
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
          rows[last_row].rocks.push(i);
          last_row++;
          break;
        }
      }
    }
  }
  for (const col of cols) {
    col.rocks = [];
  }
  // west
  for (const [i, col] of rows.entries()) {
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
        cols[last_row].rocks.push(i);
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
          cols[last_row].rocks.push(i);
          last_row++;
          break;
        }
      }
    }
  }
  for (const row of rows) {
    row.rocks = [];
  }
  // south
  for (const [i, col] of cols.entries()) {
    let last_row = curr_row - 1;
    let row = curr_row - 1;
    let curr_block = col.blocks.length - 1;
    if (curr_block < 0) {
      row = -1;
    } else {
      row = col.blocks[curr_block];
    }
    for (let ri = col.rocks.length - 1; ri >= 0; ri--) {
      const r = col.rocks[ri];
      if (r > row) {
        rows[last_row].rocks.push(i);
        last_row--;
        continue;
      }
      while(true) {
        last_row = row - 1;
        curr_block--;
        if (curr_block < 0) {
          row = -1;
        } else {
          row = col.blocks[curr_block];
        }
        if (r > row) {
          rows[last_row].rocks.push(i);
          last_row--;
          break;
        }
      }
    }
  }
  for (const col of cols) {
    col.rocks = [];
  }
  // east
  for (const [i, col] of rows.entries()) {
    let last_row = curr_row - 1;
    let row = curr_row - 1;
    let curr_block = col.blocks.length - 1;
    if (curr_block < 0) {
      row = -1;
    } else {
      row = col.blocks[curr_block];
    }
    for (let ri = col.rocks.length - 1; ri >= 0; ri--) {
      const r = col.rocks[ri];
      if (r > row) {
        cols[last_row].rocks.push(i);
        last_row--;
        continue;
      }
      while(true) {
        last_row = row - 1;
        curr_block--;
        if (curr_block < 0) {
          row = -1;
        } else {
          row = col.blocks[curr_block];
        }
        if (r > row) {
          cols[last_row].rocks.push(i);
          last_row--;
          break;
        }
      }
    }
  }
}

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  const chars = line.trim().split('');
  if (cols.length === 0) {
    for (const _ of chars) {
      cols.push({blocks: [], rocks: []});
      rows.push({blocks: [], rocks: []});
    }
  }
  for (const [i, c] of chars.entries()) {
    if (c === 'O') {
      cols[i].rocks.push(curr_row);
    } else if (c === '#') {
      cols[i].blocks.push(curr_row);
      rows[curr_row].blocks.push(i);
    }
  }
  curr_row++;
}).then(() => {
  const hashes = new Map<string, number>();
  const total_cycles = 1000000000;
  for (let i = 0; i < total_cycles; i++) {
    runCycle();
    const hash = JSON.stringify(cols);
    if (hashes.has(hash)) {
      const offset = (total_cycles - i - 1) % (i - hashes.get(hash));
      for (let j = 0; j < offset; j++) {
        runCycle();
      }
      break;
    } else {
      hashes.set(hash, i);
    }
  }
  let sum = 0;
  for (const col of cols) {
    for (const r of col.rocks) {
      sum += curr_row - r;
    }
  }
  console.log(sum);
});
