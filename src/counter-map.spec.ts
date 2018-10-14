import { CountingMap } from './counter-map'

test('basic', () => {
  const counter = new CountingMap();
  counter.set('key', 'value');
  expect(counter.get('key')).toBe('value');
});
test('adding 2 and deleting doesnt kill the instance', () => {
  const counter = new CountingMap();
  counter.set('key', 'value');
  counter.set('key', 'value');
  counter.delete('key')
  expect(counter.get('key')).toBe('value');
});
test('adding 2 and deleting 2  kills the instance', () => {
  const counter = new CountingMap();
  counter.set('key', 'value');
  counter.set('key', 'value');
  counter.delete('key');
  counter.delete('key');
  expect(counter.get('key')).toBe(null);
});
test('iterator entries work as it should', () => {
  const counter = new CountingMap();
  counter.set('key', 'value');
  counter.set('key', 'value');

  const iter: IterableIterator<any> = counter.entries();
  let iter1 = iter.next();
  while (!iter1.done) {
    console.log(iter1);
    console.log(iter1.value);
    expect(iter1.value[0]).toBe('key');
    expect(iter1.value[1]).toBe('value');
    iter1 = iter.next();
  }

});
test('size should work properly', () => {
  const counter = new CountingMap();
  counter.set('key', 'value');
  counter.set('key', 'value');
  counter.set('key2', 'value2');
  expect(counter.size).toBe(2);
});
test('iteratable keys should work properly', () => {
  const counter = new CountingMap();
  counter.set('key', 'value');
  counter.set('key', 'value');
  counter.set('key2', 'value2');
  const iters = counter.keys();
  expect(counter.size).toEqual(2);
  let keysIter: IteratorResult<any> = iters.next();
  while (keysIter.done) {
    expect(keysIter.value).toContain('key');
    keysIter = iters.next();
  }
});
test('iteratable values to hold the value without the counter', () => {
  const counter = new CountingMap();
  counter.set('key', 'value');
  counter.set('key', 'value');
  counter.set('key2', 'value');
  console.log('value is ' + counter.get('key'));
  const iters = counter.values();
  expect(counter.size).toEqual(2);
  let keysIter: IteratorResult<any> = iters.next();
  while (keysIter.done) {
    console.log(keysIter.value)
    expect(keysIter.value).toEqual('value');
    keysIter = iters.next();
  }
});
test('updates does not increment', () => {
  const counter = new CountingMap();
  counter.set('key', 'value');
  //
  // counter.update('key', 'value1');
  let val = counter.get('key');
  // expect(val).toEqual('value');
  counter.update('key', 'value1');
  console.log('has value '+counter.get('key'));
  val = counter.get('key');
  expect(val).toEqual('value1');
  counter.delete('key');
  expect(counter.get('key')).toEqual(null);
});
