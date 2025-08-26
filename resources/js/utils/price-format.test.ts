import { describe, it, expect } from 'vitest';
import priceFormat from '@js/utils/price-format';

describe('price-format util', () => {
  it('should return null for null input', () => {
    expect(priceFormat(null)).toBeNull();
  });

  it('should return null for non-numeric string', () => {
    expect(priceFormat('abc')).toBeNull();
    expect(priceFormat('123abc')).toBeNull();
  });

  it('should format numeric string correctly', () => {
    const result = priceFormat('1000');
    expect(result).not.toBeNull();
    expect(result!.replace(/\s/g, '')).toBe('1000');

    const big = priceFormat('1234567');
    expect(big).not.toBeNull();
    expect(big!.replace(/\s/g, '')).toBe('1234567');
  });

  it('should handle negative numbers', () => {
    const result = priceFormat('-5000');
    expect(result).not.toBeNull();
    expect(result!.replace(/\s/g, '')).toBe('-5000');
  });

  it('should handle decimal numbers', () => {
    const result = priceFormat('12345.67');
    expect(result).not.toBeNull();
    expect(result!.replace(/\s/g, '')).toBe('12345,67');
  });
});
