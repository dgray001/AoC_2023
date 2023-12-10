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
  const steps: string[] = [];
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
          steps.push(pipe);
          last_dir.x = pipe_dir.x;
          last_dir.y = pipe_dir.y;
          curr.x += adj.x;
          curr.y += adj.y;
          found = true;
          break;
        }
      }
      if (found) {
        break;
      }
    }
    if (curr.x === start.x && curr.y === start.y) {
      console.log(steps.length / 2);
      break;
    }
  }
});
