import {readFileByLine} from "../util";

interface LensData {
  label: string;
  strength: number;
}

interface BoxData {
  lens: LensData[];
}

let strs: string[] = [];
const boxes = new Map<number, BoxData>();

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  strs = line.split(',').map(s => s.trim());
}).then(() => {
  for (const str of strs) {
    const label = str.split('=')[0].split('-')[0];
    const equals = str.includes('=');
    const focal_strength = parseInt(equals ? str.split('=')[1] : str.split('-')[1]);
    let hash = 0;
    for (const c of label) {
      hash = (hash + c.charCodeAt(0)) % 256;
      hash = (hash * 17) % 256;
    }
    if (equals) {
      const box_data = boxes.get(hash);
      if (!!box_data) {
        let found = false;
        for (const lens of box_data.lens) {
          if (lens.label === label) {
            lens.strength = focal_strength;
            found = true;
            break;
          }
        }
        if (!found) {
          box_data.lens.push({label, strength: focal_strength});
        }
      } else {
        boxes.set(hash, {lens: [{label: label, strength: focal_strength}]});
      }
    } else {
      const box_data = boxes.get(hash);
      if (!!box_data) {
        for (const [i, lens] of box_data.lens.entries()) {
          if (lens.label === label) {
            box_data.lens.splice(i, 1);
            break;
          }
        }
      }
    }
  }
  let sum = 0;
  for (const [i, box] of boxes.entries()) {
    for (const [j, lens] of box.lens.entries()) {
      const focusing_power = (i + 1) * (j + 1) * lens.strength;
      sum += focusing_power;
    }
  }
  console.log(sum);
});
