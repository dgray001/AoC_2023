import {readFileByLine} from "../util";

interface WorkflowData {
  wf_key: string;
  workflow: StepData[];
}

interface StepData {
  condition?: string;
  effect: string;
}

interface PartData {
  x: number; // cool
  m: number; // musical
  a: number; // aerodynamic
  s: number; // shiny
  accepted?: boolean;
}

const workflows = new Map<string, WorkflowData>();
const parts: PartData[] = [];

function evaluate(part: PartData, wf: WorkflowData) {
  for (const step of wf.workflow) {
    if (!evaluateCondition(part, step.condition)) {
      continue;
    }
    switch(step.effect) {
      case 'A':
        part.accepted = true;
        return;
      case 'R':
        part.accepted = false;
        return;
      default:
        evaluate(part, workflows.get(step.effect));
        return;
    }
  }
}

function evaluateCondition(part: PartData, condition: string): boolean {
  if (!condition) {
    return true;
  }
  const v = part[condition.split('>')[0].split('<')[0].trim()];
  const c = parseInt(
    condition.includes('>') ? condition.split('>')[1] : condition.split('<')[1]
  );
  if (condition.includes('>')) {
    return v > c;
  }
  return v < c;
}

readFileByLine('input', async (line: string) => {
  if (!line) {
    return;
  }
  if (line.startsWith('{')) {
    const part: PartData = {
      x: NaN,
      m: NaN,
      a: NaN,
      s: NaN,
    };
    line.slice(1, line.length - 1).split(',').forEach(pp => {
      const num = parseInt(pp.trim().split('=')[1].trim());
      switch(pp.split('=')[0].trim()) {
        case 'x':
          part.x = num;
          break;
        case 'm':
          part.m = num;
          break;
        case 'a':
          part.a = num;
          break;
        case 's':
          part.s = num;
          break;
        default:
          console.error('error');
          break;
      }
    });
    parts.push(part);
  } else {
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
  }
}).then(() => {
  let sum = 0;
  for (const part of parts) {
    evaluate(part, workflows.get('in'));
    if (part.accepted) {
      sum += part.x + part.m + part.a + part.s;
    }
  }
  console.log(sum);
});
