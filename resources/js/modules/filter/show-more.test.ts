import { describe, it, beforeEach, expect } from 'vitest';
import { init } from '@js/modules/filter/show-more';

describe('show-more module', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="js-filter-list">
        <div class="js-filter-item">Item 1</div>
        <div class="js-filter-item">Item 2</div>
        <div class="js-filter-item">Item 3</div>
        <div class="js-filter-item">Item 4</div>
        <div class="js-filter-item">Item 5</div>
        <div class="js-filter-item">Item 6</div>
        <div class="js-filter-item">Item 7</div>
        <div class="js-filter-show-more">
          <span class="js-filter-show-more-text">Show More</span>
          <span class="js-filter-show-more-count">+2</span>
        </div>
      </div>
    `;
  });

  it('show/less more items', () => {
    init();

    const button = document.querySelector('.js-filter-show-more')!;
    const items = document.querySelectorAll('.js-filter-item');
    const buttonTextElement = button.querySelector('.js-filter-show-more-text')!;
    const buttonCountElement = button.querySelector('.js-filter-show-more-count')!;

    button.dispatchEvent(new Event('click'));

    items.forEach(el => {
      expect(el.classList.contains('hidden')).toBe(false);
    });
    expect(buttonTextElement.textContent).toBe('Show Less');
    expect(buttonCountElement.classList.contains('hidden')).toBe(true);
    expect(button.classList.contains('active')).toBe(true);

    //repeat click
    button.dispatchEvent(new Event('click'));

    items.forEach((el, index) => {
      if (index >= 5) {
        expect(el.classList.contains('hidden')).toBe(true);
      } else {
        expect(el.classList.contains('hidden')).toBe(false);
      }
    });
    expect(buttonTextElement.textContent).toBe('Show More');
    expect(buttonCountElement.classList.contains('hidden')).toBe(false);
    expect(button.classList.contains('active')).toBe(false);
  });
});
