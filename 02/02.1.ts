import {readFileByLine} from "../util";

const max_allowed = new Map<string, number>([
  ['red', 12],
  ['green', 13],
  ['blue', 14],
]);

let sum = 0;

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  const line_split = line.split(':');
  const game_num = parseInt(line_split[0].trim().split(' ')[1].trim());
  let game_allowed = true;
  for (const data of line_split[1].split(';')) {
    for (const data_piece of data.split(',')) {
      const num = parseInt(data_piece.trim().split(' ')[0].trim());
      const color = data_piece.trim().split(' ')[1].trim();
      if (max_allowed.get(color) < num) {
        game_allowed = false;
      }
    }
  }
  if (game_allowed) {
    sum += game_num;
  }
}).then(() => {
  console.log(sum);
});
