import {readFileByLine} from "../util";

let sum = 0;

interface HandData {
  cards: number[];
  bid: number;
  hand_strength: number;
}

const hands: HandData[] = [];

const conversion = new Map([
  ['2', 2],
  ['3', 3],
  ['4', 4],
  ['5', 5],
  ['6', 6],
  ['7', 7],
  ['8', 8],
  ['9', 9],
  ['T', 10],
  ['J', 1],
  ['Q', 12],
  ['K', 13],
  ['A', 14],
]);

function cardsToHandStrength(cards: number[]): number {
  const m = new Map<number, number>();
  let jokers = 0;
  for (const c of cards) {
    if (c === 1) {
      jokers++;
      continue;
    }
    if (m.has(c)) {
      m.set(c, m.get(c) + 1);
    } else {
      m.set(c, 1);
    }
  }
  let max_value = 0;
  let max: number[] = [];
  for (const [i, j] of m.entries()) {
    if (j > max_value) {
      max = [i];
      max_value = j;
    } else if (j === max_value) {
      max.push(i);
    }
  }
  if (max.length > 0) {
    m.set(Math.max(...max), m.get(Math.max(...max)) + jokers);
  } else if (jokers > 0) {
    m.set(14, jokers);
  }
  switch(m.size) {
    case 1:
      return 7; // 5 of a kind
    case 2:
      if ([...m.values()].some(v => v === 4)) {
        return 6; // 4 of a kind
      }
      return 5; // full house
    case 3:
      if ([...m.values()].some(v => v === 3)) {
        return 4; // 3 of a kind
      }
      return 3; // 2 pair
    case 4:
      return 2; // 1 pair
    case 5:
      return 1; // nuthin
    default:
      console.error('err');
      return 0;
  }
}

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  const cards = line.split(' ')[0].trim().split('').map(c => conversion.get(c));
  hands.push({
    cards: cards,
    bid: parseInt(line.split(' ')[1].trim()),
    hand_strength: cardsToHandStrength(cards),
  });
}).then(() => {
  hands.sort((a, b) => {
    if (a.hand_strength !== b.hand_strength) {
      return a.hand_strength - b.hand_strength;
    }
    for (const [i, c] of a.cards.entries()) {
      if (c !== b.cards[i]) {
        return c - b.cards[i];
      }
    }
    return 0;
  });
  for (const [i, h] of hands.entries()) {
    sum += (i + 1) * h.bid;
  }
  console.log(sum);
});
