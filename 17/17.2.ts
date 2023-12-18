import {P2D, readFileByLine, PriorityQueue} from "../util";

const nodes: number[][] = [];

interface QueueData {
  loss: number;
  p: P2D;
  dir: number;
}

const queue = new PriorityQueue<QueueData>((a, b) => a.loss < b.loss);

let y = 0;
readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  nodes.push(line.split('').map(c => parseInt(c)));
  y++;
}).then(() => {
  const directions = [
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0},
    {x: 0, y: -1},
  ];
  function inMap(p: P2D): boolean {
    return p.x >=0 && p.x < nodes[0].length && p.y >= 0 && p.y < nodes.length;
  }
  queue.push({loss: 0, p: {x: 0, y: 0}, dir: -1});
  const seen = new Set<string>(); // must account for direction
  const losses = new Map<string, number>(); // must account for direction
  while (!queue.isEmpty()) {
    const q = queue.pop();
    if (q.p.x === nodes[0].length - 1 && q.p.y === nodes.length - 1) {
      console.log(q.loss);
      break;
    }
    const seen_key = JSON.stringify({p: q.p, d: q.dir});
    if (seen.has(seen_key)) {
      continue;
    }
    seen.add(seen_key);
    for (const [dirf, direction] of directions.entries()) {
      if (dirf === q.dir || (dirf + 2) % 4 === q.dir) {
        continue;
      }
      let loss_increase = 0;
      for (let distance = 1; distance <= 10; distance++) {
        const pf = {
          x: q.p.x + direction.x * distance,
          y: q.p.y + direction.y * distance,
        };
        if (!inMap(pf)) {
          continue;
        }
        loss_increase += nodes[pf.y][pf.x];
        if (distance < 4) {
          continue;
        }
        const new_loss = q.loss + loss_increase;
        const loss_key = JSON.stringify({p: pf, d: dirf});
        if ((losses.get(loss_key) ?? Infinity) <= new_loss) {
          continue;
        }
        losses.set(loss_key, new_loss);
        queue.push({loss: new_loss, p: pf, dir: dirf});
      }
    }
  }
});
