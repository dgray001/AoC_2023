import {readFileByLine} from "../util";

let strs: string[] = [];

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  strs = line.split(',').map(s => s.trim());
}).then(() => {
  let sum = 0;
  for (const str of strs) {
    let hash = 0;
    for (const c of str) {
      hash = (hash + c.charCodeAt(0)) % 256;
      hash = (hash * 17) % 256;
    }
    sum += hash;
  }
  console.log(sum);
});
