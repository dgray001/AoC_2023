import {P2D, readFileByLine} from "../util";

const map: string[][] = [];

const start: P2D = {x: -1, y: -1};

let j = 0;

interface QueueData {
  p1: P2D;
  p2: P2D;
  d: number;
}

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
  const distances = new Map<string, number>();
  const q: QueueData[] = [{p1: {x: 0, y: 0}, p2: start, d: 0}];
  const w = map.length; // square
  // fill up all distances of original square and 8 adjacent periods
  while (q.length > 0) {
    const qd = q.shift();
    if (qd.p2.x < 0) {
      qd.p1.x -= 1;
      qd.p2.x += w;
    } else if (qd.p2.x >= w) {
      qd.p1.x += 1;
      qd.p2.x -= w;
    }
    if (qd.p2.y < 0) {
      qd.p1.y -= 1;
      qd.p2.y += w;
    } else if (qd.p2.y >= w) {
      qd.p1.y += 1;
      qd.p2.y -= w;
    }
    if (map[qd.p2.y][qd.p2.x] === '#') {
      continue;
    }
    const k = JSON.stringify({p1: qd.p1, p2: qd.p2});
    if (Math.abs(qd.p1.x) > 1 || Math.abs(qd.p1.y) > 1) {
      continue;
    }
    if (distances.has(k)) {
      continue;
    }
    distances.set(k, qd.d);
    for (const move of [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}]) {
      q.push({
        p1: {x: qd.p1.x, y: qd.p1.y},
        p2: {x: qd.p2.x + move.x, y: qd.p2.y + move.y},
        d: qd.d + 1,
      });
    }
  }
  // need to cache these calculations since they are expensive
  const solve_cache = new Map<string, number>();
  function solve(dis: number, edges: number, steps: number): number {
    const amt = Math.floor((steps - dis) / map.length);
    const k = JSON.stringify({dis, edges, steps});
    if (solve_cache.has(k)) {
      return solve_cache.get(k);
    }
    let result = 0;
    for (let x = 1; x <= amt; x++) {
      const total_dis = dis + map.length * x;
      if (total_dis <= steps && total_dis % 2 === steps % 2) {
        result++;
        if (edges === 2) {
          result += x; // quadratic for 4 corner periods
        }
      }
    }
    solve_cache.set(k, result);
    return result;
  }
  const steps = 26501365;
  let answer = 0;
  // essentially 
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map.length; y++) {
      const k = JSON.stringify({p1: {x: 0, y: 0}, p2: {x, y}});
      if (!distances.has(k)) {
        continue;
      }
      for (let tx = -1; tx <= 1; tx++) {
        for (let ty = -1; ty <= 1; ty++) {
          const dis = distances.get(JSON.stringify({p1: {x: tx, y: ty}, p2: {x, y}}))
          if (dis % 2 === steps % 2 && dis <= steps) {
            answer++; // directly count the ones in the 9 center periods
          }
          const edge_x = Math.abs(tx) === 1;
          const edge_y = Math.abs(ty) === 1;
          if (edge_x && edge_y) {
            answer += solve(dis, 2, steps);
          } else if (edge_x || edge_y) {
            answer += solve(dis, 1, steps);
          }
        }
      }
    }
  }
  console.log(answer);
});
