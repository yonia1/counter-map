import { CountingMap } from './counter-map';
test('basic', () => {
    const counter = new CountingMap();
    counter.set('key', 'value');
    expect(counter.get('key')).toBe('value');
});
//# sourceMappingURL=counter-map.spec.js.map