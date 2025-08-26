export const init = () => {
  const resetElements = document.querySelectorAll('.js-filter-reset');

  resetElements.forEach(element => {
    element?.addEventListener('click', () => {
      const url = new URL(window.location.href);
      const sort = url.searchParams.get('sort');

      url.search = sort ? `sort=${sort}` : '';

      window.location.href = url.toString();
    });
  });
};
