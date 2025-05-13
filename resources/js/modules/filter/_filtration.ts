import updateUrlParams from '@js/utils/update-url-params';
import { fetchFilterMeta } from '@js/features/filter/fetch-filter-meta';
import { renderingFilters } from '@js/features/filter/rendering-filters';

(function () {
  const form: HTMLElement | null = document.querySelector('.js-filter');
  const formPopup = document.querySelector('.js-filter-popup');
  const filterButton = document.querySelector('.js-filter-button');
  const filterItemPopupElements = document.querySelectorAll('.js-filter-item-popup');
  const showProductsButtonMain: HTMLAnchorElement | null = document.querySelector('.js-show-products-main');
  const showProductsButtonMainPopup: HTMLAnchorElement | null = document.querySelector('.js-show-products-main-popup');
  const selectedFilterElement = document.querySelector('.js-selected-filter');
  const selectedFilterTemplate = document.querySelector('.js-selected-filter-template');
  const selectedFilterList = document.querySelector('.js-selected-filter-list');

  const urlParams = new URLSearchParams(window.location.search);
  const filters: Record<string, string | Array<string>> = {};
  const defaultFilters: Record<string, string | Array<string>> = {};
  let debounceTimer: ReturnType<typeof setTimeout>;

  urlParams.forEach((value, key) => {
    if (key !== 'sort' && key !== 'page') {
      defaultFilters[key] = urlParams.getAll(key);
    }
  });

  const transformString = (str: string): string => {
    return str
      .split(/(\s|,)/)
      .map(word =>
        word
          .split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join('-'),
      )
      .join('');
  };

  const createShowProductsElement = (count: number, href: string) => {
    const button = document.createElement('a');
    button.href = href;
    button.className = `js-show-products z-40 absolute top-1/2 left-[312px] py-2 px-2 text-white whitespace-nowrap rounded-md -translate-y-1/2 bg-brand hover:bg-brand-hover transition-brand
      after:absolute after:top-1/2 after:-left-[7px] after:w-0 after:h-0 after:border-b-8 after:border-r-8 
      after:border-t-8 after:border-transparent after:-translate-y-1/2 after:border-r-brand hover:after:border-r-brand-hover after:transition after:duration-200 after:ease-in-out`;
    button.textContent = `Show ${count} items`;
    return button;
  };

  const addSelectedFilters = (query: string) => {
    const params = new URLSearchParams(query);
    const result: Record<string, Array<string>> = {};

    params.forEach((value, key) => {
      if (key !== 'sort') {
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(value);
      }
    });

    selectedFilterElement?.classList.add('hidden');
    selectedFilterList?.querySelectorAll('.js-selected-filter-item').forEach(el => el.remove());

    let priceMin = result['min_price']?.[0];
    let priceMax = result['max_price']?.[0];
    let oldKey = priceMin ? 'min_price' : 'max_price';

    if (priceMin || priceMax) {
      let priceText = priceMin && priceMax ? `${priceMin} ₽ – ${priceMax} ₽` : priceMin ? `from ${priceMin} ₽` : `to ${priceMax} ₽`;
      addFilterElement('Price', priceText, oldKey, [priceMin ?? '', priceMax ?? '']);
      delete result['min_price'];
      delete result['max_price'];
    }

    Object.entries(result).forEach(([key, values]) => {
      if (!values.length) return;

      let cleanKey = key.endsWith('[]') ? key.slice(0, -2) : key;
      cleanKey = cleanKey.replace(/^characteristics\[(.+)\]$/, '$1');
      if (cleanKey === 'subsubcategory') {
        cleanKey = 'Departments';
      }

      const newKey = cleanKey === 'rating' ? 'Rating' : transformString(cleanKey);
      const newValue = cleanKey === 'rating' ? `${values[0]}+ stars` : values.map(transformString).join(', ');
      if (key !== 'subcategory' && key !== 'subsubcategory') {
        addFilterElement(newKey, newValue, key, values);
      }
    });
  };

  selectedFilterList?.addEventListener('click', event => {
    const target = event.target as HTMLElement;

    if (target.classList.contains('js-remove-filter')) {
      filterItemPopupElements.forEach(element => {
        const input = element.querySelector('input');
        if (input) {
          const values = target.getAttribute('data-value')?.split(',');
          const key = target.getAttribute('data-filter');

          if (key === 'min_price' || key === 'max_price') {
            (window as any).updateRangeValue();
          } else {
            values?.forEach(value => {
              if (input.name === key && input.value === value) {
                input.checked = false;
              }
            });
          }
        }
      });
      const item = target.closest('.js-selected-filter-item');
      item?.remove();
    }
  });

  const addFilterElement = (newKey: string, newValue: string, key: string, values: Array<string>) => {
    if (!selectedFilterTemplate || !selectedFilterList) return;

    const item = selectedFilterTemplate.cloneNode(true) as HTMLElement;
    const span = item.querySelector('span');
    const button = item.querySelector('.js-remove-filter');

    item.classList.remove('js-selected-filter-template', 'hidden');
    item.classList.add('flex');

    if (span) {
      span.textContent = `${newKey}: ${newValue}`;
    }

    if (button) {
      button.setAttribute('data-filter', key);
      button.setAttribute('data-value', values.join(','));
    }

    selectedFilterElement?.classList.remove('hidden');
    selectedFilterList.append(item);
  };

  function updateFilters(isPopup: boolean | undefined) {
    Object.keys(filters).forEach(key => delete filters[key]);

    const element = isPopup ? formPopup : form;
    element?.querySelectorAll('input').forEach(input => {
      if (input instanceof HTMLInputElement) {
        const key = input.getAttribute('name') ?? '';
        const value = input.value;

        if (input.type === 'checkbox' && input.checked) {
          if (key === 'rating') {
            filters[key] = value;
          } else {
            filters[key] = filters[key] ? [...filters[key], value] : [value];
          }
        } else if (input.type === 'text') {
          const replacedValue = value.replace(/\D/g, '');
          if (replacedValue !== '') {
            filters[key] = replacedValue;
          }
        }
      }
    });
  }

  function areFiltersReset(): boolean {
    const defaultEntries = Object.entries(defaultFilters).filter(([key]) => key !== 'subcategory' && key !== 'subsubcategory');
    const filterEntries = Object.entries(filters).filter(([key]) => key !== 'subcategory' && key !== 'subsubcategory');

    if (defaultEntries.length !== filterEntries.length) return false;

    return defaultEntries.every(([key, defaultValue]) => {
      const currentValue = filters[key];

      return Array.isArray(defaultValue) && Array.isArray(currentValue)
        ? defaultValue.length === currentValue.length && defaultValue.every(v => currentValue.includes(v))
        : defaultValue === currentValue;
    });
  }

  const handleFilterChange = async (element: HTMLElement, isPopup?: boolean) => {
    updateFilters(isPopup);

    let newFilters = filters;
    newFilters.subcategory = form?.dataset.idSubcategory ?? '';
    newFilters.subsubcategory = form?.dataset.idSubsubcategory ?? '';

    const filterMeta = await fetchFilterMeta(newFilters);
    const count = filterMeta.count;

    const showProductsButton = document.querySelector('.js-show-products');
    const filterItemElement = element.closest('.js-filter-item');
    const updatedFilters: string = updateUrlParams(filters);
    const href: string = `${document.location.origin}${document.location.pathname}?${updatedFilters}`;

    renderingFilters(form, filterMeta.filters, filters);

    showProductsButton?.remove();
    filterItemElement?.appendChild(createShowProductsElement(count, href));
    if (isPopup) {
      addSelectedFilters(updatedFilters);
    }

    if (areFiltersReset()) {
      showProductsButtonMain?.classList.add('hidden');
      selectedFilterElement?.classList.add('hidden');
      formPopup?.classList.remove('show-button');
      document.querySelector('.js-show-products')?.remove();
    } else {
      if (showProductsButtonMain) {
        showProductsButtonMain.classList.remove('hidden');
        showProductsButtonMain.href = href;
        showProductsButtonMain.textContent = `Show ${count} items`;
      }
      if (showProductsButtonMainPopup) {
        formPopup?.classList.add('show-button');
        showProductsButtonMainPopup.href = href;
        showProductsButtonMainPopup.textContent = `Show ${count} items`;
      }
    }
  };

  if (form) {
    document.querySelectorAll<HTMLInputElement>('.js-filter input, .js-filter-popup input').forEach(element => {
      element.addEventListener('change', async () => {
        setTimeout(() => {
          const isPopup = element.closest('.js-filter-popup') !== null;

          handleFilterChange(element, isPopup);
        });
      });
    });

    form.querySelectorAll('input').forEach(input => {
      if (input instanceof HTMLInputElement) {
        const key = input.getAttribute('name') ?? '';
        const value = input.value;

        if (input.type === 'checkbox' && input.checked) {
          filters[key] = filters[key] ? [...filters[key], value] : [value];
        } else if (input.type === 'text') {
          if (value !== '') {
            filters[key] = value.replace(/\D/g, '');
          }
        }

        addSelectedFilters(updateUrlParams(filters));
      }
    });

    (window as any).onVueInputChange = (element: HTMLElement) => {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        setTimeout(() => {
          const isPopup = !!element.closest('.js-filter-popup');
          handleFilterChange(element, isPopup);
        }, 20);
      }, 300);
    };
  }

  filterButton?.addEventListener('click', () => {
    formPopup?.classList.add('open');
    document.body.classList.add('overflow-hidden');
  });
})();
