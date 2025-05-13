@props([
    'filters',
    'isPopup' => false,
    'compareProducts',
    'products',
    'cookieCategoryFilters' => null,
    'subcategory' => null,
    'subsubcategory' => null,
])
@if (count($filters['subsubcategories'] ?? []))
  <div class="category js-category open shadow-gray-light mb-4">
    <div
      class="category__heading js-category-heading flex justify-between items-center py-3 px-4 rounded-lg mb-1 lg:hover:shadow-gray-hard
        no-hover-shadow bg-white cursor-pointer transition-brand select-none">
      <div class="font-bold select-text">Departments</div>
      <x-svg.chevron class="w-4 transition-brand" />
    </div>

    <div
      class="js-filter-list category__content py-3 flex-col items-start px-4 rounded-b-lg bg-white"
      data-subsubcategories='@json($filters['subsubcategories'] ?? [])'
      data-name-category="subsubcategories">
      @foreach ($filters['subsubcategories'] ?? [] as $subsub)
        <div
          class="relative mb-2.5 last:mb-0 {{ $isPopup ? 'js-filter-item-popup' : 'js-filter-item' }}
          {{ $subsub['count'] === 0 ? 'disabled' : '' }}">
          <x-form.option-selector
            name="subsubcategory[]"
            value="{{ $subsub['value'] }}"
            :checked="in_array($subsub['value'], $filters['currentFilters']['subsubcategory'] ?? [])">
            <div class="flex items-center -mt-0.5">
              <span class="js-filter-item-text text-[15px]">{{ $subsub['name'] }}</span>
              <span class="js-filter-item-count pl-0.5 text-xs text-gray-600 {{ $subsub['count'] ? '' : 'hidden' }}">
                ({{ $subsub['count'] }})
              </span>
            </div>
          </x-form.option-selector>
        </div>
      @endforeach
    </div>
  </div>
@endif

@if (count($products ?? []) > 0)
  <div class="category js-category open shadow-gray-light mb-4">
    <div
      class="category__heading js-category-heading flex justify-between items-center py-3 px-4 rounded-lg mb-1 lg:hover:shadow-gray-hard
        no-hover-shadow bg-white cursor-pointer transition-brand select-none">
      <div class="font-bold select-text">Price</div>
      <x-svg.chevron class="w-4 transition-brand" />
    </div>

    <div class="category__content py-3 px-4 rounded-b-lg bg-white">
      <div
        class="js-filter-item-price relative flex flex-col items-start w-full {{ $isPopup ? 'js-filter-item-popup' : 'js-filter-item' }}">
        <common-rangeinput
          :model-value='@json([$filters['currentFilters']['min_price'], $filters['currentFilters']['max_price']])'
          :names="['min_price', 'max_price']"
          :min='@json($filters['minPrice'])' :max='@json($filters['maxPrice'])' suffix=" ₽" format="price"
          placeholder="Price" form-class="js-filter" is-open-slider>
          <x-skeletons.range-input />
        </common-rangeinput>
      </div>
    </div>
  </div>
@endif

@if (count($filters['brands'] ?? []) > 1)
  <div class="category open js-category shadow-gray-light mb-4">
    <div
      class="category__heading js-category-heading flex justify-between items-center py-3 px-4 rounded-lg mb-1 lg:hover:shadow-gray-hard
        no-hover-shadow bg-white cursor-pointer transition-brand select-none">
      <div class="font-bold select-text">Brand</div>
      <x-svg.chevron class="w-4 transition-brand" />
    </div>

    <div
      class="js-filter-list category__content py-3 flex-col items-start px-4 rounded-b-lg bg-white"
      data-name-category="brands">
      @foreach ($filters['brands'] as $brand)
        <div
          class="relative mb-2.5 last:mb-0
          {{ $isPopup ? 'js-filter-item-popup' : 'js-filter-item' }}
          {{ $brand['count'] === 0 ? 'disabled' : '' }}
          {{ $loop->index >= 5 ? 'hidden' : '' }}">
          <x-form.option-selector
            name="brand[]"
            value="{{ $brand['name'] }}"
            :checked="in_array($brand['name'], $filters['currentFilters']['brand'] ?? [])">
            <div class="flex items-center -mt-0.5">
              <span class="js-filter-item-text text-[15px]">{{ $brand['name'] }}</span>
              <span class="js-filter-item-count pl-0.5 text-xs text-gray-600 {{ $brand['count'] ? '' : 'hidden' }}">
                ({{ $brand['count'] }})
              </span>
            </div>
          </x-form.option-selector>
        </div>
      @endforeach

      @if (count($filters['brands']) > 5)
        <div
          class="js-filter-show-more relative text-sm text-brand leading-4 mt-0.5 border-b border-dashed border-brand
            cursor-pointer hover:text-brand-hover hover:border-brand-hover transition-brand">
          <span class="js-filter-show-more-text">Show More</span>
          <span class="js-filter-show-more-count"> ({{ count($filters['brands']) - 5 }})</span>
        </div>
      @endif
    </div>
  </div>
