@extends('layouts.default')
@section('title', 'Shop Artistic Supplies - ArtiVana Collection')

@section('content')
  <section class="section">
    <div class="container">
      @include('components.breadcrumbs')

      <h1 class="like-h1">{{ $subsubcategory->getName() }}</h1>

      <x-filter.view
        :products="$paginatedProducts"
        :filters="$filters"
        :hasFilters="$hasFilters"
        :sort="$sort"
        :compareProducts="$compareProducts"
        :subcategory="$subcategory"
        :subsubcategory="$subsubcategory"
        :cookieCategoryFilters="$cookieCategoryFilters" />
    </div>
  </section>
@stop
