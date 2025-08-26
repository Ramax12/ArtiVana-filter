import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseInput from '@components/common/BaseInput.vue';
import SvgMark from '@components/svg/Mark.vue';
import SvgDanger from '@components/svg/Danger.vue';

describe('BaseInput.vue', () => {
  it('renders label and placeholder', () => {
    const wrapper = mount(BaseInput, {
      props: { name: 'test', label: 'Test Label', placeholder: 'Enter value' },
    });

    expect(wrapper.find('[data-testid="label"]').text()).toBe('Test Label');
    expect(wrapper.find('[data-testid="input"]').attributes('placeholder')).toBe('Enter value');
  });

  it('displays error message when props.error is set', async () => {
    const wrapper = mount(BaseInput, {
      props: { name: 'test', placeholder: 'Enter', error: 'Required field', modelValue: null },
    });

    await wrapper.setProps({ modelValue: '' });
    await wrapper.vm.$nextTick();

    const errorDiv = wrapper.find('[data-testid="error-message"]');
    expect(errorDiv.exists()).toBe(true);
    expect(errorDiv.text()).toBe('Required field');
  });

  it('emits change-value on blur', async () => {
    const wrapper = mount(BaseInput, {
      props: { name: 'test', placeholder: 'Enter' },
    });

    const input = wrapper.find('[data-testid="input"]');
    await input.setValue('Hello');
    await input.trigger('blur');

    expect(wrapper.emitted('change-value')).toBeTruthy();
  });

  it('formats price input correctly', async () => {
    const wrapper = mount(BaseInput, {
      props: { name: 'price', placeholder: 'Enter price', format: 'price' },
    });

    const input = wrapper.find('[data-testid="input"]');
    await input.setValue('12345');
    await input.trigger('input');

    expect((input.element as HTMLInputElement).value).toContain('12\u00A0345');
  });

  it('accepts phone input and masks it', async () => {
    const wrapper = mount(BaseInput, {
      props: { name: 'phone', placeholder: 'Phone', format: 'phone' },
    });

    const input = wrapper.find('[data-testid="input"]');
    await input.trigger('focus');
    await input.setValue('8123456789');
    await input.trigger('input');

    expect((input.element as HTMLInputElement).value).toContain('8');
    expect(wrapper.emitted('change-value')).toBeFalsy();
    await input.trigger('blur');
    expect(wrapper.emitted('change-value')).toBeTruthy();
  });

  it('removes suffix on focus and restores on blur', async () => {
    const wrapper = mount(BaseInput, {
      props: { name: 'price', placeholder: 'Enter', format: 'price', suffix: ' ₽' },
    });

    const input = wrapper.find('[data-testid="input"]');
    await input.setValue('1000 ₽');
    await input.trigger('focus');

    expect((input.element as HTMLInputElement).value).toBe('1\u00A0000');
    await input.trigger('blur');
    expect((input.element as HTMLInputElement).value).toBe('1\u00A0000 ₽');
  });

  it('renders success icon when input is valid', async () => {
    const wrapper = mount(BaseInput, {
      props: { name: 'name', placeholder: 'Enter', format: 'name', error: null },
    });

    const input = wrapper.find('[data-testid="input"]');
    await input.setValue('Maksim');
    await input.trigger('blur');

    const icon = wrapper.findComponent(SvgMark);
    expect(icon.exists()).toBe(true);
  });

  it('renders danger icon when there is an error', async () => {
    const wrapper = mount(BaseInput, {
      props: { name: 'email', placeholder: 'Enter', error: 'Invalid email' },
    });

    await wrapper.setProps({ modelValue: '' });
    await wrapper.vm.$nextTick();

    const icon = wrapper.findComponent(SvgDanger);
    expect(icon.exists()).toBe(true);
  });
});
