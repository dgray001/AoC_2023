import {readFileByLine} from "../util";

interface ModuleData {
  k: string;
  outputs: string[]; // k[]
  flip_flop: boolean;
  curr_ff: boolean;
  con_inputs: Map<string, boolean>; // <key, high/low>
  con_lcms?: Map<string, number>; // <key, cycle>
  last_received_pulses: boolean[]; // high/low
  last_received_pulses_keys: string[]; // k
}

const modules = new Map<string, ModuleData>();

let rx_input = 'kc'; // is a conjunction

function pulse(i: number): boolean {
  function setLcm(next: string, i: number): boolean {
    modules.get(rx_input).con_lcms.set(next, i);
    return modules.get(rx_input).con_lcms.size === modules.get(rx_input).con_inputs.size;
  }
  let lows_sent = 1;
  modules.get('broadcaster').last_received_pulses.push(false);
  //console.log('button -low-> broadcaster');
  let highs_sent = 0;
  const q: string[] = ['broadcaster'];
  while(!!q.length) {
    const next = q.shift();
    const m = modules.get(next);
    const last_pulse = m.last_received_pulses.shift();
    const last_pulse_key = m.last_received_pulses_keys.shift();
    if (next === 'broadcaster') {
      for (const o of m.outputs) {
        if (last_pulse) {
          //console.log(`${next} -high-> ${o}`);
          highs_sent++;
        } else {
          //console.log(`${next} -low-> ${o}`);
          lows_sent++;
        }
        if (!modules.get(o)) {
          continue;
        }
        if (last_pulse && o === rx_input && !modules.get(o).con_lcms.has(next)) {
          if (setLcm(next, i)) {
            return true;
          }
        }
        modules.get(o).last_received_pulses.push(last_pulse);
        modules.get(o).last_received_pulses_keys.push(next);
        q.push(o);
      }
    } else if (m.flip_flop) {
      if (last_pulse) {
        continue;
      }
      m.curr_ff = !m.curr_ff;
      for (const o of m.outputs) {
        if (m.curr_ff) {
          //console.log(`${next} -high-> ${o}`);
          highs_sent++;
        } else {
          //console.log(`${next} -low-> ${o}`);
          lows_sent++;
        }
        if (!modules.get(o)) {
          continue;
        }
        if (m.curr_ff && o === rx_input && !modules.get(o).con_lcms.has(next)) {
          if (setLcm(next, i)) {
            return true;
          }
        }
        modules.get(o).last_received_pulses.push(m.curr_ff);
        modules.get(o).last_received_pulses_keys.push(next);
        q.push(o);
      }
    } else {
      m.con_inputs.set(last_pulse_key, last_pulse);
      const send_high = [...m.con_inputs.values()].some(v => !v);
      for (const o of m.outputs) {
        if (send_high) {
          //console.log(`${next} -high-> ${o}`);
          highs_sent++;
        } else {
          //console.log(`${next} -low-> ${o}`);
          lows_sent++;
        }
        if (!modules.get(o)) {
          continue;
        }
        if (send_high && o === rx_input && !modules.get(o).con_lcms.has(next)) {
          if (setLcm(next, i)) {
            return true;
          }
        }
        modules.get(o).last_received_pulses.push(send_high);
        modules.get(o).last_received_pulses_keys.push(next);
        q.push(o);
      }
    }
  }
  return false;
}

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  let k = line.split(' -> ')[0].trim();
  const data: ModuleData = {
    k,
    outputs: line.split(' -> ')[1].trim().split(',').map(k => k.trim()),
    flip_flop: true,
    curr_ff: false,
    con_inputs: new Map<string, boolean>(), // TODO: maybe initialize
    last_received_pulses: [],
    last_received_pulses_keys: [],
  };
  if (k.startsWith('%')) {
    data.flip_flop = true;
    data.k = k.slice(1);
    k = k.slice(1);
  } else if (k.startsWith('&')) {
    data.flip_flop = false;
    data.k = k.slice(1);
    k = k.slice(1);
  }
  modules.set(k, data);
}).then(() => {
  for (const m of modules.values()) {
    for (const o of m.outputs) {
      if (!modules.get(o)) {
        continue;
      }
      modules.get(o).con_inputs.set(m.k, false);
    }
  }
  modules.get(rx_input).con_lcms = new Map<string, number>();
  let i = 0;
  while(true) {
    i++
    if (pulse(i)) {
      break;
    }
  }
  const lcms = [...modules.get(rx_input).con_lcms.values()];
  const gcd = (a, b) => a ? gcd(b % a, a) : b;
  const lcm = (a, b) => a * b / gcd(a, b);
  console.log(lcms.reduce(lcm));
});
