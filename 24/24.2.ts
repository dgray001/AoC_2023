import {P3D, readFileByLine} from "../util";

interface Hail {
  p: P3D;
  v: P3D;
}

const hail: Hail[] = [];

readFileByLine('input_test', async (line: string) => {
  if (hail.length >= 3) {
    return;
  }
  const p_str = line.split('@')[0].split(',').map(v => parseInt(v.trim()));
  const v_str = line.split('@')[1].split(',').map(v => parseInt(v.trim()));
  hail.push({
    p: {x: p_str[0], y: p_str[1], z: p_str[2]},
    v: {x: v_str[0], y: v_str[1], z: v_str[2]},
  });
}).then(() => {
  console.log(hail);
  // px + ti * vx - pix - ti * vix = 0
  // px + ti * (vx - vix) - pix = 0
  // py + ti * (vy - viy) - piy = 0
  // pz + ti * (vz - viz) - piz = 0
  // ti = [(pix + piy + piz) - (px + py + pz)] / [(vx + vy + vz) - (vix + viy + viz)]
  // ti = (pi_sum - p_sum) / (v_sum - vi_sum)
  // tj = (pj_sum - p_sum) / (v_sum - vj_sum)
  // tk = (pk_sum - p_sum) / (v_sum - vk_sum)
});