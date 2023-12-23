import {createReadStream} from 'fs';
import {createInterface} from 'readline';
import {dirname} from 'path';

/** Read file line by line */
export async function readFileByLine(filename: string, callback: (line: string) => Promise<void>) {
  const fileStream = createReadStream(`${dirname(module.parent.filename)}/${filename}`, 'utf-8');
  
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  
  for await (const line of rl) {
    await callback(line);
  }
}

export function isNumeric(s: string): boolean {
  return /^\d+$/.test(s);
}

export declare interface P2D {
  x: number;
  y: number;
}

export declare interface P3D {
  x: number;
  y: number;
  z: number;
}

/** Uses a binary heap (https://stackoverflow.com/a/42919752) */
export class PriorityQueue<T> {
  private static top = 0;
  private static parent = (i: number) => ((i + 1) >>> 1) - 1;
  private static left = (i: number) => (i << 1) + 1;
  private static right = (i: number) => (i + 1) << 1;

  private comparator: (a: T, b: T) => boolean;
  private heap: T[] = [];

  constructor(comparator: (a: T, b: T) => boolean) {
    this.comparator = comparator;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size() == 0;
  }

  peek() {
    return this.heap[PriorityQueue.top];
  }

  push(...values: T[]) {
    values.forEach(v => {
      this.heap.push(v);
      this.siftup();
    });
  }

  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > PriorityQueue.top) {
      this.swap(PriorityQueue.top, bottom);
    }
    this.heap.pop();
    this.siftDown();
    return poppedValue;
  }

  private siftup() {
    let i = this.heap.length - 1;
    while (i > PriorityQueue.top && this.greater(i, PriorityQueue.parent(i))) {
      this.swap(i, PriorityQueue.parent(i));
      i = PriorityQueue.parent(i);
    }
  }

  private siftDown() {
    let i = PriorityQueue.top;
    while (
      (PriorityQueue.left(i) < this.size() && this.greater(PriorityQueue.left(i), i)) ||
      (PriorityQueue.right(i) < this.size() && this.greater(PriorityQueue.right(i), i))
    ) {
      let maxChild = (PriorityQueue.right(i) < this.size() &&
        this.greater(PriorityQueue.right(i), PriorityQueue.left(i))) ? PriorityQueue.right(i) : PriorityQueue.left(i);
      this.swap(i, maxChild);
      i = maxChild;
    }
  }

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private greater(i: number, j: number): boolean {
    return this.comparator(this.heap[i], this.heap[j]);
  }
}
