@props(['type' => 'checkbox', 'label', 'checked' => false, 'fakeRadio' => false])

@php
  $attrs = [
      'type' => $type,
      'class' => 'peer hidden',
  ];

  if ($checked) {
      $attrs['checked'] = 'checked';
  }
@endphp

<label class="group/checkbox flex items-start gap-2.5 cursor-pointer">
  <input {!! $attributes->merge($attrs) !!}>
  <div
    class="relative w-[18px] min-w-[18px] h-[18px] border border-gray-500 group-hover/checkbox:border-gray-600 transition-brand
    select-none
    {{ $type === 'radio' || $fakeRadio
        ? 'rounded-full peer-checked:border-brand before:absolute before:top-1/2 before:left-1/2
        before:w-2 before:h-2 before:peer-checked:bg-brand before:rounded-full before:-translate-y-1/2 before:-translate-x-1/2'
        : 'rounded peer-checked:bg-brand' }}">
    @unless ($type !== 'checkbox' || $fakeRadio)
      <x-svg.check class="absolute top-1/2 left-1/2 w-2.5 text-white -translate-y-1/2 -translate-x-1/2" />
    @endunless
  </div>
  {{ $slot }}
</label>
