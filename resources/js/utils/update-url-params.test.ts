import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import updateUrlParams from '@js/utils/update-url-params';

describe('update-url-params util', () => {
  let originalSearch: string;

  beforeEach(() => {
    originalSearch = window.location.search;
    delete (window as any).location;
    (window as any).location = { search: '?sort=asc&page=2' };
  });

  afterEach(() => {
    delete (window as any).location;
    (window as any).location = { search: originalSearch };
  });

  it('should keep existing sort if params does not contain sort', () => {
    const result = updateUrlParams({ category: 'books' });

    expect(result).toContain('sort=asc');
    expect(result).toContain('category=books');
    expect(result).not.toContain('page=');
  });

  it('should update sort if params contains sort as string', () => {
    const result = updateUrlParams({ sort: 'desc' });

    expect(result).toBe('sort=desc');
  });

  it('should remove sort if params contains sort as empty string', () => {
    const result = updateUrlParams({ sort: '' });

    expect(result).toBe('');
  });

  it('should append array values correctly', () => {
    const result = updateUrlParams({ tags: ['a', 'b'] });

    expect(result).toContain('tags=a');
    expect(result).toContain('tags=b');
  });

  it('should ignore empty array or empty strings', () => {
    const result = updateUrlParams({ tags: [], category: '' });

    expect(result).toBe('sort=asc');
  });
});
