import {P2D, readFileByLine} from "../util";

const map: string[][] = [];

const start: P2D = {x: -1, y: -1};

let j = 0;
let num = 0;

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
  for (let x = 0; x < line.length; x++) {
    if (line.charAt(x) !== '#') {
      num++;
    }
  }
  j++;
}).then(() => {
  console.log(num);
  const seen = new Set<string>();
  seen.add(JSON.stringify(start));
  let visited = 0;
  let q: P2D[] = [start];
  const steps = 500;
  let founds = [false, false, false, false];
  let found_step1 = [0, 0, 0, 0];
  let found_step2 = [0, 0, 0, 0];
  let found_ps: P2D[] = [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}];
  for (let step = 0; step <= steps; step++) {
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
        } // ((n % d) + d) % d
        n.x = (n.x % map[0].length + map[0].length) % map[0].length;
        n.y = (n.y % map.length + map.length) % map.length;
        seen.add(k);
        if (map[n.y][n.x] === '#') {
          continue;
        }
        let ind = -1;
        if (orig_n.x < 0 && n.x === map[0].length - 1) {
          ind = 0;
          if (found_step1[ind] && orig_n.x !== - 1 - map[0].length) {
            ind = -1;
          }
        } else if (orig_n.x >= map[0].length && n.x === 0) {
          ind = 1;
          if (found_step1[ind] && orig_n.x !== 2 * map[0].length) {
            ind = -1;
          }
        } else if (orig_n.y < 0 && n.y === map.length - 1) {
          ind = 2;
          if (found_step1[ind] && orig_n.y !== - 1 - map.length) {
            ind = -1;
          }
        } else if (orig_n.y >= map.length && n.y === 0) {
          ind = 3;
          if (found_step1[ind] && orig_n.y !== 2 * map.length) {
            ind = -1;
          }
        }
        if (ind > -1 && !found_step1[ind]) {
          found_step1[ind] = step + 1;
        } else if (ind > -1 && !founds[ind]) {
          founds[ind] = true;
          found_step2[ind] = step+1;
          found_ps[ind] = {x: n.x, y: n.y};
          if (!founds.some(v => !v)) {
            for (const [j, ff] of found_step1.entries()) {
              found_step2[j] -= ff;
            }
            console.log(found_step1, found_step2);
            let wi_i = (2 * steps / (found_step2[0] + found_step2[1]));
            let he_i = (2 * steps / (found_step2[2] + found_step2[3]));
            let wi = Math.floor(2 * steps / (found_step2[0] + found_step2[1]));
            let he = Math.floor(2 * steps / (found_step2[2] + found_step2[3]));
            let wi_s = (2 * steps) % (found_step2[0] + found_step2[1]);
            let he_s = (2 * steps) % (found_step2[2] + found_step2[3]);
            let visited = 0.5 * wi * he * num;
            for (const [j, ps] of found_ps.entries()) {
              q = [ps];
              let seeny = new Set<string>();
              let curr_added = 0;
              for (let step = 0; step <= (j > 1 ? he_s : wi_s); step++) {
                const next_q: P2D[] = [];
                const add = step % 2 === 0;
                for (const p of q) {
                  if (add) {
                    curr_added++;
                  }
                  for (const move of [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}]) {
                    const n = {x: p.x + move.x, y: p.y + move.y};
                    if (n.x < 0 || n.y < 0 || n.x >= map[0].length || n.y >= map.length) {
                      continue;
                    }
                    const k = JSON.stringify(n);
                    if (seeny.has(k)) {
                      continue;
                    }
                    seeny.add(k);
                    if (map[n.y][n.x] === '#') {
                      continue;
                    }
                    next_q.push(n);
                  }
                }
              }
              visited += curr_added * (j > 1 ? wi : he);
            }
            console.log(visited); // within 0.001% but still too low ...
          }
        }
        next_q.push(orig_n);
      }
    }
    q = next_q;
  }
  console.log(visited);
});
