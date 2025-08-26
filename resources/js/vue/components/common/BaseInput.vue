<script setup lang='ts'>
import { ref, watch, useTemplateRef, computed, markRaw, nextTick } from 'vue';
import priceFormat from '@js/utils/price-format';
import SvgMark from '@components/svg/Mark.vue';
import SvgDanger from '@components/svg/Danger.vue';
import { DefineComponent } from 'vue';

interface IMessageInput {
  error: {
    description: string | undefined;
    color: string;
    icon: DefineComponent;
  };
  successful: {
    description: string;
    color: string;
    icon: DefineComponent;
  };
}

const props = withDefaults(
  defineProps<{
    type?: string;
    inputmode?: string;
    format?: string;
    disabled?: boolean;
    name: string;
    label?: string;
    placeholder: string;
    suffix?: string;
    extraLabel?: string | boolean;
    error?: string;
    autocomplete?: string;
    inputClasses?: string;
  }>(),
  {
    type: 'text',
    inputmode: 'text',
  },
);

const emits = defineEmits(['change-value']);

const model = defineModel<string | number | null>();
const inputValue = ref<string | null>(null);
const inputElement = useTemplateRef<HTMLInputElement>('input');
const isFocusInput = ref<boolean>(false);
const showMessage = ref<IMessageInput['error'] | IMessageInput['successful'] | null>();
const defaultMaskPhone = '+7 (___) ___-__-__';
const message = ref<IMessageInput>({
  error: {
    description: props.error ?? '',
    color: 'input_red',
    icon: markRaw(SvgDanger),
  },
  successful: {
    description: '',
    color: 'input_green',
    icon: markRaw(SvgMark),
  },
});

watch(
  () => model.value,
  value => {
    init();
  },
);

watch([() => props.error, () => model.value], () => {
  if (props.error !== undefined) {
    if (!isFocusInput.value && props.error) {
      message.value.error.description = props.error;
      showMessage.value = message.value.error;
    } else if (!isFocusInput.value && inputValue.value) {
      showMessage.value = message.value.successful;
    } else {
      showMessage.value = null;
    }
  }
});

const isNumberFormating = computed(() => {
  return props.format === 'price';
});

const init = () => {
  if (model.value === null) {
    inputValue.value = model.value;
    return;
  }

  let newValue;

  if (isNumberFormating.value) {
    newValue = priceFormat(String(model.value));
  } else {
    newValue = String(model.value);
  }
  if (props.suffix) {
    newValue += props.suffix;
  }
  inputValue.value = newValue;
};
init();

const transformInputValue = (rule: RegExp, max?: number): string | null => {
  const matchedValues = inputValue.value?.match(rule) || [];
  const newValue = matchedValues.join('').slice(0, max ?? 50);

  return newValue.length > 0 ? newValue : null;
};

const countSpacesBeforeIndex = (value: string, index: number): number => {
  return (value.substring(0, index).match(/\s/g) || []).length;
};

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const carriagePosition = target.selectionStart;

  message.value.error.description = '';

  if (isNumberFormating.value) {
    const rule = /\d/g;
    const result = transformInputValue(rule, 8);
    const oldValue = inputValue.value;

    inputValue.value = priceFormat(result);

    const newValue = inputValue.value;

    nextTick(() => {
      if (oldValue && newValue && carriagePosition !== null) {
        const oldSpaces = countSpacesBeforeIndex(oldValue, carriagePosition);
        const newSpaces = countSpacesBeforeIndex(newValue, carriagePosition);

        if (oldSpaces !== newSpaces) {
          const adjustment = oldSpaces > newSpaces ? -1 : 1;
          target.setSelectionRange(carriagePosition + adjustment, carriagePosition + adjustment);
        } else {
          target.setSelectionRange(carriagePosition, carriagePosition);
        }
      }
    });
  } else if (props.format === 'name') {
    const rule = /[а-яА-ЯЁёa-zA-Z\s]/g;
    const oldValue = inputValue.value;

    inputValue.value = transformInputValue(rule, 40);

    const newValue = inputValue.value;
    nextTick(() => {
      if (oldValue && newValue && carriagePosition !== null && oldValue !== newValue) {
        target.setSelectionRange(carriagePosition - 1, carriagePosition - 1);
      }
    });
  } else if (props.format === 'email') {
    const rule = /[\da-z\-_@.]/gi;
    inputValue.value = transformInputValue(rule, 40);
  } else if (props.format === 'phone') {
    const rule = /\d/g;
    const result = transformInputValue(rule, 11)?.slice(1) ?? '';
    let numIndex = 0;

    inputValue.value = defaultMaskPhone.replace(/_/g, () => {
      return numIndex < result.length ? result[numIndex++] : '_';
    });

    nextTick(() => {
      const underscoreIndex = inputValue.value?.indexOf('_') ?? 0;
      target.setSelectionRange(underscoreIndex, underscoreIndex);
    });
  } else {
    const rule = /[^@#$%^&*()_+={}\[\]|\\:;"'<>?\/!]/g;
    inputValue.value = transformInputValue(rule, 100);
  }
};

