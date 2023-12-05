import {readFileByLine} from "../util";

interface SeedData {
  start: number;
  range: number;
}

let seed_pairs: number[] = [];
let seed_data: SeedData[] = [];

interface MapData {
  destination: string;
  data: RangeData[];
}

interface RangeData {
  destination: number;
  source: number;
  length: number;
}

let curr_map: MapData|undefined;
let final_map: MapData|undefined;

function reduceMaps(m1: MapData, m2: MapData): MapData {
  if (!m1) {
    return m2;
  }
  const m12: MapData = {
    destination: m2.destination,
    data: [],
  };
  if (m1.data[0].source > 0) {
    m1.data = [{
      source: 0,
      destination: 0,
      length: m1.data[0].source,
    }, ...m1.data];
  }
  for (let m1d of m1.data) {
    let finished = false;
    for (const m2d of m2.data) {
      if (m1d.destination + m1d.length <= m2d.source) {
        m12.data.push({
          source: m1d.source,
          destination: m1d.destination,
          length: m1d.length,
        });
        finished = true;
        break;
      }
      if (m1d.destination >= m2d.source + m2d.length) {
        continue;
      }
      if (m1d.destination < m2d.source) {
        const l = m2d.source - m1d.destination;
        m12.data.push({
          source: m1d.source,
          destination: m1d.destination,
          length: l,
        });
        m1d.length -= l;
        m1d.source += l;
        m1d.destination += l;
      }
      if (m1d.length < 0) {
        console.error('?');
      } else if (m1d.length === 0) {
        finished = true;
        break;
      }
      const l = Math.min(m1d.destination + m1d.length, m2d.source + m2d.length) - m1d.destination;
      m12.data.push({
        source: m1d.source,
        destination: m2d.destination + (m1d.destination - m2d.source),
        length: l,
      });
      m1d.length -= l;
      m1d.source += l;
      m1d.destination += l;
      if (m1d.length < 0) {
        console.error('?');
      } else if (m1d.length === 0) {
        finished = true;
        break;
      }
    }
    if (!finished) {
      m12.data.push({
        source: m1d.source,
        destination: m1d.destination,
        length: m1d.length,
      });
    }
  }
  return m12;
}

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  if (line.startsWith('seeds: ')) {
    seed_pairs = line.replace('seeds: ', '').split(' ').filter(s => !!s).map(s => parseInt(s.trim()));
    for (let i = 0; i < seed_pairs.length; i += 2) {
      seed_data.push({start: seed_pairs[i], range: seed_pairs[i+1]});
    }
    return;
  }
  if (line.includes(' map:')) {
    if (!!curr_map) {
      curr_map.data.sort((a: RangeData, b: RangeData) => a.source - b.source);
      final_map = reduceMaps(final_map, curr_map);
      curr_map = undefined;
    }
    const line_split = line.replace(' map:', '').split('-');
    curr_map = {
      destination: line_split[2].trim(),
      data: [],
    };
    return;
  }
  if (!curr_map) {
    return;
  }
  const line_split = line.split(' ');
  curr_map.data.push({
    source: parseInt(line_split[1].trim()),
    destination: parseInt(line_split[0].trim()),
    length: parseInt(line_split[2].trim()),
  });
}).then(() => {
  curr_map.data.sort((a: RangeData, b: RangeData) => a.source - b.source);
  final_map = reduceMaps(final_map, curr_map);
  if (final_map.data[0].source > 0) {
    final_map.data = [{
      source: 0,
      destination: 0,
      length: final_map.data[0].source,
    }, ...final_map.data];
  }
  let lowest = undefined;
  for (let sd of seed_data) {
    let finished = false;
    for (const md of final_map.data) {
      if (sd.start + sd.range <= md.source) {
        finished = true;
        break;
      }
      if (sd.start >= md.source + md.length) {
        continue;
      }
      const location = md.destination + (sd.start - md.source);
      if (location < lowest || lowest === undefined) {
        lowest = location;
      }
      const l = Math.min(sd.start + sd.range, md.source + md.length) - sd.start;
      sd.start += l;
      sd.range -= l;
      if (sd.range < 0) {
        return;
      } else if (sd.range === 0) {
        finished = true;
        break;
      }
    }
    if (!finished) {
      if (sd.start < lowest || lowest === undefined) {
        lowest = sd.start;
      }
    }
  }
  console.log(lowest);
});
