export interface CountingMapValue<v> {
  counter: number;
  value: v;
}

export class CountingMap<k, v> implements Map<k, v> {
  // Proxy to the actual map
  private map: Map<k, CountingMapValue<v>> = new Map<k, CountingMapValue<v>>();

  readonly [Symbol.toStringTag]: 'Map';

  get size() {
    return this.map.size;
  }

  [Symbol.iterator](): IterableIterator<[k, v]>;

  [Symbol.iterator](): IterableIterator<[k, v]>;

  [Symbol.iterator](): IterableIterator<[k, v]> {
    /**
     * interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}
     */
    const currentIterator = this.map.entries();
    return {
      next: () => {
        const currentValue = currentIterator.next();
        const done = currentValue.done;

        return {
          value: currentValue.value ?
            [currentValue.value[0], currentValue.value[1].value]: null,
          done,
        };

      },
    } as IterableIterator<[k, v]>;
  }

  clear(): void {
    this.map.clear();
  }

  delete(key: k): boolean {
    console.log('deleting')
    // todo deletes only if the count is 1
    const val: CountingMapValue<v> = this.map.get(key);
    if(!val) return false;
    if (val.counter === 1)
      this.map.delete(key);

    else {
      val.counter--;
      this.map.set(key, val);


    }
    return true;

  }

  entries(): IterableIterator<[k, v]>;
  entries(): IterableIterator<[k, v]>;
  entries(): IterableIterator<[k, v]> {
    const currentIterator = this.map.entries();
    return {
      next: () => {
        const currentValue = currentIterator.next();
        const done = currentValue.done;
        const val = currentValue.value;

        console.log(val)
        return {
          value: currentValue.value ?
            [currentValue.value[0], currentValue.value[1].value]: null,
          done,
        };

      },
    } as IterableIterator<[k, v]>;
  }

  forEach(callbackfn: (value: v, key: k, map: Map<k, v>) => void, thisArg?: any): void;
  forEach(callbackfn: (value: v, key: k, map: Map<k, v>) => void, thisArg?: any): void;
  forEach(callbackfn: (value: v, key: k, map: Map<k, v>) => void, thisArg?: any): void {
    this.map.forEach(
      (value: CountingMapValue<v>, key: k, map: Map<k, CountingMapValue<v>>) => {
        callbackfn(value.value, key, null); // todo update the map vakye
      },
    )
  }

  get(key: k): v | undefined {
    const value: CountingMapValue<v> = this.map.get(key);
    return value ? value.value: null;
  }

  has(key: k): boolean {
    return this.map.has(key);
  }

  keys(): IterableIterator<k>;
  keys(): IterableIterator<k>;
  keys(): IterableIterator<k> {
    return this.map.keys();
  }

  set(key: k, value: v): this | any;
  set(key: k, value: v): this | any;
  set(key: k, value: v): this | any {
    // add 1 to the counter if exists
    const val: CountingMapValue<v> = this.map.get(key);
    if (val) {
      val.counter++;
      val.value = value;
      this.map.set(key, val);
    } else {
      this.map.set(key, {
        counter: 1,
        value,
      });
    }
  }

  values(): IterableIterator<any>;
  values(): IterableIterator<v>;
  values(): IterableIterator<v> {
    const currentIterator = this.map.values();
    return {
      next: () => {
        const currentValue = currentIterator.next();
        const val = currentValue.value;
        const done = currentValue.done;
        return {
          value: val.value,
          done,
        } as any;

      },
    } as IterableIterator<v>;
  }

  // does not increment the counter
  update(key, val): this | any {
    const value = this.map.get(key);
    value.value = val;
    this.map.set(key, value);
  }

}