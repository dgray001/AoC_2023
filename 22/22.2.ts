import {P3D, readFileByLine} from "../util";

const bricks: BrickData[] = [];

interface BrickData {
  pi: P3D;
  pf: P3D;
  k: number; // key
  supports: number[]; // which bricks this one supports
}

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  const spl = line.trim().split('~');
  const pi_spl = spl[0].trim().split(',').map(v => parseInt(v.trim()));
  const pi: P3D = {
    x: pi_spl[0],
    y: pi_spl[1],
    z: pi_spl[2],
  };
  const pf_spl = spl[1].trim().split(',').map(v => parseInt(v.trim()));
  const pf: P3D = {
    x: pf_spl[0],
    y: pf_spl[1],
    z: pf_spl[2],
  };
  bricks.push({pi, pf, k: -1, supports: []});
}).then(() => {
  bricks.sort((a, b) => Math.min(a.pi.z, a.pf.z) - Math.min(b.pi.z, b.pf.z));
  const supports = new Map<number, number[]>(); // which bricks support the key
  for (const [k, b] of bricks.entries()) {
    b.k = k;
    supports.set(k, []);
    let set_z = false;
    for (let i = k-1; i >= 0; i--) {
      const b2 = bricks[i];
      if (b.pi.x > b2.pf.x || b2.pi.x > b.pf.x) {
        continue;
      }
      if (b.pi.y > b2.pf.y || b2.pi.y > b.pf.y) {
        continue;
      }
      if (set_z) {
        if (b.pi.z <= b2.pf.z + 1) {
          if (b.pi.z < b2.pf.z + 1) {
            const zi = b2.pf.z + 1;
            b.pf.z = b.pf.z - b.pi.z + zi;
            b.pi.z = zi;
            b2.supports.push(k);
            for (const sk of supports.get(k)) {
              bricks[sk].supports = bricks[sk].supports.filter(sks => sks !== k);
            }
            supports.set(k, [b2.k]);
          } else {
            b2.supports.push(k);
            supports.get(k).push(b2.k);
          }
        }
      } else {
        set_z = true;
        const zi = b2.pf.z + 1;
        b.pf.z = b.pf.z - b.pi.z + zi;
        b.pi.z = zi;
        b2.supports.push(k);
        supports.get(k).push(b2.k);
      }
    }
    if (!set_z) {
      b.pf.z = b.pf.z - b.pi.z + 1;
      b.pi.z = 1;
    }
  }
  const numFalling = (k: number, fallen = new Set<number>()) => {
    const q = [];
    fallen.add(k);
    for (const s of bricks[k].supports) {
      if (supports.get(s).filter(s => !fallen.has(s)).length < 1) {
        fallen.add(s);
        q.push(s);
      }
    }
    for (const s of q) {
      fallen = numFalling(s, fallen);
    }
    return fallen;
  }
  let sum = 0;
  for (const b of bricks) {
    const fallen = numFalling(b.k);
    sum += fallen.size - 1;
  }
  console.log(sum);
});
