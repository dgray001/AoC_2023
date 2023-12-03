import {createReadStream} from 'fs';
import {createInterface} from 'readline';
import {dirname} from 'path';

/** Read file line by line */
export async function readFileByLine(filename: string, callback: (line: string) => Promise<void>) {
  const fileStream = createReadStream(`${dirname(module.parent.filename)}/${filename}`, 'utf-8');
  
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  
  for await (const line of rl) {
    await callback(line);
  }
}

export function isNumeric(s: string): boolean {
  return /^\d+$/.test(s);
}
