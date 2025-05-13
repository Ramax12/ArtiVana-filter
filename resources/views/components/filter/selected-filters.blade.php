@props(['filters', 'hasFilters'])

@if ($hasFilters)
  <div class="mb-5">
    <div class="flex justify-between items-center py-3 px-4 rounded-t-lg mb-1 shadow-gray-light bg-white">
      <div class="text-lg font-bold">Selected filters</div>
      <div class="js-filter-reset hover:text-brand-hover cursor-pointer transition-brand select-none">Clear all</div>
    </div>

    <div class="flex flex-wrap gap-2 py-3 px-4 rounded-b-lg shadow-gray-light bg-white">
      @if (!empty($filters['currentFilters']['subsubcategory']) && !empty($filters['subsubcategories']))
        <div
          class="flex items-center px-3 py-2 border border-gray-400 rounded-md bg-white hover:border-gray-600 transition-brand">
          <span class="text-sm">Department:
            {{ implode(
                ', ',
                array_map(
                    fn($id) => collect($filters['subsubcategories'] ?? [])->firstWhere('value', $id)['name'] ?? '',
                    $filters['currentFilters']['subsubcategory'] ?? [],
                ),
            ) }}
          </span>
          <div
            class="js-remove-filter relative text-4xl cursor-pointer leading-9 w-6 h-6 origin-center text-center ml-1
              before:absolute before:top-1/2 before:left-1/2 before:w-4 before:h-0.5 before:bg-gray-500 before:-translate-x-1/2
              before:-translate-y-1/2 before:-rotate-45 before:animation-rotate-minus
              after:absolute after:top-1/2 after:left-1/2 after:w-4 after:h-0.5 after:bg-gray-500 after:-translate-x-1/2
              after:-translate-y-1/2 after:rotate-45 after:animation-rotate-plus"
            data-filter="subsubcategory" data-value="{{ implode(',', $filters['currentFilters']['subsubcategory']) }}">
          </div>
        </div>
      @endif

      @if (!empty($filters['currentFilters']['min_price']) || !empty($filters['currentFilters']['max_price']))
        <div
          class="flex items-center px-3 py-2 border border-gray-400 rounded-md bg-white hover:border-gray-600 transition-brand">
          <span class="text-sm">Price:
            @if (!empty($filters['currentFilters']['min_price']) && empty($filters['currentFilters']['max_price']))
              from {{ number_format($filters['currentFilters']['min_price'], 0, '', ' ') }} ₽
            @elseif (empty($filters['currentFilters']['min_price']) && !empty($filters['currentFilters']['max_price']))
              to {{ number_format($filters['currentFilters']['max_price'], 0, '', ' ') }} ₽
            @else
              {{ number_format($filters['currentFilters']['min_price'], 0, '', ' ') }}
              ₽ –
              {{ number_format($filters['currentFilters']['max_price'], 0, '', ' ') }}
              ₽
            @endif
          </span>
          <div
            class="js-remove-filter relative text-4xl cursor-pointer leading-9 w-6 h-6 origin-center text-center ml-1
              before:absolute before:top-1/2 before:left-1/2 before:w-4 before:h-0.5 before:bg-gray-500 before:-translate-x-1/2
              before:-translate-y-1/2 before:-rotate-45 before:animation-rotate-minus
              after:absolute after:top-1/2 after:left-1/2 after:w-4 after:h-0.5 after:bg-gray-500 after:-translate-x-1/2
              after:-translate-y-1/2 after:rotate-45 after:animation-rotate-plus"
            data-filter="price"
            data-value="{{ json_encode([
                'min' => $filters['currentFilters']['min_price'],
                'max' => $filters['currentFilters']['max_price'],
            ]) }}">
          </div>
        </div>
      @endif

      @if (!empty($filters['currentFilters']['brand']))
        <div
          class="flex items-center px-3 py-2 border border-gray-400 rounded-md bg-white hover:border-gray-600 transition-brand">
          <span class="text-sm">Brand:
            {{ implode(', ', $filters['currentFilters']['brand']) }}
          </span>
          <div
            class="js-remove-filter relative text-4xl cursor-pointer leading-9 w-6 h-6 origin-center text-center ml-1
              before:absolute before:top-1/2 before:left-1/2 before:w-4 before:h-0.5 before:bg-gray-500 before:-translate-x-1/2
              before:-translate-y-1/2 before:-rotate-45 before:animation-rotate-minus
              after:absolute after:top-1/2 after:left-1/2 after:w-4 after:h-0.5 after:bg-gray-500 after:-translate-x-1/2
              after:-translate-y-1/2 after:rotate-45 after:animation-rotate-plus"
            data-filter="brand"
            data-value="{{ implode(',', $filters['currentFilters']['brand']) }}">
          </div>
        </div>
      @endif

      @if (!empty($filters['currentFilters']['rating']))
        <div
          class="flex items-center px-3 py-2 border border-gray-400 rounded-md bg-white hover:border-gray-600 transition-brand">
          <span class="text-sm">Rating: {{ $filters['currentFilters']['rating'] }}+ stars</span>
          <div
            class="js-remove-filter relative text-4xl cursor-pointer leading-9 w-6 h-6 origin-center text-center ml-1
              before:absolute before:top-1/2 before:left-1/2 before:w-4 before:h-0.5 before:bg-gray-500 before:-translate-x-1/2
              before:-translate-y-1/2 before:-rotate-45 before:animation-rotate-minus
              after:absolute after:top-1/2 after:left-1/2 after:w-4 after:h-0.5 after:bg-gray-500 after:-translate-x-1/2
              after:-translate-y-1/2 after:rotate-45 after:animation-rotate-plus"
            data-filter="rating"
            data-value="{{ $filters['currentFilters']['rating'] }}">
          </div>
        </div>
      @endif

      @php
        $selectedFilters = $filters['currentFilters']['characteristics'] ?? [];
      @endphp
      @if (!empty($selectedFilters))
        @foreach ($selectedFilters as $key => $values)
          @if (!empty($values))
            <div
              class="flex items-center px-3 py-2 border border-gray-400 rounded-md bg-white hover:border-gray-600 transition-brand">
              <span class="text-sm">
                {{ str_replace(' ', ' ', ucwords(str_replace('_', ' ', $key))) }}: {{ implode(', ', $values) }}
              </span>
              <div
                class="js-remove-filter relative text-4xl cursor-pointer leading-9 w-6 h-6 origin-center text-center ml-1
                  before:absolute before:top-1/2 before:left-1/2 before:w-4 before:h-0.5 before:bg-gray-500 before:-translate-x-1/2
                  before:-translate-y-1/2 before:-rotate-45 before:animation-rotate-minus
                  after:absolute after:top-1/2 after:left-1/2 after:w-4 after:h-0.5 after:bg-gray-500 after:-translate-x-1/2
                  after:-translate-y-1/2 after:rotate-45 after:animation-rotate-plus"
                data-filter="characteristics[{{ $key }}]"
                data-value="{{ implode(',', $values) }}">
              </div>
            </div>
          @endif
        @endforeach
      @endif
    </div>
  </div>
@endif
