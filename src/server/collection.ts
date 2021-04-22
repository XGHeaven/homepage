import { Heap, Comparator } from "heap-js";

export class Collection<T> {
  private heap: Heap<T>;
  private changed = true;
  private collection: T[] = [];

  constructor(public comparator: Comparator<T>) {
    this.heap = new Heap(comparator);
  }

  get length() {
    return this.toArray().length;
  }

  push(value: T) {
    this.heap.push(value);
    this.changed = true;
  }

  slice(start?: number, end?: number) {
    return this.toArray().slice(start, end);
  }

  pagination(page: number, pageSize: number) {
    return this.toArray().slice((page - 1) * pageSize, page * pageSize);
  }

  toArray() {
    if (this.changed) {
      this.collection = this.heap.toArray();
      this.changed = false;
    }
    return this.collection;
  }
}
