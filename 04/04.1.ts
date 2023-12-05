import {readFileByLine} from "../util";

let sum = 0;

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  const [xp, yp] = line.split(':')[1].split('|');
  const xs = [];
  const ys = [];
  for (const x of xp.split(' ')) {
    if (!x.trim()) {
      continue;
    }
    xs.push(parseInt(x.trim()));
  }
  for (const y of yp.split(' ')) {
    if (!y.trim()) {
      continue;
    }
    ys.push(parseInt(y.trim()));
  }
  let winners = 0;
  for (const x of xs) {
    if (ys.includes(x)) {
      winners++;
    }
  }
  if (!!winners) {
    sum += Math.pow(2, winners-1);
  }
}).then(() => {
  console.log(sum);
});
