import {P3D, readFileByLine} from "../util";

interface Hail {
  p: P3D;
  v: P3D;
}

const hail: Hail[] = [];

readFileByLine('input', async (line: string) => {
  const p_str = line.split('@')[0].split(',').map(v => parseInt(v.trim()));
  const v_str = line.split('@')[1].split(',').map(v => parseInt(v.trim()));
  hail.push({
    p: {x: p_str[0], y: p_str[1], z: p_str[2]},
    v: {x: v_str[0], y: v_str[1], z: v_str[2]},
  });
}).then(() => {
  console.log(hail);
  const test = [200000000000000, 400000000000000];
  const inTest = (x: number, y: number): boolean => {
    return x >= test[0] && x <= test[1] && y >= test[0] && y <= test[1];
  };
  let sum = 0;
  for (let i = 0; i < hail.length; i++) {
    for (let j = i + 1; j < hail.length; j++) {
      const h1 = hail[i];
      const h2 = hail[j];
      if (h1.p.x === h2.p.x && h1.p.y === h2.p.y) {
        if (inTest(h1.p.x, h1.p.y)) {
          sum++;
          continue;
        }
      }
      if (h1.v.x === h2.v.x && h1.v.y === h2.v.y) {
        continue;
      }
      // x1 = p1x + t1 * v1x
      // y1 = p1y + t1 * v1y
      // x2 = p2x + t2 * v2x
      // y2 = p2y + t2 * v2y
      // x1 = x2 = p1x + t1 * v1x = p2x + t2 * v2x
      // y1 = y2 = p1y + t1 * v1y = p2y + t2 * v2y
      // t1 = [(p2x - p1x) + t2 * v2x] / v1x
      // p1y + ([(p2x - p1x) + t2 * v2x] / v1x) * v1y = p2y + t2 * v2y
      // [v1y * (p2x - p1x) + t2 * v2x * v1y] / v1x - t2 * v2y = p2y - p1y
      // t2 * ((v2x * v1y) / v1x - v2y) = p2y - p1y - (v1y * (p2x - p1x)) / v1x
      // t2 = [p2y - p1y - (v1y * (p2x - p1x)) / v1x] / ((v2x * v1y) / v1x - v2y)
      const t2 = (h2.p.y - h1.p.y - (h1.v.y * (h2.p.x - h1.p.x)) / h1.v.x) / ((h2.v.x * h1.v.y) / h1.v.x - h2.v.y);
      const t1 = ((h2.p.x - h1.p.x) + t2 * h2.v.x) / h1.v.x;
      if (t2 < 0 || t1 < 0) {
        continue;
      }
      const x = h2.p.x + t2 * h2.v.x;
      const y = h2.p.y + t2 * h2.v.y;
      if (inTest(x, y)) {
        sum++;
      }
    }
  }
  console.log(sum);
});