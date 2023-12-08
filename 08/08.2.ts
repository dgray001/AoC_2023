import {readFileByLine} from "../util";

let instructions: boolean[] = [];

interface NodeData {
  k: string;
  l: string;
  r: string;
}

interface ResultData {
  k: string;
  moves: number;
}

const nodes = new Map<string, NodeData>();

// copied from SO
const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);

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
  let currs: ResultData[] = [...nodes.keys()].filter(k => k.endsWith('A')).map(k => {
    return {k, moves: 0};
  });
  for (const c of currs.values()) {
    while (true) {
      if (instructions[c.moves % instructions.length]) {
        c.k = nodes.get(c.k).l;
      } else {
        c.k = nodes.get(c.k).r;
      }
      c.moves++;
      if (c.k.endsWith('Z')) {
        break;
      }
    }
  }
  console.log(currs);
  console.log(currs.map(c => c.moves).reduce(lcm));
});
