import {readFileByLine} from "../util";

let sum = 1;

interface RaceData {
  time: number;
  record: number;
}

let race: RaceData = {time: 0, record: 0};

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  if (line.includes('Time:')) {
    race.time = parseInt(line.replace('Time:', '').trim().replace(/\s/g, ''));
  } else if (line.includes('Distance:')) {
    race.record = parseInt(line.replace('Distance:', '').trim().replace(/\s/g, ''));
  }
}).then(() => {
  // we essentially have f(t, x) = x * (t - x) where x in [0, t]
  // need to find x such that x * (t - x) > r
  // so: x^2 - tx + r < 0
  // x > (t +/- sqrt(t^2 - 4r)) / 2
  // where the two roots give the bounds of what will beat the record
  const xr1 = (race.time + Math.sqrt(race.time * race.time - 4 * race.record)) / 2;
  const xr2 = (race.time - Math.sqrt(race.time * race.time - 4 * race.record)) / 2;
  let start_int_time = Math.ceil(xr2);
  if (start_int_time <= xr2) {
    start_int_time++; // if xr2 is an integer
  }
  let end_int_time = Math.floor(xr1);
  if (end_int_time >= xr1) {
    end_int_time--;
  }
  const num_int_times_that_beat_record = end_int_time - start_int_time + 1;
  sum *= num_int_times_that_beat_record;
  console.log(sum);
});
