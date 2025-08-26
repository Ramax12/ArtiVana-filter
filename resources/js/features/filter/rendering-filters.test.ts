import { describe, it, expect, beforeEach } from 'vitest';
import { renderingFilters } from '@js/features/filter/rendering-filters';

describe('rendering-filters feature', () => {
  let form: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <form class="js-form">
        <div
          class="js-filter-list"
          data-name-category="subsubcategories"
          data-subsubcategories='[{"name":"Lamps & Filters","value":"lamps-filters"},{"name":"LED Panels","value":"led-panels"}]'
          >
          <div class="js-filter-item">
            <input type="checkbox" name="subsubcategories" value="led-panels" />
            <span class="js-filter-item-text">LED Panels</span>
            <span class="js-filter-item-count">(3)</span>
          </div>
          <div class="js-filter-item">
            <input type="checkbox" name="subsubcategories" value="lamps-filters" />
            <span class="js-filter-item-text">Lamps & Filters</span>
            <span class="js-filter-item-count">(6)</span>
          </div>
        </div>
        <div class="js-filter-list" data-name-category="brand">
          <div class="js-filter-item">
            <input type="checkbox" name="brand" />
            <span class="js-filter-item-text">Elinchrom</span>
            <span class="js-filter-item-count">(3)</span>
          </div>
          <div class="js-filter-item">
            <input type="checkbox" name="brand" />
            <span class="js-filter-item-text">Aputure</span>
            <span class="js-filter-item-count">(2)</span>
          </div>
        </div>
      </form>
    `;
    form = document.querySelector('.js-form')!;
  });

  it('should render text, count and values for items', () => {
    const filters = {
      subsubcategories: { 'Lamps & Filters': 6, 'LED Panels': 3 },
      brand: { Aputure: 2, Elinchrom: 0 },
    };

    const activeFilters = {
      subsubcategories: 'lamps-filters',
      brand: ['Aputure'],
    };

    renderingFilters(form, filters, activeFilters);

    const items = form.querySelectorAll('.js-filter-item')!;

    const firstTextElements = form.querySelectorAll('.js-filter-item-text')!;
    expect(firstTextElements[0].textContent).toContain('Lamps & Filters');
    expect(firstTextElements[1].textContent).toContain('LED Panels');
    expect(firstTextElements[2].textContent).toContain('Aputure');
    expect(firstTextElements[3].textContent).toContain('Elinchrom');

    const countElements = form.querySelectorAll('.js-filter-item-count')!;
    expect(countElements[0].textContent).toContain('6');
    expect(countElements[1].textContent).toContain('3');
    expect(countElements[2].textContent).toContain('2');
    expect(items[3].classList.contains('disabled')).toBe(true);
    expect(countElements[3].classList.contains('hidden')).toBe(true);

    const inputElement: NodeListOf<HTMLInputElement> = form.querySelectorAll('input');
    expect(inputElement[0].value).toBe('lamps-filters');
    expect(inputElement[0].checked).toBe(true);
    expect(inputElement[1].value).toBe('led-panels');
    expect(inputElement[1].checked).toBe(false);
    expect(inputElement[2].value).toBe('Aputure');
    expect(inputElement[2].checked).toBe(true);
    expect(inputElement[3].value).toBe('Elinchrom');
    expect(inputElement[3].checked).toBe(false);
  });
});
