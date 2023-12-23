import {P2D, readFileByLine} from "../util";

const map: string[][] = [];

let s: P2D|undefined = undefined;
let e: P2D|undefined = undefined;

readFileByLine('input', async (line: string) => {
  map.push(line.trim().split(''));
  if (!s) {
    s = {x: line.indexOf('.'), y: 0};
  }
}).then(() => {
  e = {
    x: map[map.length - 1].indexOf('.'),
    y: map.length - 1,
  };
  function allowed(ch: string, i: number): boolean {
    if (ch === '.') {
      return true;
    } else if (ch === '#') {
      return false;
    }
    switch(i) {
      case 0:
        return ch === '>';
      case 1:
        return ch === '<';
      case 2:
        return ch === 'v';
      case 3:
        return ch === '^';
      default:
        console.error('error');
        return false;
    }
  }
  interface Data {
    c: P2D;
    k: string;
    d: number;
    visited: Set<string>;
  }
  const q: Data[] = [{c: s, k: JSON.stringify(s), d: 0, visited: new Set<string>()}];
  let max_path = 0;
  while(q.length > 0) {
    const n = q.shift();
    if (n.c.x === e.x && n.c.y === e.y) {
      max_path = Math.max(max_path, n.d);
    }
    if (n.visited.has(n.k)) {
      continue;
    }
    n.visited.add(n.k);
    for (const [i, adj] of [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}].entries()) {
      const a = {x: n.c.x + adj.x, y: n.c.y + adj.y};
      if (a.x < 0 || a.x >= map[0].length || a.y < 0 || a.y >= map.length) {
        continue;
      }
      const k = JSON.stringify(a);
      const ch = map[a.y][a.x];
      if (n.visited.has(k) || !allowed(ch, i)) {
        continue;
      }
      const data = {
        c: a,
        k,
        d: n.d + 1,
        visited: new Set<string>([...n.visited.values()]),
      };
      q.push(data);
    }
  }
  console.log(max_path);
});
