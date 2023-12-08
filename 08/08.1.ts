import {readFileByLine} from "../util";

let instructions: boolean[] = [];

interface NodeData {
  k: string;
  l: string;
  r: string;
}

const nodes = new Map<string, NodeData>();

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  if (instructions.length < 1) {
    instructions = line.trim().split('').map(c => c === 'L');
    return;
  }
  const ls = line.split('=');
  const children = ls[1].replace('(', '').replace(')', '').trim().split(',');
  const node: NodeData = {
    k: ls[0].trim(),
    l: children[0].trim(),
    r: children[1].trim(),
  };
  nodes.set(node.k, node);
}).then(() => {
  let moves = 0;
  let curr = 'AAA';
  while (true) {
    if (instructions[moves % instructions.length]) {
      curr = nodes.get(curr).l;
    } else {
      curr = nodes.get(curr).r;
    }
    moves++;
    if (curr === 'ZZZ') {
      break;
    }
  }
  console.log(moves);
});
