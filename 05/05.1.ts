import {readFileByLine} from "../util";

let seeds: number[] = [];

interface MapData {
  destination: string;
  data: RangeData[];
}

interface RangeData {
  destination: number;
  source: number;
  length: number;
}

const maps = new Map<string, MapData>();

let curr_map = '';

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  if (line.startsWith('seeds: ')) {
    seeds = line.replace('seeds: ', '').split(' ').filter(s => !!s).map(s => parseInt(s.trim()));
    return;
  }
  if (line.includes(' map:')) {
    if (curr_map) {
      maps.get(curr_map).data.sort((a: RangeData, b: RangeData) => a.source - b.source);
      console.log(maps.get(curr_map));
    }
    const line_split = line.replace(' map:', '').split('-');
    curr_map = line_split[0].trim();
    maps.set(curr_map, {
      destination: line_split[2].trim(),
      data: [],
    });
    return;
  }
  if (!curr_map || !maps.has(curr_map)) {
    return;
  }
  const line_split = line.split(' ');
  maps.get(curr_map).data.push({
    destination: parseInt(line_split[0].trim()),
    source: parseInt(line_split[1].trim()),
    length: parseInt(line_split[2].trim()),
  });
}).then(() => {
  maps.get(curr_map).data.sort((a: RangeData, b: RangeData) => a.source - b.source);
  console.log(maps.get(curr_map));
  let lowest = undefined;
  for (let seed of seeds) {
    curr_map = 'seed';
    //console.log();
    //console.log(curr_map, seed);
    while(curr_map !== 'location') {
      const map = maps.get(curr_map);
      for (const data of map.data) {
        if (seed < data.source) {
          break;
        }
        if (seed < data.source + data.length) {
          seed += data.destination - data.source;
          break;
        }
      }
      curr_map = map.destination;
          //console.log(curr_map, seed);
    }
    if (lowest === undefined || seed < lowest) {
      lowest = seed;
    }
  }
  console.log(lowest);
});
