import {readFileByLine} from "../util";

let sum = 0;

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  const values: number[][] = [];
  values.push(line.trim().split(' ').map(v => parseInt(v.trim())));
  while (true) {
    const new_values = [];
    let all_zeroes = true;
    const last_values = values[values.length - 1];
    for (let i = 1; i < last_values.length; i++) {
      const v = last_values[i] - last_values[i-1];
      new_values.push(v);
      if (all_zeroes && v !== 0) {
        all_zeroes = false;
      }
    }
    values.push(new_values);
    if (all_zeroes) {
      break;
    }
  }
  const next_value = values.reduce((a: number[], b: number[]) => [a[a.length - 1] + b[b.length - 1]]);
  sum += next_value[0];
}).then(() => {
  console.log(sum);
});
