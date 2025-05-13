<script setup lang='ts'>
import { ref, useTemplateRef, watch, onMounted, onUnmounted, computed, nextTick } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: Array<number | null> | number;
    min: number;
    max: number;
    sliderWidth?: number;
    thumbWidth?: number;
    interval?: number;
    onVueInputChange?: boolean;
  }>(),
  {
    interval: 1,
  }
);

const emits = defineEmits(['update:modelValue']);

const sliderValue = ref<Array<number | null> | number>(0);
const isDragging = ref<boolean>(false);
const rangeSliderElement = useTemplateRef<HTMLInputElement>('range-slider');
const rangeSliderThumbElement = useTemplateRef<HTMLInputElement>('range-slider-thumb');
const sliderWidth = ref<number>(0);
const thumbPosition = ref<number | null>(null);
const thumbPositionSecond = ref<number | null>(null);
const targetThumbId = ref<string>('0');
const movementThumbsOnClick = ref<boolean>(false);
const durationTransitionThumbs = 200;

watch(() => props.modelValue, value => {
  if (JSON.stringify(value) !== JSON.stringify(sliderValue.value)) {
    movementThumbsOnClick.value = true;

    if (Array.isArray(props.modelValue)) {
      sliderValue.value = [...props.modelValue];
    } else {
      sliderValue.value = props.modelValue;
    }
    updateThumbPosition();

    setTimeout(() => {
      movementThumbsOnClick.value = false;
    }, durationTransitionThumbs);
  }
}, { deep: true });

onMounted(() => {
  if (rangeSliderElement.value) {
    sliderWidth.value = rangeSliderElement.value.clientWidth;

    const resizeObserver = new ResizeObserver(() => {
      sliderWidth.value = rangeSliderElement.value?.clientWidth || 0;
      updateThumbPosition();
    });

    resizeObserver.observe(rangeSliderElement.value);
    onUnmounted(() => resizeObserver.disconnect());
  }
});

const sliderTrackWidth = computed(() => {
  return props.sliderWidth ?? sliderWidth.value;
});

const sliderThumbWidth = computed(() => {
  return props.thumbWidth ?? (rangeSliderThumbElement.value?.clientWidth || 0);
});

const numberEntryPoints = computed(() => {
  return props.max - props.min;
});

const isDoubleThumbs = computed(() => {
  return Array.isArray(props.modelValue);
});

const calculateThumbPosition = (value: number) => {
  const sliderThumbWidthPercentage = (sliderThumbWidth.value / 2) * 100 / sliderTrackWidth.value;
  return ((value - props.min) / numberEntryPoints.value) * sliderTrackWidth.value * 100 / sliderTrackWidth.value - sliderThumbWidthPercentage;
};

const updateThumbPosition = () => {
  if (Array.isArray(props.modelValue)) {
    thumbPosition.value = calculateThumbPosition(props.modelValue[0] ?? props.min);
    thumbPositionSecond.value = calculateThumbPosition(props.modelValue[1] ?? props.max);
  } else {
    thumbPosition.value = calculateThumbPosition(props.modelValue);
  }
};

const startDrag = (event: MouseEvent | TouchEvent) => {
  targetThumbId.value = (event.target as HTMLElement).id;
  isDragging.value = true;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', onDrag);
  document.addEventListener('touchend', stopDrag);
};

const onDrag = (event: MouseEvent | TouchEvent) => {
  if (isDragging.value) {
    updateThumbPosition();
    updateValue(event);
  }
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', stopDrag);
};

