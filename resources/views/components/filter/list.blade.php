@props(['products'])

@if (count($products) > 0)
  <div class="js-filter-list xs:flex flex-wrap gap-3 sm:gap-4">
    @foreach ($products as $product)
      <x-card.view :product="$product" />
    @endforeach
  </div>
@else
  <p class="text-sm lg:text-xl">Poof! The products have vanished! Or maybe they just haven’t arrived yet. Stay tuned!</p>
@endif
