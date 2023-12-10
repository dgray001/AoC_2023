import {readFileByLine} from "../util";

const pipes: string[][] = [];

interface P2D {
  x: number;
  y: number;
}

const start: P2D = {x: 0, y: 0};
const curr: P2D = {x: 0, y: 0};

function pipeDirs(pipe: string): P2D[] {
  switch(pipe) {
    case '|':
      return [{x: 0, y: 1}, {x: 0, y: -1}];
    case '-':
      return [{x: 1, y: 0}, {x: -1, y: 0}];
    case 'L':
      return [{x: 1, y: 0}, {x: 0, y: -1}];
    case 'J':
      return [{x: -1, y: 0}, {x: 0, y: -1}];
    case '7':
      return [{x: -1, y: 0}, {x: 0, y: 1}];
    case 'F':
      return [{x: 1, y: 0}, {x: 0, y: 1}];
    case 'S':
      return [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}];
    default:
      return [];
  }
}

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  pipes.push(line.split(''));
  if (line.includes('S')) {
    start.x = line.indexOf('S');
    start.y = curr.y;
  }
  curr.y++;
}).then(() => {
  const steps = new Set<string>();
  const last_dir: P2D = {x: 0, y: 0};
  curr.x = start.x;
  curr.y = start.y;
  while (true) {
    let found = false;
    for (const adj of pipeDirs(pipes[curr.y][curr.x])) {
      if (last_dir.x === adj.x && last_dir.y === adj.y) {
        continue;
      }
      if (curr.y + adj.y < 0 || curr.y + adj.y > pipes.length || curr.x + adj.x < 0 || curr.x + adj.x > pipes[0].length) {
        continue;
      }
      const pipe = pipes[curr.y + adj.y][curr.x + adj.x];
      for (const pipe_dir of pipeDirs(pipe)) {
        if (pipe_dir.x === -adj.x && pipe_dir.y === -adj.y) {
          last_dir.x = pipe_dir.x;
          last_dir.y = pipe_dir.y;
          curr.x += adj.x;
          curr.y += adj.y;
          steps.add(`${curr.x},${curr.y}`);
          found = true;
          break;
        }
      }
      if (found) {
        break;
      }
    }
    if (curr.x === start.x && curr.y === start.y) {
      break;
    }
  }
  let area = 0;
  const y_crossings = new Map<number, number>();
  const ignore_next_crossing_y = new Map<number, boolean>();
  const ignore_next_crossing_pipe_y = new Map<number, string>();
  for (const [y, row] of pipes.entries()) {
    let crossings = 0;
    let ignore_next_crossing_x = false;
    let ignore_next_crossing_pipe_x = '';
    for (const [x, _] of row.entries()) {
      if (steps.has(`${x},${y}`)) {
        const pipe = pipes[y][x];
        if (!ignore_next_crossing_x || (ignore_next_crossing_pipe_x === 'L' && pipe === 'J') || (ignore_next_crossing_pipe_x === 'F' && pipe === '7')) {
          crossings++;
        }
        if (!ignore_next_crossing_y.get(x) || (ignore_next_crossing_pipe_y.get(x) === '7' && pipe === 'J') || (ignore_next_crossing_pipe_y.get(x) === 'F' && pipe === 'L')) {
          y_crossings.set(x, (y_crossings.get(x) ?? 0) + 1);
        }
        if (['-', 'L', 'F'].includes(pipe)) {
          ignore_next_crossing_x = true;
          if (pipe !== '-') {
            ignore_next_crossing_pipe_x = pipe;
          }
        } else {
          ignore_next_crossing_x = false;
          ignore_next_crossing_pipe_x = '';
        }
        if (['|', '7', 'F'].includes(pipe)) {
          ignore_next_crossing_y.set(x, true);
          if (pipe !== '|') {
            ignore_next_crossing_pipe_y.set(x, pipe);
          }
        } else {
          ignore_next_crossing_y.set(x, false);
          ignore_next_crossing_pipe_y.set(x, '');
        }
      } else if (crossings % 2 === 1 && y_crossings.get(x) % 2 === 1) {
        area++;
      } else {
      }
    }
  }
  console.log(area);
});
