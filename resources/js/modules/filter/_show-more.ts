(function () {
  const NUMBER_DEFAULT_ITEMS = 5;
  const buttons = document.querySelectorAll('.js-filter-show-more');

  if (buttons.length === 0) return;

  buttons.forEach(button => {
    button.addEventListener('click', function () {
      const items = this.closest('.js-filter-list').querySelectorAll(['.js-filter-item', '.js-filter-item-popup']);
      const buttonTextElement = this.querySelector('.js-filter-show-more-text');
      const buttonCountElement = this.querySelector('.js-filter-show-more-count');

      if (this.classList.contains('active')) {
        items.forEach((element, index) => {
          if (index >= NUMBER_DEFAULT_ITEMS) {
            element.classList.add('hidden');
          }
        });
        buttonTextElement.textContent = 'Show More';
        buttonCountElement.classList.remove('hidden');
      } else {
        items.forEach(element => {
          element.classList.remove('hidden');
        });
        buttonTextElement.textContent = 'Show Less';
        buttonCountElement.classList.add('hidden');
      }

      this.classList.toggle('active');
    });
  });
})();
