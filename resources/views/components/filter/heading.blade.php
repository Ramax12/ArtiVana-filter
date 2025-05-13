@props(['sort', 'products'])

<div class="flex flex-col md:flex-row lg:justify-end gap-2 mb-3 lg:mb-5">
  <div class="flex flex-wrap lg:hidden gap-2">
    <div
      class="js-filter-button flex justify-between items-center px-3 py-2 border border-gray-400 rounded-md
        bg-white cursor-pointer hover:border-gray-600 transition-brand select-none">
      <x-svg.filters class="w-5 mr-2" />
      <span class="sort__name js-sort-name">Filters</span>
    </div>

    <div
      class="js-sorting-button flex justify-between items-center px-3 py-2 border border-gray-400 rounded-md
        bg-white cursor-pointer hover:border-gray-600 transition-brand select-none">
      <x-svg.sort class="w-5 mr-2 rotate-180" />
      <span class="sort__name js-sort-name">Sorting</span>
    </div>
  </div>

  <div class="ml-auto lg:ml-0 lg:mr-auto">
    {{ $products->links('components.filter.pagination') }}
  </div>

  <div class="sort js-sort relative hidden lg:flex w-44 select-none">
    <div
      class="sort__title js-sort-title z-30 relative flex justify-between items-center w-full px-3 py-2 border border-gray-500
        rounded-md cursor-pointer bg-white hover:border-gray-700 transition-brand">
      <span class="sort__name js-sort-name text-gray-900 mr-2 transition-brand" data-sort={{ $sort['value'] }}>
        {{ $sort['current'] }}
      </span>
      <x-svg.chevron class="w-3.5 text-gray-900 transition-brand" />
    </div>

    <div
      class="sort__list js-sort-list z-20 absolute top-full left-0 hidden w-full border border-t-0 border-gray-600
        rounded-b-md shadow-gray-hard bg-white">
      @foreach ($sort['options'] as $option)
        <div
          class="js-sort-item py-1 px-3 hover:bg-gray-400 transition-brand cursor-pointer
            {{ $sort['value'] === $option['value'] ? 'bg-gray-300' : '' }}"
          data-sort="{{ $option['value'] }}">
          {{ $option['name'] }}
        </div>
      @endforeach
    </div>
  </div>

  <div
    class="js-sort-popup popup-mobile js-popup-mobile z-50 fixed top-0 left-0 flex lg:hidden w-full h-full bg-black/70">
    <div
      class="popup-mobile-inner js-popup-mobile-inner relative flex flex-col justify-start w-full p-2.5 md:p-5 pt-9 md:pt-9 lg:pt-0
        mt-auto rounded-t-xl translate-y-0 overflow-auto bg-gray-200 shadow-gray-hard">
      <div class="absolute top-3 left-1/2 w-32 h-1 rounded-full -translate-x-1/2 bg-gray-600"></div>
      <div class="js-popup-mobile-top absolute top-0 left-0 right-0 h-16"></div>

      <div class="py-3 px-4 rounded-t-lg mb-1 shadow-gray-light bg-white">
        <div class="text-lg">Sort by</div>
      </div>

      <form class="js-sort-form py-3 px-4 rounded-b-lg shadow-gray-light bg-white">
        @foreach ($sort['options'] as $option)
          <div class="mb-2.5 last:mb-0">
            <x-form.option-selector
              name="sort"
              value="{{ $option['value'] }}"
              :checked="$sort['value'] === $option['value']"
              :fakeRadio="true">
              <span class="text-[15px] -mt-0.5">{{ $option['name'] }}</span>
            </x-form.option-selector>
          </div>
        @endforeach
      </form>
    </div>
  </div>
</div>
