import {readFileByLine} from "../util";

const cards = new Map<number, number>();
let last_num = 0;

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  let card_number = parseInt(line.split(':')[0].trim().split('Card')[1].trim());
  last_num = card_number;
  cards.set(card_number, 1 + (cards.get(card_number) ?? 0));
  const num_cards = cards.get(card_number);
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
  while (winners > 0) {
    card_number++;
    cards.set(card_number, num_cards + (cards.get(card_number) ?? 0));
    winners--;
  }
}).then(() => {
  last_num++;
  while(cards.has(last_num)) {
    cards.delete(last_num);
    last_num++;
  }
  let sum = 0;
  for (const card of cards.entries()) {
    console.log(card[0], card[1]);
    sum += card[1];
  }
  console.log(sum);
  console.log([...cards.values()].reduce((a, b) => a + b));
});
