import {readFileByLine} from "../util";

interface P2D {
  x: number;
  y: number;
}

const galaxies: P2D[] = [];
const rows = new Set<number>();
const cols = new Set<number>();

let j = 0;
readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  for (const [i, px] of line.split('').entries()) {
    if (px === '#') {
      galaxies.push({x: i, y: j});
      rows.add(j);
      cols.add(i);
    }
  }
  j++;
}).then(() => {
  let sum = 0;
  console.log(galaxies);
  console.log(rows);
  console.log(cols);
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = 0; j < i; j++) {
      const xi = galaxies[i].x;
      const xf = galaxies[j].x;
      const yi = galaxies[i].y;
      const yf = galaxies[j].y;
      sum += Math.abs(xi - xf);
      sum += Math.abs(yi - yf);
      for (let k = Math.min(xi, xf) + 1; k < Math.max(xi, xf); k++) {
        if (!cols.has(k)) {
          sum++;
        }
      }
      for (let k = Math.min(yi, yf) + 1; k < Math.max(yi, yf); k++) {
        if (!rows.has(k)) {
          sum++;
        }
      }
    }
  }
  console.log(sum);
});
