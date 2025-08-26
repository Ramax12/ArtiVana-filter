import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeAll } from 'vitest';
import RangeSlider from '@components/common/RangeSlider.vue';

describe('RangeSlider vue', () => {
  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as any;
  });

  it('renders single thumb slider', async () => {
    const wrapper = mount(RangeSlider, {
      props: {
        modelValue: 5,
        min: 0,
        max: 10,
      },
    });

    expect(wrapper.find('.range-slider').exists()).toBe(true);
    expect(wrapper.findAll('.range-slider__thumb-wrapper').length).toBe(2);
  });

  it('renders double thumb slider', async () => {
    const wrapper = mount(RangeSlider, {
      props: {
        modelValue: [2, 8],
        min: 0,
        max: 10,
      },
    });

    const thumbs = wrapper.findAll('.range-slider__thumb-wrapper');
    expect(thumbs.length).toBe(2);
    expect(wrapper.find('.range-slider__thumb').exists()).toBe(true);
  });

  it('emits update:modelValue on click (single slider)', async () => {
    const wrapper = mount(RangeSlider, {
      attachTo: document.body,
      props: {
        modelValue: 3,
        min: 0,
        max: 10,
      },
    });

    Object.defineProperty(wrapper.find('.range-slider').element, 'getBoundingClientRect', {
      value: () => ({
        left: 0,
        width: 100,
        height: 10,
        top: 0,
        right: 100,
        bottom: 10,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });

    await wrapper.find('.range-slider').trigger('click', { clientX: 50 });

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0][0]).toBeGreaterThanOrEqual(0);
    expect(wrapper.emitted('update:modelValue')![0][0]).toBeLessThanOrEqual(10);
  });

  it('emits update:modelValue on click (double slider)', async () => {
    const wrapper = mount(RangeSlider, {
      attachTo: document.body,
      props: {
        modelValue: [1, 9],
        min: 0,
        max: 10,
      },
    });

    Object.defineProperty(wrapper.find('.range-slider').element, 'getBoundingClientRect', {
      value: () => ({
        left: 0,
        width: 100,
        height: 10,
        top: 0,
        right: 100,
        bottom: 10,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });

    await wrapper.find('.range-slider').trigger('click', { clientX: 20 });

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    const emitted = wrapper.emitted('update:modelValue')![0][0] as Array<number>;
    expect(Array.isArray(emitted)).toBe(true);
    expect(emitted.length).toBe(2);
  });
});