const onClickSlider = (event: MouseEvent) => {
  const rect = (rangeSliderElement.value as HTMLElement).getBoundingClientRect();
  const positionOnClick = (event.clientX - rect.left) * 100 / sliderTrackWidth.value;
  const positionDisplacement = (event.clientX - rect.left - sliderThumbWidth.value / 2) * 100 / sliderTrackWidth.value;

  movementThumbsOnClick.value = true;

  if (Array.isArray(props.modelValue) && thumbPosition.value !== null && thumbPositionSecond.value !== null) {
    const distanceLeft = Math.abs(positionOnClick - thumbPosition.value);
    const distanceRight = Math.abs(positionOnClick - thumbPositionSecond.value);
    
    if (distanceLeft < distanceRight) {
      thumbPosition.value = positionDisplacement;
      targetThumbId.value = '0';
    } else {
      thumbPositionSecond.value = positionDisplacement;
      targetThumbId.value = '1';
    }
  } else {
    thumbPosition.value = positionDisplacement;
  }

  setTimeout(() => {
    movementThumbsOnClick.value = false;
  }, durationTransitionThumbs);
  updateValue(event);
};

const updateValue = (event: MouseEvent | TouchEvent) => {
  const rect = (rangeSliderElement.value as HTMLElement).getBoundingClientRect();
  const offsetX = event instanceof MouseEvent ? event.clientX - rect.left : event.touches[0].clientX - rect.left;
  const percentage = offsetX / sliderTrackWidth.value;

  const calculateValue = Math.round(Math.min(Math.max(percentage * (numberEntryPoints.value) + props.min, props.min), props.max) / props.interval) * props.interval;
  
  if (Array.isArray(props.modelValue)) {
    sliderValue.value = props.modelValue;

    if (targetThumbId.value === '0') {
      if (props.modelValue[1] === null || props.modelValue[1] !== null && calculateValue < props.modelValue[1]) {
        sliderValue.value[0] = calculateValue;
      }
    } else if (targetThumbId.value === '1') {
      if (props.modelValue[0] === null || props.modelValue[0] !== null && calculateValue > props.modelValue[0]) {
        sliderValue.value[1] = calculateValue;
      }
    }
    emits('update:modelValue', [...sliderValue.value]);
  } else {
    sliderValue.value = calculateValue;
    emits('update:modelValue', sliderValue.value);
  }
  
  if (props.onVueInputChange && window.onVueInputChange) {
    window.onVueInputChange(rangeSliderElement.value);
  }
};
</script>

<template>
  <div
    ref="range-slider"
    class="range-slider"
    :class="{ 'range-slider_movement-thumbs': movementThumbsOnClick }"
    @mousedown.stop="startDrag"
    @touchstart.stop="startDrag"
    @click.stop="onClickSlider"
  >
    <div
      class="range-slider__track"
      :style="{ width: sliderTrackWidth + 'px' }"
    >
    </div>
    <div
      id="0"
      ref="range-slider-thumb"
      class="range-slider__thumb-wrapper"
      :style="{ left: thumbPosition + '%' }"
    >
      <div
        v-show="thumbPosition !== null"
        class="range-slider__thumb"
      ></div>
    </div>

    <div
      id="1"
      class="range-slider__thumb-wrapper"
      :style="{ left: thumbPositionSecond + '%' }"
    >
      <div
        v-if="thumbPositionSecond !== null"
        class="range-slider__thumb"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.range-slider {
  @apply relative h-1.5 rounded-[3px] bg-gray-700 cursor-pointer select-none;

  &_movement-thumbs {
    .range-slider__thumb-wrapper {
      transition: left .2s ease-in-out;
    }
  }

  &__track {
    @apply relative h-full bg-brand select-none
    before:absolute before:top-0 before:-left-3 before:w-6 before:h-full before:rounded-l-[3px] before:bg-brand
    after:absolute after:top-0 after:-right-3 after:w-6 after:h-full after:rounded-r-[3px] after:bg-brand;
  }

  &__thumb-wrapper {
    @apply absolute top-1/2 w-6 h-6 -translate-y-1/2 select-none;
  }

  &__thumb {
    @apply w-full h-full border-2 border-brand rounded-full bg-white cursor-pointer select-none box-border pointer-events-none;
  }
}
</style>
