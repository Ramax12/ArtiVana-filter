(function () {
  const resetElements = document.querySelectorAll('.js-filter-reset');
  const removeFilterButtons = document.querySelectorAll('.js-remove-filter');

  resetElements.forEach(element => {
    element?.addEventListener('click', () => {
      const url = new URL(window.location.href);
      const sort = url.searchParams.get('sort');

      url.search = sort ? `sort=${sort}` : '';

      window.location.href = url.toString();
    });
  });

  removeFilterButtons.forEach(element => {
    element.addEventListener('click', function () {
      const filter = (this as HTMLElement).dataset.filter as string;
      const value = (this as HTMLElement).dataset.value as string;
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      if (filter === 'price') {
        const minPrice = params.get('min_price');
        const maxPrice = params.get('max_price');

        if (minPrice) {
          params.delete('min_price');
        }
        if (maxPrice) {
          params.delete('max_price');
        }
      } else if (params.has(filter) || params.has(`${filter}[]`)) {
        const paramKey = params.has(filter) ? filter : `${filter}[]`;
        let values = params.getAll(paramKey);

        values = values.filter((v: string) => v !== value);

        params.delete(paramKey);
      }

      url.search = params.toString();
      window.location.href = url.toString();
    });
  });
})();
