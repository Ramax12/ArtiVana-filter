export const renderingFilters = (
  form: HTMLElement | null,
  filters: Record<string, Record<string, number>>,
  activeFilters: Record<string, string | Array<string>>,
) => {
  Object.entries(filters).forEach(([key, value]) => {
    const filterListElements = document.querySelectorAll(`.js-filter-list[data-name-category="${key}"]`);

    filterListElements.forEach(element => {
      const items = element.querySelectorAll('.js-filter-item, .js-filter-item-popup');
      const entries = Object.entries(value as Record<string, number>);

      items.forEach((item, index) => {
        const textElement = item.querySelector('.js-filter-item-text');
        const countElement = item.querySelector('.js-filter-item-count');
        const inputElement = item.querySelector('input');

        if (textElement && entries[index]) {
          textElement.textContent = entries[index][0];
        }
        if (countElement && entries[index]) {
          countElement.textContent = entries[index][1] ? `(${entries[index][1]})` : '';
          if (entries[index][1] === 0) {
            item.classList.add('disabled');
            countElement.classList.add('hidden');
          } else {
            item.classList.remove('disabled');
            countElement.classList.remove('hidden');
          }
        }
        if (inputElement && entries[index] && key !== 'rating') {
          if (key === 'subsubcategories') {
            const listElement: HTMLElement | null = item.closest('.js-filter-list');
            const subsubcategories = JSON.parse(listElement?.dataset.subsubcategories ?? '');
            const subsubcategoryValue = subsubcategories.find(e => e.name === entries[index][0]).value;

            inputElement.value = subsubcategoryValue;
          } else {
            inputElement.value = entries[index][0];
          }
        }
      });
    });
  });

  form?.querySelectorAll('input[type="checkbox"]').forEach(element => {
    (element as HTMLInputElement).checked = false;
  });

  Object.entries(activeFilters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => {
        const input: HTMLInputElement | null | undefined = form?.querySelector(`input[name="${key}"][value="${item}"]`);
        if (input) {
          input.checked = true;
        }
      });
    } else {
      const input: HTMLInputElement | null | undefined = form?.querySelector(`input[name="${key}"][value="${value}"]`);
      if (input) {
        input.checked = true;
      }
    }
  });
};
