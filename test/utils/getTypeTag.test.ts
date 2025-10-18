import { describe, expect, it } from 'vitest';
import getTypeTag from '../../src/utils/getTypeTag';

describe('getTypeTag', () => {
  describe('Primitive types', () => {
    it('should return "string" for string values', () => {
      expect(getTypeTag('')).toBe('string');
      expect(getTypeTag('hello')).toBe('string');
    });

    it('should return "number" for number values', () => {
      expect(getTypeTag(0)).toBe('number');
      expect(getTypeTag(42)).toBe('number');
      expect(getTypeTag(-1)).toBe('number');
      expect(getTypeTag(3.14)).toBe('number');
    });

    it('should return "number" for NaN and Infinity', () => {
      expect(getTypeTag(NaN)).toBe('number');
      expect(getTypeTag(Infinity)).toBe('number');
      expect(getTypeTag(-Infinity)).toBe('number');
    });

    it('should return "boolean" for boolean values', () => {
      expect(getTypeTag(true)).toBe('boolean');
      expect(getTypeTag(false)).toBe('boolean');
    });

    it('should return "undefined" for undefined', () => {
      expect(getTypeTag(undefined)).toBe('undefined');
    });

    it('should return "null" for null', () => {
      expect(getTypeTag(null)).toBe('null');
    });

    it('should return "symbol" for symbol values', () => {
      expect(getTypeTag(Symbol())).toBe('symbol');
      expect(getTypeTag(Symbol('test'))).toBe('symbol');
    });

    it('should return "bigint" for BigInt values', () => {
      expect(getTypeTag(BigInt(123))).toBe('bigint');
      expect(getTypeTag(123n)).toBe('bigint');
    });
  });

  describe('Objects and functions', () => {
    it('should return "object" for plain objects', () => {
      expect(getTypeTag({})).toBe('object');
      expect(getTypeTag({ a: 1 })).toBe('object');
      expect(getTypeTag(Object.create(null))).toBe('object');
    });

    it('should return "array" for arrays', () => {
      expect(getTypeTag([])).toBe('array');
      expect(getTypeTag([1, 2, 3])).toBe('array');
    });

    it('should return "function" for functions', () => {
      expect(getTypeTag(() => { })).toBe('function');
      expect(getTypeTag(function () { })).toBe('function');
      expect(getTypeTag(async () => { })).toBe('asyncfunction');
      expect(getTypeTag(async function () { })).toBe('asyncfunction');
    });
  });

  describe('Built-in objects', () => {
    it('should return "date" for Date objects', () => {
      expect(getTypeTag(new Date())).toBe('date');
    });

    it('should return "error" for Error objects', () => {
      expect(getTypeTag(new Error())).toBe('error');
      expect(getTypeTag(new TypeError())).toBe('error');
    });

    it('should return "regexp" for RegExp objects', () => {
      expect(getTypeTag(/a/)).toBe('regexp');
      expect(getTypeTag(new RegExp('test'))).toBe('regexp');
    });

    it('should return "promise" for Promise objects', () => {
      expect(getTypeTag(Promise.resolve())).toBe('promise');
      expect(getTypeTag(new Promise(() => { }))).toBe('promise');
    });

    it('should return "map" for Map objects', () => {
      expect(getTypeTag(new Map())).toBe('map');
    });

    it('should return "set" for Set objects', () => {
      expect(getTypeTag(new Set())).toBe('set');
    });

    it('should return "weakmap" for WeakMap objects', () => {
      expect(getTypeTag(new WeakMap())).toBe('weakmap');
    });

    it('should return "weakset" for WeakSet objects', () => {
      expect(getTypeTag(new WeakSet())).toBe('weakset');
    });
  });
});