@props([
    'sort',
    'filters',
    'hasFilters',
    'products',
    'compareProducts',
    'subcategory' => null,
    'subsubcategory' => null,
    'cookieCategoryFilters',
])

<div class="lg:flex">
  <x-filter.filtration
    :filters="$filters"
    :hasFilters="$hasFilters"
    :compareProducts="$compareProducts"
    :products="$products"
    :subcategory="$subcategory"
    :subsubcategory="$subsubcategory"
    :cookieCategoryFilters="$cookieCategoryFilters" />
  <div class="lg:w-[calc(100%-324px)]">
    <x-filter.heading :sort="$sort" :products="$products" />

    <x-filter.list :products="$products" />

    @if ($products->hasPages())
      <div class="m-auto my-6">
        {{ $products->links('components.filter.pagination') }}
      </div>
    @endif
  </div>
</div>
