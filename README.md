Counting Map

A basic map that keeps count of each unique item you set and cleans up only when all counters have been deleted.


Examples:
```
 const counter = new CountingMap();
 counter.set('key', 'value');
```

Adding and removing:
```
    counter.set('key', 'value');
    counter.set('key', 'value');
    counter.delete('key');
```
This example will keep one instance of key in the map
If we run another delete:
```
    counter.delete('key');
```
no items with key 'key' are in the map

Only updating with no incrementing:
```
    const counter = new CountingMap();
    counter.set('key', 'value');
    counter.update('key', 'value1');
```
Full explanation:

Many times while developing new features for a given project, I encounter a need to create a data structure that will hold some topic and their data( pub-sub anyone?). One of the most elegant data structure for this case is a hash map which gives us the ability to make fast lookups in O(1). Then we create this data structure and start using it.



In some cases, this map is a data store for many consumers. What if 2 consumers request the same topic - so we retrieve the data somehow(HTTP, calculation and so on and we pull it every 5 sec') and we store it in our store - then suddenly out of the blue! one of the consumers tells us he has no more interest in this topics and says his goodbyes. What is next? do we delete the topic clearing some space in our map? If we do delete it and then seconded consumer asks for the data again and we need to recalculate the topic - costing us the valuable time we could save if just didn't delete the topic.

We need a map that remembers how many consumers each topic has! then if one consumer says goodbye we can just lookup if we have any more clients and take a smart call.

Counter Map
My main goal while creating this map was to abstract the need to increment and decrement a counter for each topic from the user. As I see it a developer using this map should only use set, get and delete as it does on a regular map, I will add an update function that doesn't increment the counter only for updates.

The Decorator pattern
In object-oriented programming, the decorator pattern is a design pattern that allows behavior to be added to an individual object, dynamically, without affecting the behavior of other objects from the same class.[1] The decorator pattern is often useful for adhering to the Single Responsibility Principle, as it allows functionality to be divided between classes with unique areas of concern.[2] The decorator pattern is structurally nearly identical to the chain of responsibility pattern, the difference being that in a chain of responsibility, exactly one of the classes handles the request, while for the decorator, all classes handle the request. (wikipedia)

I choose to use this pattern so I will not need to invent the wheel and implement all the map method instead I will just delegate the work to an actual map and just add some functionality, I will use typescript for simplicity.

export class CountingMap<k, v> implements Map<k, v> {
  // Proxy to the actual map
  private map: Map<k, any> = new Map<k, any>();

  readonly [Symbol.toStringTag]: 'Map';


}
We hold a private member - a map and init it. this will be our actual data structure, we implement the Map interface so we are allign with the Map contact and every user can use our implementation as "just" a map.

Now We need to alter our map a little so it will be more explicit - so we will create an interface to save the count and data of each object 

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
  ....// 
}
Each time someone performs on a key we will keep track of a counter representing how many references we have to this topic data.

Set Method:

We will review set as our request topic method - if we have it we will increment the counter otherwise we will set it to 1 as it is the first reference.

 set(key: k, value: v): this | any {
    // add 1 to the counter if exists
    const val: CountingMapValue<v> | undefined= this.map.get(key);
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
Delete.

If the counter is 1 and a request is made to delete the topic so we just delete it otherwise we will update the counter in our map data source for the requested topic.

 delete(key: k): boolean {
    
    // todo deletes only if the count is 1
    const val: CountingMapValue<any> | undefined = (this.map.get(key));
    if(!val) return false;
    if (val.counter === 1)
      this.map.delete(key);

    else {
      val.counter--;
      this.map.set(key, val);


    }
    return true;

  }
 get(key: k): v | undefined {
    const value: CountingMapValue<v> = this.map.get(key);
    return (value ? value.value : null) as v;
  }
No news here... we just hide the cunter data from the user giving it the feeling it is a simple Map that holds only data.

We will add an update method that doesn't affect the counter is needed

 // does not increment the counter
  update(key: any, val: any): this | any {
    const value :CountingMapValue<any> | undefined = this.map.get(key);
    value!.value = val;
    this.map.set(key, value as any);
  }
Iterators:

The map object exposes iterators over the data collection, what is an iterator? 

interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>
}


an iterator is an object which implements the Iterator protocol by having a next() method - simple as that what is the next function you ask? this is the actual magic - it's a function that returns an object with to properties value and done. value is the current object in the collection we are iterating over such as:

array[index];
done is a boolean member that tells us if we have reached the end of the collection.

So a general usage of an iterator will be something of the following:

let result = it.next();
while (!result.done) {
 console.log(result.value); // 1 3 5 7 9
 result = it.next();
}
from mozila.

We again will delegate to our internal map iterators which we already have using the clousre to keep track of the iterator requested.

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
entries(): IterableIterator<[k, v]> {
    const currentIterator = this.map.entries();
    return {
      next: () => {
        const currentValue = currentIterator.next();
        const done = currentValue.done;
        const val = currentValue.value;
        return {
          value: currentValue.value ?
            [val[0], val[1].value]: null,
          done,
        };

      },
    } as IterableIterator<[k, v]>;
  }

[Symbol.iterator](): IterableIterator<[k, v]> {
   
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
keys(): IterableIterator<k> {
    return this.map.keys();
  }

Notice we have values keys and entries iterators

Values are just an iterator over the actual values we are storing.
Entries is an array of [key, value] for each object we are iterating over.
Keys are the keys in our map so we can just return the original keys.
That's it!