@endif

@if (!empty($filters['rating']) && $filters['rating'] > 0)
  <div class="category js-category open shadow-gray-light mb-4">
    <div
      class="category__heading js-category-heading flex justify-between items-center py-3 px-4 rounded-lg mb-1 lg:hover:shadow-gray-hard
        no-hover-shadow bg-white cursor-pointer transition-brand select-none">
      <div class="font-bold select-text">Rating</div>
      <x-svg.chevron class="w-4 transition-brand" />
    </div>

    <div
      class="js-filter-list category__content py-3 flex-col items-start px-4 rounded-b-lg bg-white"
      data-name-category="rating">
      <div
        class="relative mb-2.5 last:mb-0 {{ $isPopup ? 'js-filter-item-popup' : 'js-filter-item' }}
          {{ $filters['rating'] === 0 ? 'disabled' : '' }}">
        <x-form.option-selector name="rating" value="4" :checked="request()->input('rating') == 4">
          <div class="text-[0]">
            <div class="flex text-[15px] leading-4 mt-0.5">
              <span>Highest rating</span>
              <span
                class="js-filter-item-count pl-0.5 text-xs text-gray-600 {{ $filters['rating'] ? '' : 'hidden' }}">
                ({{ $filters['rating'] }})
              </span>
            </div>
            <span class="text-xs text-gray-600">only 4 and 5</span>
          </div>
        </x-form.option-selector>
      </div>
    </div>
  </div>
@endif

@foreach ($filters['characteristics'] ?? [] as $key => $values)
  <div
    class="category js-category shadow-gray-light mb-4
        {{ in_array(
            ($subcategory?->id ? $subcategory->id . '-' : '') . ($subsubcategory?->id ? $subsubcategory->id . '-' : '') . $key,
            $cookieCategoryFilters ?? [],
        )
            ? 'open'
            : '' }}">
    <div
      class="category__heading js-category-heading flex justify-between items-center py-3 px-4 rounded-lg mb-1 lg:hover:shadow-gray-hard
        no-hover-shadow bg-white cursor-pointer transition-brand select-none"
      data-save-cookies="filters"
      data-name="{{ ($subcategory?->id ? $subcategory->id . '-' : '') . ($subsubcategory?->id ? $subsubcategory->id . '-' : '') . $key }}">
      <div class="font-bold select-text">{{ ucwords(str_replace('_', ' ', $key)) }}</div>
      <x-svg.chevron class="w-4 transition-brand" />
    </div>

    <div
      class="js-filter-list category__content py-3 flex-col items-start px-4 rounded-b-lg bg-white"
      data-name-category="{{ $key }}">
      @foreach ($values as $item)
        <div
          class="relative mb-2.5 last:mb-0
            {{ $isPopup ? 'js-filter-item-popup' : 'js-filter-item' }}
            {{ $item['count'] === 0 ? 'disabled' : '' }}
            {{ $loop->index >= 5 ? 'hidden' : '' }}">
          <x-form.option-selector name="characteristics[{{ $key }}][]" value="{{ $item['name'] }}"
            :checked="in_array($item['name'], (array) request()->input('characteristics.' . $key, []))">
            <div class="flex items-center -mt-0.5">
              <span class="js-filter-item-text text-[15px]">{{ $item['name'] }}</span>
              <span class="js-filter-item-count pl-0.5 text-xs text-gray-600 {{ $item['count'] ? '' : 'hidden' }}">
                ({{ $item['count'] }})
              </span>
            </div>
          </x-form.option-selector>
        </div>
      @endforeach

      @if (count($values) > 5)
        <div
          class="js-filter-show-more relative text-sm text-brand leading-4 mt-0.5 border-b border-dashed border-brand
            cursor-pointer hover:text-brand-hover hover:border-brand-hover transition-brand">
          <span class="js-filter-show-more-text">Show More</span>
          <span class="js-filter-show-more-count"> ({{ count($values) - 5 }})</span>
        </div>
      @endif
    </div>
  </div>
@endforeach

<a href="" class="js-show-products-main button button_violet w-full hidden">
  Show 0 products
</a>
