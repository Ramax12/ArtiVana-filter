@props([
    'filters',
    'hasFilters',
    'compareProducts',
    'products',
    'subcategory' => null,
    'subsubcategory' => null,
    'cookieCategoryFilters',
])

<form
  class="js-filter hidden lg:block w-80 min-w-80 mr-8"
  data-id-subcategory="{{ $subcategory->id }}"
  data-id-subsubcategory="{{ $subsubcategory?->id }}">
  <x-filter.selected-filters :filters="$filters" :hasFilters="$hasFilters" />

  <x-filter.filters
    :filters="$filters"
    :compareProducts="$compareProducts"
    :products="$products"
    :subcategory="$subcategory"
    :subsubcategory="$subsubcategory"
    :cookieCategoryFilters="$cookieCategoryFilters" />
</form>

<form
  class="js-filter-popup popup-mobile js-popup-mobile filter-popup z-50 fixed top-0 bottom-0 left-0 flex lg:hidden w-full bg-black/70">
  <div
    class="popup-mobile-inner js-popup-mobile-inner relative flex flex-col w-full h-5/6 rounded-t-xl mt-auto translate-y-0
    bg-gray-200 shadow-gray-hard">
    <div class="absolute top-3 left-1/2 block lg:hidden w-32 h-1 rounded-full -translate-x-1/2 bg-gray-600"></div>
    <div class="js-popup-mobile-top absolute top-0 left-0 right-0 h-16"></div>

    <div class="px-2.5 md:px-5 pt-9 md:pt-9 pb-1 text-xl font-bold">Filters</div>

    <div class="flex-shrink p-2.5 md:p-5 pt-4 md:pt-4 overflow-y-auto">
      <x-filter.selected-filters-popup />

      <x-filter.filters
        :filters="$filters"
        :isPopup="true"
        :products="$products"
        :subcategory="$subcategory"
        :subsubcategory="$subsubcategory"
        :cookieCategoryFilters="$cookieCategoryFilters" />
    </div>

  </div>
  <div
    class="filter-popup__button fixed bottom-0 w-full py-3 px-2.5 md:px-5 bg-white rounded-t-xl shadow-gray-light-reverse">
    <a href="" class="js-show-products-main-popup button button_violet w-full">
      Show 0 products
    </a>
  </div>
</form>
