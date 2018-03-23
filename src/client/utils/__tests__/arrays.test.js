import * as utils from '../arrays';

describe('Arrays', () => {
  test('concat', () => {
    const arrayOne = [1, 2, 3];
    const arrayTwo = [4, 5, 6];
    expect(utils.concat(arrayOne, arrayTwo)).toEqual([1, 2, 3, 4, 5, 6]);
  });
  test('Last item', () => {
    const receivedArray = ['one', 'two', 'three'];
    expect(utils.lastElement(receivedArray)).toBe('three');
  });
});
