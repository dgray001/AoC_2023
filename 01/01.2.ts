import {readFileByLine} from "../util";

function isNumeric(s: string): boolean {
  return /^\d+$/.test(s);
}

const num_names = new Map<string, string>([
  ['one', '1'],
  ['two', '2'],
  ['three', '3'],
  ['four', '4'],
  ['five', '5'],
  ['six', '6'],
  ['seven', '7'],
  ['eight', '8'],
  ['nine', '9'],
]);

let sum = 0;

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  let first_digit = '';
  let last_digit = '';
  for (let i = 0; i < line.length; i++) {
    let char = '';
    for (const [num_name, num_char] of num_names.entries()) {
      if (line.substring(i).startsWith(num_name)) {
        char = num_char;
        break;
      }
    }
    if (!char) {
      char = line[i];
    }
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
    console.error('error');
    return;
  }
  console.log(first_digit, last_digit);
  sum += parseInt(first_digit + last_digit);
}).then(() => {
  console.log(sum);
});