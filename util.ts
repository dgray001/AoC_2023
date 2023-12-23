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
    if (!!line) {
      await callback(line);
    }
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

class Element<T> {
  // A property to store the data
  private _value: T;
  public get value(): T {
    return this._value;
  }
  public set value(v: T) {
    this._value = v;
  }

  // A property to store pointer to the next element
  private _next: Element<T>;
  public get next(): Element<T> {
    return this._next;
  }
  public set next(v: Element<T>) {
    this._next = v;
  }

  constructor(val: T) {
    this._value = val;
    this._next = null;
  }
}

// from https://medium.com/@konduruharish/queue-in-typescript-and-c-cbd936564a42
export class Queue<T> {
  // Property to hold a reference to the first element in the queue.
  private _first: Element<T>;
  public get first(): Element<T> {
    return this._first;
  }
  public set first(elem: Element<T>) {
    this._first = elem;
  }

  // Property to hold a reference to the last element in the queue.
  private _last: Element<T>;
  public get last(): Element<T> {
    return this._last;
  }
  public set last(elem: Element<T>) {
    this._last = elem;
  }

  // Property to hold the total number of element in the queue.
  private _size: number;
  public get size(): number {
    return this._size;
  }
  public set size(v: number) {
    this._size = v;
  }

  /**
   * Creates a new instance of Queue with 0 elements in it.
   */
  constructor() {
    this._first = null;
    this._last = null;
    this.size = 0;
  }

  /**
   * Adds a new element to the end of the queue.
   * @param value Returns the success of the operation
  */
  Enqueue(value: T): boolean {
    // Create a new element with the given value
    const newElement = new Element(value);

    if (this._size == 0) {
      // If queue is empty, first and last will be the same.
      this._first = newElement;
      this._last = newElement;
    } else {
      // Add the element at the end of the linked list
      this._last.next = newElement;
      this._last = newElement;
    }

    // Increment the size by 1
    this._size++;

    // return
    return true;
  }

  /**
  * Removes an element from the beginning of the queue and returns its value
  */
  Dequeue(): T {
    // If queue is empty, return null
    if (this._size == 0) return null;

    // Save the value to a temp variable
    let prevFirst = this._first;

    // Reset the first element to the next in line
    this._first = prevFirst.next;

    // Remove the previour first node from the queue
    prevFirst.next = null;

    // Decrement the size of the queue
    this._size--;

    // Return
    return prevFirst.value;
  }

  peek(): T {
    if(this._size === 0) {
      return null;
    }
     
    return this._first.value;
  }
}
