 class CountingMap {
    constructor() {
        // Proxy to the actual map
        this.map = new Map();
        this.readonly = [Symbol.toStringTag];
        this.readonly = size;
    }
    [Symbol.iterator]() {
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
                    value: {
                        key: currentValue.value.key,
                        value: currentValue.value.value,
                    },
                    done,
                };
                as;
                any;
            }
        };
        as;
        IterableIterator();
    }
    clear() {
        this.map.clear();
    }
    delete(key) {
        // todo deletes only if the count is 0
        const val = this.map.get(key);
        if (val.counter === 0)
            this.map.delete(key);
        val.counter--;
        this.map.set(key, val);
        return true;
    }
    entries() {
        const currentIterator = this.map.entries();
        return {
            next: () => {
                const currentvalue = currentIterator.next();
                const done = currentvalue.done;
                return {
                    value: {
                        key: currentvalue.key,
                        value: currentvalue.value.value,
                    }, done,
                };
                as;
                any;
            },
        };
        as;
        IterableIterator();
    }
    forEach(callbackfn, thisArg) {
        this.map.forEach((value, key, map) => {
            callbackfn(value.value, key, null); // todo update the map vakye
        });
    }
    get(key) {
        const value = this.map.get(key);
        return value ? value.value : null;
    }
    has(key) {
        return this.map.has(key);
    }
    keys() {
        return this.map.keys();
    }
    set(key, value) { }
}
this | any;
set(key, k, value, v);
this | any;
set(key, k, value, v);
this | any;
{
    // add 1 to the counter if exists
    const val = this.map.get(key);
    if (val) {
        val.counter++;
        this.map.set(key, val);
    }
    else {
        this.map.set(key, {
            counter: 1,
            value,
        });
    }
    return this;
}
values();
IterableIterator();
values();
IterableIterator();
values();
IterableIterator < v > {
    const: currentIterator = this.map.values(),
    return: {
        next: () => {
            const currentValue = currentIterator.next();
            const done = currentValue.done;
            return {
                value: {
                    value: currentValue.value,
                },
                done,
            };
            as;
            any;
        }
    }, as: IterableIterator()
};
//# sourceMappingURL=counter-map.js.map