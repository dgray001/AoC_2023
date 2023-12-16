import {readFileByLine} from "../util";

const tiles: string[][] = [];

interface P2D {
  x: number;
  y: number;
}

function calculateBeam(energized: Map<string, P2D>, beams: Set<string>, pi: P2D, vi: P2D) {
  const beam = JSON.stringify({pi, vi});
  if (beams.has(beam)) {
    return;
  }
  beams.add(beam);
  const pf = {x: pi.x + vi.x, y: pi.y + vi.y};
  if (pf.x < 0 || pf.y < 0 || pf.y >= tiles.length || pf.x >= tiles[0].length) {
    return;
  }
  energized.set(JSON.stringify(pf), pf);
  const tile = tiles[pf.y][pf.x];
  switch(tile) {
    case '\\':
      calculateBeam(energized, beams, pf, {x: vi.y, y: vi.x});
      break;
    case '/':
      calculateBeam(energized, beams, pf, {x: -vi.y, y: -vi.x});
      break;
    case '-':
      if (vi.x === 0) {
        calculateBeam(energized, beams, pf, {x: -1, y: 0});
        calculateBeam(energized, beams, pf, {x: 1, y: 0});
      } else {
        calculateBeam(energized, beams, pf, vi);
      }
      break;
    case '|':
      if (vi.y === 0) {
        calculateBeam(energized, beams, pf, {x: 0, y: -1});
        calculateBeam(energized, beams, pf, {x: 0, y: 1});
      } else {
        calculateBeam(energized, beams, pf, vi);
      }
      break;
    default:
      calculateBeam(energized, beams, pf, vi);
      break;
  }
}

function drawEnergized(energized: Map<string, P2D>) {
  const energized_tiles: string[][] = [];
  for (const row of tiles) {
    energized_tiles.push(row.map(() => '.'));
  }
  for (const p of energized.values()) {
    energized_tiles[p.y][p.x] = '#';
  }
  for (const row of energized_tiles) {
    console.log(row.join(''));
  }
}

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  tiles.push(line.trim().split(''));
}).then(() => {
  let max_energized = 0;
  let max_energized_tiles = new Map<string, P2D>();
  for (let i = 0; i < tiles.length; i++) {
    const energized = new Map<string, P2D>();
    const beams = new Set<string>();
    calculateBeam(energized, beams, {x: -1, y: i}, {x: 1, y: 0});
    if (energized.size > max_energized) {
      max_energized = energized.size;
      max_energized_tiles = energized;
    }
    const energized2 = new Map<string, P2D>();
    const beams2 = new Set<string>();
    calculateBeam(energized2, beams2, {x: tiles[0].length, y: 0}, {x: -1, y: 0});
    if (energized2.size > max_energized) {
      max_energized = energized2.size;
      max_energized_tiles = energized;
    }
  }
  for (let i = 0; i < tiles[0].length; i++) {
    const energized = new Map<string, P2D>();
    const beams = new Set<string>();
    calculateBeam(energized, beams, {x: i, y: -1}, {x: 0, y: 1});
    if (energized.size > max_energized) {
      max_energized = energized.size;
      max_energized_tiles = energized;
    }
    const energized2 = new Map<string, P2D>();
    const beams2 = new Set<string>();
    calculateBeam(energized2, beams2, {x: tiles.length, y: 0}, {x: 0, y: -1});
    if (energized2.size > max_energized) {
      max_energized = energized2.size;
      max_energized_tiles = energized;
    }
  }
  drawEnergized(max_energized_tiles);
  console.log(max_energized);
});
