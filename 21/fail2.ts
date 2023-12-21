import {P2D, readFileByLine} from "../util";

const map: string[][] = [];

const start: P2D = {x: -1, y: -1};

let j = 0;

readFileByLine('input_test', async (line: string) => {
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
  const steps = 5000;
  const incs: number[] = [];
  for (let step = 0; step <= steps; step++) {
    if (step > 4 * map.length && step % (2 * map.length) === 0) {
      console.log(visited / (step * step));
      console.log(step);
      if (incs.length === 3) {
        console.log(incs);
        return;
      }
    }
    const next_q: P2D[] = [];
    const add = step % 2 === 0;
    for (const p of q) {
      if (add) {
        visited++;
      }
      for (const move of [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}]) {
        const n = {x: p.x + move.x, y: p.y + move.y};
        const orig_n = {x: n.x, y: n.y};
        const k = JSON.stringify(n);
        if (seen.has(k)) {
          continue;
        }
        n.x = (n.x % map[0].length + map[0].length) % map[0].length;
        n.y = (n.y % map.length + map.length) % map.length;
        seen.add(k);
        if (map[n.y][n.x] === '#') {
          continue;
        }
        next_q.push(orig_n);
      }
    }
    q = next_q;
  }
  console.log(visited);
});
