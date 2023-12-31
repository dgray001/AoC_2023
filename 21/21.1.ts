import {P2D, readFileByLine} from "../util";

const map: string[][] = [];

const start: P2D = {x: -1, y: -1};

let j = 0;

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  map.push(line.trim().split(''));
  if (line.includes('S')) {
    start.y = j;
    for (let x = 0; x < line.length; x++) {
      if (line.charAt(x) === 'S') {
        start.x = x;
        break;
      }
    }
  }
  j++;
}).then(() => {
  const seen = new Set<string>();
  seen.add(JSON.stringify(start));
  let visited = 0;
  let q: P2D[] = [start];
  for (let step = 0; step <= 64; step++) {
    const next_q: P2D[] = [];
    const add = step % 2 === 0;
    for (const p of q) {
      if (add) {
        visited++;
      }
      for (const move of [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}]) {
        const n = {x: p.x + move.x, y: p.y + move.y};
        if (n.x < 0 || n.y < 0 || n.x >= map[0].length || n.y >= map.length) {
          continue;
        }
        const k = JSON.stringify(n);
        if (seen.has(k)) {
          continue;
        }
        seen.add(k);
        if (map[n.y][n.x] === '#') {
          continue;
        }
        next_q.push(n);
      }
    }
    q = next_q;
  }
  console.log(visited);
});
