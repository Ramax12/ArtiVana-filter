@if ($paginator->hasPages())
  <nav
    role="navigation"
    class="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 text-sm sm:text-base leading-6 sm:leading-7">
    @foreach ($elements as $element)
      @if (is_string($element))
        <span
          class="w-[34px] sm:w-[42px] py-1 sm:py-1.5 text-center border border-gray-400 rounded-md bg-white shadow-gray-light
          hover:border-gray-600 cursor-default">
          {{ $element }}
        </span>
      @endif

      @if (is_array($element))
        @foreach ($element as $page => $url)
          @if ($page == $paginator->currentPage())
            <span
              class="w-[34px] sm:w-[42px] py-1 sm:py-1.5 text-center text-brand border border-brand rounded-md bg-white
                shadow-gray-light cursor-default">
              {{ $page }}
            </span>
          @else
            <a href="{{ $url }}"
              class="w-[34px] sm:w-[42px] py-1 sm:py-1.5 text-center border border-gray-400 rounded-md bg-white shadow-gray-light
              hover:border-gray-600 cursor-pointer transition-brand">
              {{ $page }}
            </a>
          @endif
        @endforeach
      @endif
    @endforeach
  </nav>
@endif
