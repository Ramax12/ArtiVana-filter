import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { init } from '@js/modules/filter/reset-filters';

describe('reset-filters module', () => {
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = new URL('http://localhost:3000/products?sort=price&brand[]=Sony');

    document.body.innerHTML = `
      <div class="js-filter-reset">Reset</div>
    `;

    init();
  });

  afterEach(() => {
    (window as any).location = originalLocation;
  });

  it('removes all filters but keeps sort', () => {
    const resetButton = document.querySelector('.js-filter-reset')!;
    const hrefSpy = vi.spyOn(window.location, 'href', 'set');

    resetButton.dispatchEvent(new Event('click'));

    expect(hrefSpy).toHaveBeenCalledWith('http://localhost:3000/products?sort=price');
  });

  it('removes all params if no sort', () => {
    (window as any).location = new URL('http://localhost:3000/products?brand[]=Sony');

    const resetButton = document.querySelector('.js-filter-reset')!;
    const hrefSpy = vi.spyOn(window.location, 'href', 'set');

    resetButton.dispatchEvent(new Event('click'));

    expect(hrefSpy).toHaveBeenCalledWith('http://localhost:3000/products');
  });
});