const onKeydownInput = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    (event.target as HTMLInputElement).blur();
  }

  if ((props.format === 'phone' && event.key === 'Backspace') || event.key === 'Delete') {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const carriagePosition = target.selectionStart;

    if (carriagePosition !== null && inputValue.value) {
      let targetIndex: number = 0;
      if (event.key === 'Backspace') {
        targetIndex = carriagePosition - 1;
      } else if (event.key === 'Delete') {
        targetIndex = carriagePosition;
      }

      const setInputValueWithCarriage = (index: number) => {
        if (inputValue.value) {
          inputValue.value = inputValue.value.slice(0, index) + '_' + inputValue.value.slice(index + 1);
          nextTick(() => {
            target.setSelectionRange(index, index);
          });
        }
      };

      if (inputValue.value[targetIndex] === defaultMaskPhone[targetIndex]) {
        for (let i = targetIndex - 1; i >= 0; i--) {
          if (inputValue.value[i] !== defaultMaskPhone[i]) {
            setInputValueWithCarriage(i);
            return;
          }
        }
      } else {
        setInputValueWithCarriage(targetIndex);
      }
    }
  }
};

const onFocusInput = () => {
  if (inputValue.value && props.suffix) {
    inputValue.value = inputValue.value.replace(props.suffix, '');
  }

  isFocusInput.value = true;
};

const onBlurInput = () => {
  if (props.format === 'phone' && inputValue.value === defaultMaskPhone) {
    inputValue.value = null;
  }

  if (inputValue.value) {
    let newValue: string | null;

    if (isNumberFormating.value) {
      model.value = Number(inputValue.value.replace(/\s/g, ''));
    } else {
      model.value = inputValue.value;
    }
    nextTick(() => {
      emits('change-value');
    });

    newValue = inputValue.value;
    if (props.suffix) {
      newValue += props.suffix;
    }
    inputValue.value = newValue;
  } else {
    model.value = inputValue.value;
    emits('change-value');
  }
  isFocusInput.value = false;
};

const onClickInput = (event: Event) => {
  if (props.format === 'phone' && isFocusInput.value) {
    const target = event.target as HTMLInputElement;
    if (!inputValue.value) {
      inputValue.value = defaultMaskPhone;
    }

    nextTick(() => {
      let carriagePosition = target.selectionStart;

      if (inputValue.value && carriagePosition !== null && inputValue.value[carriagePosition] === defaultMaskPhone[carriagePosition]) {
        carriagePosition = inputValue.value?.indexOf('_') ?? defaultMaskPhone.indexOf('_');
        target.setSelectionRange(carriagePosition, carriagePosition);
      }
    });
  }
};
</script>

<template>
  <div
    class="relative flex flex-col w-full"
    :class="{ 'opacity-70 pointer-events-none': disabled }"
  >
    <label
      v-if="label"
      data-testid="label"
      class="mb-0.5 leading-6"
    >{{ label }}</label>

    <div
      class="relative"
      :class="{ '': extraLabel && inputValue }"
    >
      <div
        v-if="extraLabel"
        class="absolute left-4 text-sm text-gray-600 transition-all pointer-events-none"
        :class="[extraLabel && inputValue ? 'top-0.5 opacity-100': 'top-3 opacity-0']"
      >
        {{ extraLabel.length ? extraLabel : placeholder }}
      </div>

      <input
        ref="input"
        v-model="inputValue"
        :type="type"
        :inputmode="inputmode"
        :disabled="disabled"
        :name="name"
        :placeholder="placeholder"
        v-bind="autocomplete ? { autocomplete } : {}"
        data-testid="input"
        class="w-full px-3 py-2 text-gray-900 border border-gray-500 rounded-md bg-gray-200 transition-all duration-200 ease-in-out
        hover:border-gray-700 focus:border-brand focus:shadow-brand-light placeholder-gray-600"
        :class="[
          { 'pl-4 pt-4 pb-0': extraLabel && inputValue, 'pr-8': showMessage },
          inputClasses
        ]"
        @input="onChange"
        @keydown="onKeydownInput"
        @focus="onFocusInput"
        @blur="onBlurInput"
        @click="onClickInput"
      />

      <div
        v-if="showMessage"
        class="absolute top-1/2 right-2.5 w-4 h-4 -translate-y-1/2"
      >
        <component :is="showMessage.icon" />
      </div>
    </div>

    <div
      v-if="showMessage"
      data-testid="error-message"
      class="absolute bottom-[-19px] left-0 text-[13px] text-red-700"
    >
      {{ showMessage?.description }}
    </div>
  </div>
</template>

