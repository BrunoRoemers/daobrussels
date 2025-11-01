import { expect, test } from '@jest/globals';
import { toBytes } from './to-bytes';

test.each([
  ['1', 1],
  ['250', 250],
  ['1kb', 1000],
  ['5 kb', 5000],
  ['2.5kb', 2500],
  ['3.7 kb', 3700],
  ['4,9kb', 4900],
  ['1mb', 1000 * 1000],
  ['5 mb', 5000 * 1000],
  ['2.5mb', 2500 * 1000],
  ['3.7 mb', 3700 * 1000],
  ['4,9mb', 4900 * 1000],
  ['1gb', 1000 * 1000 * 1000],
  ['5 gb', 5000 * 1000 * 1000],
  ['2.5gb', 2500 * 1000 * 1000],
  ['3.7 gb', 3700 * 1000 * 1000],
  ['4,9gb', 4900 * 1000 * 1000],
])('convert %s to bytes', (value, expected) => {
  expect(toBytes(value)).toBe(expected);
});

test.each([
  ['3.7'],
  ['asdf'],
  [''],
  [' '],
  ['5hb'],
  ['1.2375kb'],
  ['1.2.3kb'],
  ['1,,3gb'],
  ['2..2'],
  ['5.kb'],
  ['3,'],
])('throw if invalid value %s', (value) => {
  expect(() => toBytes(value)).toThrow();
});
