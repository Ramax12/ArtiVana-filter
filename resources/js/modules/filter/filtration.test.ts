import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { init } from '@js/modules/filter/filtration';
import { fetchFilterMeta } from '@js/features/filter/fetch-filter-meta';
import { renderingFilters } from '@js/features/filter/rendering-filters';
import updateUrlParams from '@js/utils/update-url-params';

vi.mock('@js/features/filter/fetch-filter-meta', () => ({
  fetchFilterMeta: vi.fn().mockResolvedValue({ count: 5, filters: {} }),
}));
vi.mock('@js/features/filter/rendering-filters', () => ({
  renderingFilters: vi.fn(),
}));
vi.mock('@js/utils/update-url-params', () => ({
  default: vi.fn().mockReturnValue('subsubcategory[]=lamps-filters'),
}));

describe('filtration module', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form class="js-filter" data-id-subcategory="lighting" data-id-subsubcategory="">
        <div class="js-selected-filter hidden">
          <div class="js-selected-filter-list"></div>
          <div class="js-selected-filter-item js-selected-filter-template hidden">
            <span></span>
            <div class="js-remove-filter" data-filter="" data-value=""></div>
          </div>
        </div>
        <div class="js-filter-item">
          <input type="checkbox" name="subsubcategory[]" value="lamps-filters" checked />
        </div>
        <div class="js-filter-item">
          <input type="checkbox" name="brand[]" value="Aputure" />
        </div>
        <div class="js-filter-item">
          <input type="checkbox" name="rating" value="4" />
        </div>
        <div class="js-filter-item">
          <input type="text" inputmode="numeric" name="min_price" />
        </div>
        <a class="js-show-products-main"></a>
      </form>
      <div class="js-filter-popup">
        <div class="js-selected-filter hidden">
          <div class="js-selected-filter-list"></div>
          <div class="js-selected-filter-item js-selected-filter-template hidden">
            <span></span>
            <div class="js-remove-filter" data-filter="" data-value=""></div>
          </div>
        </div>
        <div class="js-filter-item-popup">
          <input type="checkbox" name="subsubcategory[]" value="lamps-filters" checked />
        </div>
        <div class="js-filter-item-popup">
          <input type="checkbox" name="brand[]" value="Aputure" />
        </div>
        <div class="js-filter-item-popup">
          <input type="checkbox" name="rating" value="4" />
        </div>
        <div class="js-filter-item-popup">
          <input type="text" inputmode="numeric" name="min_price" />
        </div>
        <a class="js-show-products-main-popup"></a>
      </div>
      <div class="js-filter-button"></div>
    `;

    window.history.pushState({}, '', '?subsubcategory%5B%5D=lamps-filters&subcategory=lighting');

    vi.clearAllMocks();
  });

  it('click on brand input', async () => {
    init();
    (updateUrlParams as Mock).mockReturnValue('subsubcategory[]=lamps-filters&brand[]=Aputure');

    const input: HTMLInputElement = document.querySelector('.js-filter input[name="brand[]"]')!;
    input.dispatchEvent(new Event('change'));
    input.checked = true;

    await new Promise(res => setTimeout(res, 400));

    expect(renderingFilters).toHaveBeenCalled();

    expect(input.closest('.js-filter-item')?.querySelector('.js-show-products')?.textContent).toContain('Show 5 items');
    expect(updateUrlParams).toHaveBeenCalled();

    expect(fetchFilterMeta).toHaveBeenCalled();

    const mainButton: HTMLAnchorElement = document.querySelector('.js-show-products-main')!;
    expect(mainButton.classList.contains('hidden')).toBe(false);
    expect(mainButton.textContent).toContain('Show 5 items');
  });

  it('click on brand input in popup', async () => {
    init();
    (updateUrlParams as Mock).mockReturnValue('subsubcategory[]=lamps-filters&brand[]=Aputure');

    const input: HTMLInputElement = document.querySelector('.js-filter-popup input[name="brand[]"]')!;
    input.dispatchEvent(new Event('change'));
    input.checked = true;

    await new Promise(res => setTimeout(res, 400));

    expect(renderingFilters).toHaveBeenCalled();
    expect(updateUrlParams).toHaveBeenCalled();

    const items = document.querySelectorAll('.js-selected-filter-item');

    expect(items[0].querySelector('span')?.textContent).toBe('Departments: lamps-filters');
    const firstRemove: HTMLElement = items[0].querySelector('.js-remove-filter')!;
    expect(firstRemove.dataset.filter).toBe('subsubcategory[]');
    expect(firstRemove.dataset.value).toBe('lamps-filters');

    expect(items[1].querySelector('span')?.textContent).toBe('Brand: Aputure');
    const secondRemove: HTMLElement = items[1].querySelector('.js-remove-filter')!;
    expect(secondRemove.dataset.filter).toBe('brand[]');
    expect(secondRemove.dataset.value).toBe('Aputure');

    expect(fetchFilterMeta).toHaveBeenCalled();

    const mainButton: HTMLAnchorElement = document.querySelector('.js-show-products-main-popup')!;
    expect(mainButton.classList.contains('hidden')).toBe(false);
    expect(mainButton.textContent).toContain('Show 5 items');
  });

  it('click/repeat click on subsubcategory input', async () => {
    init();
    (fetchFilterMeta as Mock).mockReturnValue({ count: 20, filters: {} });
    (updateUrlParams as Mock).mockReturnValue('');

    const input: HTMLInputElement = document.querySelector('.js-filter input[name="subsubcategory[]"]')!;
    input.dispatchEvent(new Event('change'));
    input.checked = false;

    await new Promise(res => setTimeout(res, 400));

    expect(renderingFilters).toHaveBeenCalled();

    expect(input.closest('.js-filter-item')?.querySelector('.js-show-products')?.textContent).toContain('Show 20 items');
    expect(updateUrlParams).toHaveBeenCalled();

    expect(fetchFilterMeta).toHaveBeenCalled();

    const mainButton: HTMLAnchorElement | null = document.querySelector('.js-show-products-main')!;
    expect(mainButton.classList.contains('hidden')).toBe(false);
    expect(mainButton.textContent).toContain('Show 20 items');

    //repeat click
    (fetchFilterMeta as Mock).mockReturnValue({ count: 5, filters: {} });
    (updateUrlParams as Mock).mockReturnValue('subsubcategory[]=lamps-filters');
    input.dispatchEvent(new Event('change'));
    input.checked = true;

    await new Promise(res => setTimeout(res, 400));

    expect(input.closest('.js-filter-item')?.querySelector('.js-show-products')).toBeNull();
    expect(mainButton.classList.contains('hidden')).toBe(true);
  });

  it('change price', async () => {
    init();
    (updateUrlParams as Mock).mockReturnValue('subsubcategory[]=lamps-filters&min_price=1000');

    const input: HTMLInputElement = document.querySelector('.js-filter input[name="min_price"]')!;
    input.value = '1 000';
    (window as any).onVueInputChange(input);

    await new Promise(res => setTimeout(res, 400));

    expect(renderingFilters).toHaveBeenCalled();

    expect(input.closest('.js-filter-item')?.querySelector('.js-show-products')?.textContent).toContain('Show 5 items');
    expect(updateUrlParams).toHaveBeenCalled();

    expect(fetchFilterMeta).toHaveBeenCalled();

    const mainButton: HTMLAnchorElement = document.querySelector('.js-show-products-main')!;
    expect(mainButton.classList.contains('hidden')).toBe(false);
    expect(mainButton.textContent).toContain('Show 5 items');
  });

  it('opens popup on filter button click', () => {
    init();
    const button = document.querySelector('.js-filter-button')!;
    button.dispatchEvent(new Event('click'));

    expect(document.querySelector('.js-filter-popup')?.classList.contains('open')).toBe(true);
    expect(document.body.classList.contains('overflow-hidden')).toBe(true);
  });
});
