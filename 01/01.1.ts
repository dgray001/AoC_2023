import {readFileByLine, isNumeric} from "../util";

let sum = 0;

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  let first_digit = '';
  let last_digit = '';
  for (const char of line) {
    if (!isNumeric(char)) {
      continue;
    }
    if (!first_digit) {
      first_digit = char;
    } else {
      last_digit = char;
    }
  }
  if (!last_digit) {
    last_digit = first_digit;
  }
  if (!first_digit || !last_digit) {
    return;
  }
  sum += parseInt(first_digit + last_digit);
}).then(() => {
  console.log(sum);
});
