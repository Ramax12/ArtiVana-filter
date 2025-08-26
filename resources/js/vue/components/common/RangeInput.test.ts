import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import RangeInput from '@components/common/RangeInput.vue';
import BaseInput from '@components/common/BaseInput.vue';
import RangeSlider from '@components/common/RangeSlider.vue';

describe('RangeInput vue', () => {
  let wrapper: any;

  const props = {
    modelValue: [10, 50],
    names: ['minPrice', 'maxPrice'],
    min: 0,
    max: 100,
    suffix: '₽',
    format: 'number',
  };

  beforeEach(() => {
    wrapper = mount(RangeInput, {
      props,
      global: {
        stubs: {
          BaseInput,
          RangeSlider,
        },
      },
    });
  });

  it('initializes model and sliderValue from props', () => {
    expect(wrapper.vm.model).toEqual([10, 50]);
    expect(wrapper.vm.sliderValue).toEqual([10, 50]);
  });

  it('emits events when changeValue is called', async () => {
    wrapper.vm.changeValue('min');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted()['update:modelMin'][0]).toEqual([10]);
    expect(wrapper.emitted()['update:modelMax'][0]).toEqual([50]);
    expect(wrapper.emitted()['change-value']).toBeTruthy();
  });

  it('updates model when BaseInput is changed', async () => {
    const inputs = wrapper.findAllComponents(BaseInput);
    await inputs[0].setValue(20);
    await inputs[0].vm.$emit('change-value', 'min');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.model[0]).toBe(20);
    const emittedMin = wrapper.emitted()['update:modelMin'];
    expect(emittedMin).toBeTruthy();
    expect(emittedMin[emittedMin.length - 1]).toEqual([20]);
  });

  it('syncs sliderValue when props.modelValue changes', async () => {
    await wrapper.setProps({ modelValue: [5, 30] });
    expect(wrapper.vm.sliderValue).toEqual([5, 30]);
  });
});
