import { describe, it, expect, vi, beforeEach } from 'vitest';
import { init } from '@js/modules/filter/sorting';
import updateUrlParams from '@js/utils/update-url-params';

vi.mock('@js/utils/update-url-params', () => ({
  default: vi.fn(),
}));

describe('sorting module', () => {
  let sortElement: HTMLElement;
  let sortTitleElement: HTMLElement;
  let sortItem1: HTMLElement;
  let mockHref = '';

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="js-sorting-button"></div>
      <div class="js-sort">
        <div class="js-sort-title">
          <span class="js-sort-name" data-sort="default">Default</span>
        </div>
        <div class="js-sort-item" data-sort="rating_desc">Price</div>
        <div class="js-sort-item" data-sort="price_asc">Name</div>
      </div>
      <div class="js-sort-popup">
        <form class="js-sort-form">
          <input type="checkbox" name="sort" value="rating_desc" />
          <input type="checkbox" name="sort" value="price_asc" />
        </form>
      </div>
    `;

    sortElement = document.querySelector('.js-sort')!;
    sortTitleElement = sortElement.querySelector('.js-sort-title')!;
    sortItem1 = sortElement.querySelector('.js-sort-item[data-sort="rating_desc"]')!;

    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        get href() {
          return mockHref;
        },
        set href(value: string) {
          mockHref = value;
        },
        origin: 'http://localhost',
        pathname: '/test',
      },
      writable: true,
    });

    (updateUrlParams as any).mockReturnValue('mockedParams');
    vi.spyOn(window.location, 'href', 'set');
  });

  it('toggles open class on sort title click', () => {
    init();

    sortTitleElement.dispatchEvent(new Event('click'));
    expect(sortElement.classList.contains('open')).toBe(true);
    sortTitleElement.dispatchEvent(new Event('click'));
    expect(sortElement.classList.contains('open')).toBe(false);
  });

  it('clicking on sort item updates window.location.href', () => {
    init();

    sortItem1.dispatchEvent(new Event('click'));

    expect(updateUrlParams).toHaveBeenCalledWith({ sort: 'rating_desc' });
    expect(window.location.href).toContain('mockedParams');
    
    //resets sort
    const sortName: HTMLElement = sortTitleElement.querySelector('.js-sort-name')!;
    sortName.dataset.sort = 'rating_desc';

    sortItem1.dispatchEvent(new Event('click'));
    expect(updateUrlParams).toHaveBeenCalledWith({ sort: '' });
  });

  it('checking a checkbox in form updates window.location.href', () => {
    init();

    const sortForm = document.querySelector('.js-sort-form')!;
    const checkbox: HTMLInputElement = sortForm.querySelector('input[value="rating_desc"]')!;
    
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(updateUrlParams).toHaveBeenCalledWith({ sort: 'rating_desc' });
    expect(window.location.href).toContain('mockedParams');
  });

  it('click outside the desktop sorting', () => {
    init();

    sortElement.dispatchEvent(new Event('click'));

    expect(sortElement.classList.contains('open')).toBe(false);
  });

  it('should open popup when filterSortingElement is clicked', () => {
    init();

    const filterSortingElement = document.querySelector('.js-sorting-button')!;
    const sortPopupElement = document.querySelector('.js-sort-popup')!;

    filterSortingElement.dispatchEvent(new Event('click'));

    expect(sortPopupElement.classList.contains('open')).toBe(true);
    expect(document.body.classList.contains('overflow-hidden')).toBe(true);
  });
});
