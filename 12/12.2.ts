import {readFileByLine} from "../util";

enum State {
  UNKNOWN,
  BROKEN,
  WORKING,
}

interface RowData {
  chars: State[];
  groups: number[];
}

const rows: RowData[] = [];

const cached_results = new Map<string, number>();
function numArrangements(r: RowData): number {
  const cache_key = JSON.stringify(r);
  if (cached_results.has(cache_key)) {
    return cached_results.get(cache_key);
  }
  const result = evaluate(r);
  cached_results.set(cache_key, result);
  return result;
  function evaluate(r: RowData): number {
    // No data
    if (r.chars.length < 1 || r.groups.length < 1) {
      if (r.chars.length < 1 && r.groups.length < 1) {
        return 1;
      }
      if (r.groups.length > 0) {
        return 0;
      }
      return r.chars.some(c => c === State.BROKEN) ? 0 : 1;
    }
    // Not enough chars for the groups
    if (r.chars.length < r.groups.reduce((a, b) => a + b) + r.groups.length - 1) {
      return 0;
    }
    // Skip over working ones
    if (r.chars[0] === State.WORKING) {
      r.chars = r.chars.slice(1); 
      return numArrangements(r);
    }
    // evaludate broken ones
    if (r.chars[0] === State.BROKEN) {
      const nextGroup = r.groups[0];
      r.groups = r.groups.slice(1);
      for (let i = 0; i < nextGroup; i++) {
        if (r.chars[i] === State.WORKING) {
          return 0;
        }
      }
      if (r.chars[nextGroup] === State.BROKEN) {
        return 0;
      }
      r.chars = r.chars.slice(nextGroup + 1);
      return numArrangements(r);
    }
    // 2 possibilities for unknown ones
    return numArrangements({
      chars: [State.BROKEN, ...r.chars.slice(1)],
      groups: [...r.groups],
    }) + numArrangements({
      chars: [State.WORKING, ...r.chars.slice(1)],
      groups: [...r.groups],
    })
  }
}

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  rows.push({
    chars: line.trim().split(' ')[0].trim().split('').map(c => {
      switch(c) {
        case '?':
          return State.UNKNOWN;
        case '#':
          return State.BROKEN;
        case '.':
          return State.WORKING;
      }
    }),
    groups: line.trim().split(' ')[1].trim().split(',').map(n => parseInt(n)),
  });
}).then(() => {
  let sum = 0;
  for (const row of rows) {
    sum += numArrangements({
      chars: [...row.chars, State.UNKNOWN, ...row.chars, State.UNKNOWN, ...row.chars, State.UNKNOWN, ...row.chars, State.UNKNOWN, ...row.chars],
      groups: [...row.groups, ...row.groups, ...row.groups, ...row.groups, ...row.groups],
    });
  }
  console.log(sum);
});
