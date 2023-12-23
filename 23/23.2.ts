import {P2D, Queue, readFileByLine} from "../util";

interface MapData {
  k: string;
  adj: Map<string, number>;
}

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
  const e_k = JSON.stringify(e);
  const m = new Map<string, MapData>();
  // find valid adjacents for each square
  for (const [j, row] of map.entries()) {
    for (const [i, ch] of row.entries()) {
      if (ch === '#') {
        continue;
      }
      const k = JSON.stringify({x: i, y: j});
      m.set(k, {k, adj: new Map<string, number>()});
      for (const dadj of [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}]) {
        const adj = {x: i + dadj.x, y: j + dadj.y};
        if (adj.x < 0 || adj.x >= map[0].length || adj.y < 0 || adj.y >= map.length) {
          continue;
        }
        const adj_ch = map[adj.y][adj.x];
        if (adj_ch === '#') {
          continue;
        }
        const adj_k = JSON.stringify(adj);
        m.get(k).adj.set(adj_k, 1);
      }
    }
  }
  // calculate distances for each node
  const ks = [...m.keys()];
  for (const k of ks) {
    const md = m.get(k);
    if (md.adj.size > 2) { // is a node
      continue;
    }
    if (md.adj.size < 2) { // deadend
      continue;
    }
    const ks = [...md.adj.keys()]; // exactly 2
    const total_d = md.adj.get(ks[0]) + md.adj.get(ks[1]);
    m.get(ks[0]).adj.set(ks[1], total_d);
    m.get(ks[0]).adj.delete(k);
    m.get(ks[1]).adj.set(ks[0], total_d);
    m.get(ks[1]).adj.delete(k);
    m.delete(k);
  }
  // essentially same path-finding as part 1
  interface Data {
    k: string;
    d: number;
    visited: Set<string>;
  }
  const q = new Queue<Data>();
  q.Enqueue({k: JSON.stringify(s), d: 0, visited: new Set<string>()});
  let max_path = 0;
  while(q.size > 0) {
    const n = q.Dequeue();
    if (n.k === e_k) {
      max_path = Math.max(max_path, n.d);
      continue;
    }
    if (n.visited.has(n.k)) {
      continue;
    }
    n.visited.add(n.k);
    for (const [adj_k, adj_d] of m.get(n.k).adj.entries()) {
      if (n.visited.has(adj_k)) {
        continue;
      }
      const data = {
        k: adj_k,
        d: n.d + adj_d,
        visited: new Set<string>(n.visited),
      };
      q.Enqueue(data);
    }
  }
  console.log(max_path);
});
