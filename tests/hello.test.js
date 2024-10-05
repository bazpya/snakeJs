import { hello } from '../src/hello.js';

test('Defaults to Hi there', () => {
    const actual = hello();
    const expected = "Hi there";
    expect(actual).toBe(expected);
});
