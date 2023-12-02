import {readFileByLine} from "../util";

let sum = 0;

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  const line_split = line.split(':');
  const fewest_allowed = new Map<string, number>([
    ['red', 0],
    ['green', 0],
    ['blue', 0],
  ]);
  for (const data of line_split[1].split(';')) {
    for (const data_piece of data.split(',')) {
      const num = parseInt(data_piece.trim().split(' ')[0].trim());
      const color = data_piece.trim().split(' ')[1].trim();
      fewest_allowed.set(color, Math.max(fewest_allowed.get(color), num));
    }
  }
  sum += [...fewest_allowed.values()].reduce((a, b) => a * b, 1);
}).then(() => {
  console.log(sum);
});