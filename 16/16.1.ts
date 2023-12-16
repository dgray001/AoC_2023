import {readFileByLine} from "../util";

const tiles: string[][] = [];

const energized = new Map<string, P2D>();

const beams = new Set<string>();

interface P2D {
  x: number;
  y: number;
}

function calculateBeam(pi: P2D, vi: P2D) {
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
      calculateBeam(pf, {x: vi.y, y: vi.x});
      break;
    case '/':
      calculateBeam(pf, {x: -vi.y, y: -vi.x});
      break;
    case '-':
      if (vi.x === 0) {
        calculateBeam(pf, {x: -1, y: 0});
        calculateBeam(pf, {x: 1, y: 0});
      } else {
        calculateBeam(pf, vi);
      }
      break;
    case '|':
      if (vi.y === 0) {
        calculateBeam(pf, {x: 0, y: -1});
        calculateBeam(pf, {x: 0, y: 1});
      } else {
        calculateBeam(pf, vi);
      }
      break;
    default:
      calculateBeam(pf, vi);
      break;
  }
}

function drawEnergized() {
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
  calculateBeam({x: -1, y: 0}, {x: 1, y: 0});
  drawEnergized();
  console.log(energized.size);
});
