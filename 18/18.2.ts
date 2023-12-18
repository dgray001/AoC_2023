import {P2D, readFileByLine} from "../util";

const directions = [
  {x: 1, y: 0},
  {x: 0, y: 1},
  {x: -1, y: 0},
  {x: 0, y: -1},
];

interface DigData {
  dir: number;
  dis: number;
}

const instructions: DigData[] = [];

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  const foo = line.trim().split(' ');
  const hex = foo[2].trim().slice(2, 8);
  const dis = parseInt(hex.slice(0, 5), 16);
  let dir = -1;
  switch(hex.charAt(5)) {
    case '3':
      dir = 3;
      break;
    case '1':
      dir = 1;
      break;
    case '2':
      dir = 2;
      break;
    case '0':
      dir = 0;
      break;
    default:
      console.error('error');
      break;
  }
  instructions.push({
    dir,
    dis,
  });
}).then(() => {
  console.log(instructions);
  const vertices: P2D[] = [];
  let curr: P2D = {x: 0, y: 0};
  vertices.push({...curr});
  let boundary_points = 0;
  for (const ins of instructions) {
    boundary_points += ins.dis;
    curr = {
      x: curr.x + directions[ins.dir].x * ins.dis,
      y: curr.y + directions[ins.dir].y * ins.dis,
    };
    vertices.push({...curr});
  }
  let twice_area = 0;
  for (let i = 0; i < vertices.length; i++) {
    const v1 = vertices[i];
    const v2 = (i + 1) === vertices.length ? vertices[0] : vertices[i + 1];
    twice_area += v1.x * v2.y - v1.y * v2.x;
  }
  const interior_area = 0.5 * twice_area + 1 - 0.5 * boundary_points;
  console.log(interior_area + boundary_points);
});
