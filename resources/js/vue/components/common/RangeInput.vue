<script setup lang='ts'>
import { ref, useTemplateRef, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import priceFormat from '@js/utils/price-format';
import BaseInput from '@components/common/BaseInput.vue';
import RangeSlider from '@components/common/RangeSlider.vue';

const props = defineProps<{
  modelValue: Array<number | null>;
  names: Array<string>;
  min: number;
  max: number;
  suffix: string;
  format: string;
  placeholder?: string;
  formClass?: string;
  isOpenSlider?: boolean;
}>();

const emits = defineEmits(['change-value', 'update:modelMin', 'update:modelMax']);

const model = ref<Array<number | null>>(props.modelValue);
const originalModelValue = ref<Array<number | null>>([...props.modelValue]);
const modelMin = ref<number | null>(null);
const modelMax = ref<number | null>(null);
const sliderValue = ref<Array<number | null>>([props.modelValue[0], props.modelValue[1]]);
const rangeInputElement = useTemplateRef<HTMLInputElement>('range-input');
const isOpen = ref<boolean>(props.isOpenSlider ?? false);
let resizeTimer: ReturnType<typeof setTimeout>;

watch(() => sliderValue.value, value => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    model.value[0] = value[0];
    model.value[1] = value[1];
    emits('update:modelMax', value[1]);
    emits('change-value');
    
    if (props.formClass) {
      nextTick(() => {
        const form = document.querySelector(`.${props.formClass}`);
        form?.dispatchEvent(new Event('change'));
      });
    }
  }, 300);
}, { deep: true });

watch(() => props.modelValue, value => {
  sliderValue.value = value;
});

watch(() => props.min, value => {
  if(props.modelValue[0] !== null) {
    sliderValue.value[0] = value;
  }
});

watch(() => props.max, value => {
  if(props.modelValue[1] !== null) {
    sliderValue.value[1] = value;
  }
});

watch(() => modelMin.value, value => {
  model.value[0] = value;
  sliderValue.value[0] = value;
});

watch(() => modelMax.value, value => {
  model.value[1] = value;
  sliderValue.value[1] = value;
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  window.updateRangeValue = () => {
    model.value = [...originalModelValue.value];
    sliderValue.value = [...originalModelValue.value];
  };
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event: Event) => {
  if (!props.isOpenSlider && rangeInputElement.value &&!rangeInputElement.value.contains(event.target as HTMLElement)) {
    isOpen.value = false;
  }
};

const onClickToOpen = () => {
  isOpen.value = true;
};

const changeValue = (type: string) => {
  let min = model.value[0];
  let max = model.value[1];
  if (min !== null && min < props.min) {
    min = props.min;
  } else if (min !== null && min > props.max) {
    min = max || props.max;
  } else if (min !== null && max !== null && min > max && type === 'min') {
    max = min;
  }

  if (max !== null && max > props.max) {
    max = props.max;
  } else if (max !== null && max < props.min) {
    max = min || props.min;
  } else if (min !== null && max !== null && max < min && type === 'max') {
    min = max;
  }

  model.value = [min, max];
  sliderValue.value = [min, max];

  emits('update:modelMin', model.value[0]);
  emits('update:modelMax', model.value[1]);
  emits('change-value');
};
</script>

<template>
  <div
    ref="range-input"
    class="w-full"
    @click="onClickToOpen"
  >
    <div class="flex items-center gap-0.5 mb-4">
      <base-input
        v-model="model[0]"
        :format="format"
        :name="names[0]"
        inputmode="numeric"
        :extra-label="`${placeholder} from`"
        :suffix="suffix"
        :placeholder="min ? `from ${priceFormat(min)} ₽` : ''"
        autocomplete="off"
        @change-value="changeValue('min')"
      />

      <div class="w-5 h-px bg-gray-700"></div>

      <base-input
        v-model="model[1]"
        :format="format"
        :name="names[1]"
        inputmode="numeric"
        :extra-label="`${placeholder} to`"
        :suffix="suffix"
        :placeholder="max ? `to ${priceFormat(max)} ₽` : ''"
        autocomplete="off"
        @change-value="changeValue('max')"
      />
    </div>
  
    <div
      v-if="isOpen"
      class="px-3 my-2.5"
    >
      <range-slider
        v-model="sliderValue"
        :min="min"
        :max="max"
        on-vue-input-change
      />
    </div>
  </div>
</template>
