import {readFileByLine} from "../util";

interface WorkflowData {
  wf_key: string;
  workflow: StepData[];
}

interface StepData {
  condition?: string;
  effect: string;
}

interface AbstractPartData {
  conditions: string[];
}

const workflows = new Map<string, WorkflowData>();

const abstract_parts: AbstractPartData[] = [];

function evaluate(part: AbstractPartData, wf: WorkflowData) {
  let part_copy: AbstractPartData = {
    conditions: [...part.conditions],
  };
  for (const step of wf.workflow) {
    if (!!step.condition) {
      const {pass, fail} = applyCondition(part_copy, step.condition);
      evaluateEffect(pass, step.effect);
      part_copy = fail;
    } else {
      evaluateEffect(part_copy, step.effect);
      return;
    }
  }
}

function evaluateEffect(part: AbstractPartData, effect: string) {
  const part_copy: AbstractPartData = {
    conditions: [...part.conditions],
  };
  switch(effect) {
    case 'A':
      abstract_parts.push(part_copy);
      return;
    case 'R':
      return;
    default:
      evaluate(part_copy, workflows.get(effect));
      return;
  }
}

function applyCondition(part: AbstractPartData, condition: string): {pass: AbstractPartData, fail: AbstractPartData} {
  const pass_condition: AbstractPartData = {
    conditions: [...part.conditions],
  };
  const fail_condition: AbstractPartData = {
    conditions: [...part.conditions],
  };
  pass_condition.conditions.push(condition);
  fail_condition.conditions.push(condition.includes('<') ? condition.replace('<', '>=') : condition.replace('>', '<='));
  return {pass: pass_condition, fail: fail_condition};
}

interface ConditionsData {
  x: BoundData[]; // cool
  m: BoundData[]; // musical
  a: BoundData[]; // aerodynamic
  s: BoundData[]; // shiny
}

// upper >= lower
interface BoundData {
  lower: number;
  upper: number;
}

function reduceConditions(ap: AbstractPartData): ConditionsData {
  const cd: ConditionsData = {
    x: [{lower: 1, upper: 4000}],
    m: [{lower: 1, upper: 4000}],
    a: [{lower: 1, upper: 4000}],
    s: [{lower: 1, upper: 4000}],
  };
  for (const con of ap.conditions) {
    const v_key = con.split('>')[0].split('<')[0].trim();
    cd[v_key] = andCondition(cd[v_key], con.slice(1));
  }
  return cd;
}

function andCondition(bounds: BoundData[], con: string): BoundData[] {
  const new_bounds: BoundData[] = [];
  function andGreater(v: number) {
    for (const bound of bounds) {
      if (bound.lower > v) {
        new_bounds.push({...bound});
      } else {
        new_bounds.push({
          lower: v + 1,
          upper: bound.upper,
        });
      }
    }
  }
  function andLesser(v: number) {
    for (const bound of bounds) {
      if (bound.upper < v) {
        new_bounds.push({...bound});
      } else {
        new_bounds.push({
          lower: bound.lower,
          upper: v - 1,
        });
      }
    }
  }
  if (con.startsWith('>=')) {
    andGreater(parseInt(con.slice(2)) - 1);
  } else if (con.startsWith('>')) {
    andGreater(parseInt(con.slice(1)));
  } else if (con.startsWith('<=')) {
    andLesser(parseInt(con.slice(2)) + 1);
  } else if (con.startsWith('<')) {
    andLesser(parseInt(con.slice(1)));
  }
  return new_bounds;
}

readFileByLine('input_test', async (line: string) => {
  if (!line) {
    return;
  }
  if (line.startsWith('{')) {
    return;
  }
  const wf_key = line.split('{')[0].trim();
  const wf: WorkflowData = {
    wf_key,
    workflow: [],
  };
  line.slice(0, line.length - 1).split('{')[1].trim().split(',').forEach(wfs => {
    const wfs_split = wfs.split(':');
    const wf_step: StepData = {
      effect: wfs_split[wfs_split.length - 1],
    };
    if (wfs_split.length > 1) {
      wf_step.condition = wfs_split[0];
    }
    wf.workflow.push(wf_step);
  });
  workflows.set(wf_key, wf);
}).then(() => {
  let sum = 0;
  const part: AbstractPartData = {conditions: [],};
  evaluate(part, workflows.get('in'));
  const conditions = abstract_parts.map(ap => reduceConditions(ap));
  for (const c of conditions) {
    const addPossibilities = (b: BoundData) => b.upper - b.lower + 1;
    const x = c.x.map(addPossibilities).reduce((a, b) => a + b);
    const m = c.m.map(addPossibilities).reduce((a, b) => a + b);
    const a = c.a.map(addPossibilities).reduce((a, b) => a + b);
    const s = c.s.map(addPossibilities).reduce((a, b) => a + b);
    sum += x * m * a * s;
  }
  console.log(sum);
});
