import updateUrlParams from '@js/utils/update-url-params';

export const init = () => {
  const sortElement: HTMLElement | null = document.querySelector('.js-sort');
  const sortFormElement = document.querySelector('.js-sort-form');
  const sortPopupElement = document.querySelector('.js-sort-popup');
  const filterSortingElement = document.querySelector('.js-sorting-button');

  const handleClickOutside = (element: HTMLElement | null, callback: () => void) => {
    function onClick(event: Event) {
      if (element && element.classList.contains('open') && !element.contains(event.target as HTMLElement)) {
        callback();
      }
    }

    document.addEventListener('click', onClick);
  };

  if (sortElement) {
    const sortTitleElement = sortElement.querySelector('.js-sort-title');
    const sortItemElements = sortElement.querySelectorAll('.js-sort-item');

    sortTitleElement?.addEventListener('click', () => {
      sortTitleElement.closest('.js-sort')?.classList.toggle('open');
    });

    sortItemElements.forEach(element => {
      element.addEventListener('click', function (this: HTMLElement) {
        if (sortTitleElement) {
          const sortNameElement: HTMLElement | null = sortTitleElement.querySelector('.js-sort-name');
          let isDefaultValue: boolean;

          if (sortNameElement) {
            if (sortNameElement.dataset.sort === this.dataset.sort) {
              isDefaultValue = true;
            } else {
              isDefaultValue = false;
            }

            const params: Record<string, string> = {
              sort: isDefaultValue ? '' : this.dataset.sort ?? '',
            };
            window.location.href = `${document.location.origin}${document.location.pathname}?${updateUrlParams(params)}`;

            this.closest('.js-sort')?.classList.remove('open');
          }
        }
      });
    });

    handleClickOutside(sortElement, () => {
      sortElement.classList.remove('open');
    });
  }

  sortFormElement?.addEventListener('change', (event: Event) => {
    const target = event.target as HTMLInputElement;
    let sortValue = '';

    if (target.type === 'checkbox') {
      sortFormElement.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox !== target) {
          (checkbox as HTMLInputElement).checked = false;
        }
      });

      if (target.checked) {
        sortValue = target.value;
      }
    }

    const params = {
      sort: sortValue,
    };

    window.location.href = `${document.location.origin}${document.location.pathname}?${updateUrlParams(params)}`;
  });

  filterSortingElement?.addEventListener('click', () => {
    sortPopupElement?.classList.add('open');
    document.body.classList.add('overflow-hidden');
  });
};
