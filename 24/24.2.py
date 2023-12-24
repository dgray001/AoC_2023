from z3 import *

hail = []
for line in open('input', 'r').readlines():
  x, y, z = map(int, line.split('@')[0].split(','))
  vx, vy, vz = map(int, line.split('@')[1].split(','))
  hail.append(((x, y, z), (vx, vy, vz)))

Ps = [Real(f'p-{i}') for i in range(3)]
PVs = [Real(f'pv-{i}') for i in range(3)]
solver = Solver()
for i in range(4):
  t = Real(f't-{i}')
  p, v = hail[i]
  for c in range(3):
    solver.add(Ps[c] + t * PVs[c] == p[c] + t * v[c])

solver.check()
m = solver.model()
sum = 0
for p in Ps:
  sum += int(str(m.evaluate(p)))
print(sum)
