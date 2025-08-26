# ArtiVana · Frontend Snippets

Выборочные фрагменты фронтенд-кода проекта **ArtiVana** — интерактивного каталога товаров с фильтрацией, сортировкой и витринной логикой.

## 📦 Что включено

- Логика управления фильтрами:
  - добавление и удаление фильтров;
  - сброс всех фильтров;
  - отображение активных фильтров;
- Обработка сортировки (по цене, дате, алфавиту и др.);
- Обновление фасетной сетки фильтров при изменении параметров;
- Кнопка `Show items`, появляющаяся при изменении фильтров;
- Компонент **range-slider** на Vue 3 для выбора диапазона цен;
- Юнит-тесты для TypeScript-модулей и Vue-компонентов (**Vitest, Vue Test Utils**).
- Blade-шаблоны и TypeScript-функции для интерфейса фильтрации.

## ⚙️ Как работает фильтрация

- При изменении фильтров в интерфейсе формируются **GET-параметры** и происходит **перезагрузка страницы**.
- Обработка фильтрации и сортировки выполняется **на стороне бэкенда** (бэкенд не включён в репозиторий).
- Дополнительно выполняется **запрос на обновлённую фасетную сетку**, чтобы отразить актуальные значения фильтров.
- После выбора фильтров пользователь может нажать кнопку `Show items`, которая добавляет параметры в URL и инициирует перезагрузку страницы.


## 🚫 Что исключено

- Компоненты карточек товаров (product card);
- Логика отображения товаров;
- Бэкенд и обработка данных на сервере;
- Общая структура сайта, layout и навигация.

## 🎯 Цель

Показать подход к построению фильтрации без базы данных, с хранением данных в JSON-файлах, с использованием Blade и TypeScript. Vue 3 используется минимально — только для реализации диапазонного слайдера.

---

> Код выложен исключительно в ознакомительных целях.


## 📁 Структура репозитория

### 🧩 JavaScript / TypeScript

| Файл | Описание |
|------|----------|
| `js/features/filter/fetch-filter-meta.ts` | Отправка запроса на бэкенд с текущими фильтрами, получение актуальной фасетной сетки |
| `js/features/filter/fetch-filter-meta.test.ts` | Тесты логики fetch-filter-meta.ts |
| `js/features/filter/rendering-filters.ts` | Заменяет старые фильтры на новые после получения обновлений |
| `js/features/filter/rendering-filters.test.ts` | Тесты логики rendering-filters.ts |
| `js/modules/filter/filtration.ts` | Основная логика фильтрации: управление фильтрами, их отображение и реакция на изменения |
| → `createShowProductsElement` | Создаёт кнопку "Show items" |
| → `addSelectedFilters` | Добавляет выбранные фильтры в интерфейс |
| → `addFilterElement` | Генерирует HTML-элемент одного фильтра |
| → `updateFilters` | Обновляет состояние фильтров при изменениях |
| → `areFiltersReset` | Проверяет, сброшены ли все фильтры |
| → `handleFilterChange` | Обрабатывает изменение конкретного фильтра |
| `js/modules/filter/filtration.test.ts` | Тесты логики фильтрации filtration.ts |
| `js/modules/filter/reset-filters.ts` | Сброс одного или всех активных фильтров |
| `js/modules/filter/reset-filters.test.ts` | Тесты reset-filters.ts |
| `js/modules/filter/show-more.ts` | Логика "Показать ещё" для фильтров с большим числом значений |
| `js/modules/filter/show-more.test.ts` | Тесты show-more.ts |
| `js/modules/filter/sorting.ts` | Управление сортировкой: открытие списка, выбор, добавление в GET-параметры и перезагрузка |
| `js/modules/filter/sorting.test.ts` | Тесты sorting.ts |
| `js/utils/price-format.ts` | Форматирует число как цену |
| `js/utils/price-format.test.ts` | Тесты price-format.ts |
| `js/utils/update-url-params.ts` | Создаёт и обновляет параметры в URL |
| `js/utils/update-url-params.test.ts` | Тесты update-url-params.ts |
| `js/typescript/interfaces.ts` | Интерфейсы для моделей данных, используемых в фильтрах, товарах и компонентах |
| `js/typescript/types.ts` | Типы TypeScript для проекта |

---

### 🧱 Vue 3 (Range Slider)

| Файл | Описание |
|------|----------|
| `js/vue/components/common/BaseInput.vue` | Базовый компонент для инпутов |
| `js/vue/components/common/BaseInput.test.ts` | Тесты BaseInput.vue |
| `js/vue/components/common/RangeInput.vue` | Инпут с ручным вводом диапазона |
| `js/vue/components/common/RangeInput.test.ts` | Тесты RangeInput.vue |
| `js/vue/components/common/RangeSlider.vue` | Полноценный Vue 3-компонент диапазонного слайдера |
| `js/vue/components/common/RangeSlider.test.ts` | Тесты RangeSlider.vue |

---

### 🖼 Blade-шаблоны

| Файл | Описание |
|------|----------|
| `views/modules/catalog/subsubcategory.blade.php` | Основной шаблон страницы каталога |
| `views/components/filter/filters.blade.php` | Отображение фильтров |
| `views/components/filter/filtration.blade.php` | Обёртка фильтров с кнопкой "Show products" |
| `views/components/filter/heading.blade.php` | Обёртка фильтров и сортировки (десктоп и мобилка) |
| `views/components/filter/list.blade.php` | Секция для карточек товаров (без самих карточек) |
| `views/components/filter/pagination.blade.php` | Пагинация результатов каталога |
| `views/components/filter/selected-filters-popup.blade.php` | Выбранные фильтры (мобильная версия) |
| `views/components/filter/selected-filters.blade.php` | Выбранные фильтры (десктоп) |
| `views/components/filter/view.blade.php` | Общая обёртка для фильтров |
| `views/components/form/option-selector.blade.php` | Чекбокс или радиокнопка |
| `views/components/skeletons/range-input.blade.php` | Скелетон для загрузки диапазонного инпута |

---

> ⚠️ Обратите внимание: компоненты карточек товаров и серверная логика не включены в репозиторий.
