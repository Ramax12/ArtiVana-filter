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
| `resources/js/features/filter/fetch-filter-meta.ts` | Отправка запроса на бэкенд с текущими фильтрами, получение актуальной фасетной сетки |
| `resources/js/features/filter/rendering-filters.ts` | Заменяет старые фильтры на новые после получения обновлений |
| `resources/js/modules/filter/_filtration.ts` | Основная логика фильтрации: управление фильтрами, их отображение и реакция на изменения |
| → `createShowProductsElement` | Создаёт кнопку "Show items" |
| → `addSelectedFilters` | Добавляет выбранные фильтры в интерфейс |
| → `addFilterElement` | Генерирует HTML-элемент одного фильтра |
| → `updateFilters` | Обновляет состояние фильтров при изменениях |
| → `areFiltersReset` | Проверяет, сброшены ли все фильтры |
| → `handleFilterChange` | Обрабатывает изменение конкретного фильтра |
| `resources/js/modules/filter/_reset-filters.ts` | Сброс одного или всех активных фильтров |
| `resources/js/modules/filter/_show-more.ts` | Логика "Показать ещё" для фильтров с большим числом значений |
| `resources/js/modules/filter/_sorting.ts` | Управление сортировкой: открытие списка, выбор, добавление в GET-параметры и перезагрузка |
| `resources/js/utils/price-format.ts` | Форматирует число как цену |
| `resources/js/utils/update-url-params.ts` | Создаёт и обновляет параметры в URL |

---

### 🧱 Vue 3 (Range Slider)

| Файл | Описание |
|------|----------|
| `vue/components/common/BaseInput.vue` | Базовый компонент для инпутов |
| `vue/components/common/RangeInput.vue` | Инпут с ручным вводом диапазона |
| `vue/components/common/RangeSlider.vue` | Полноценный Vue 3-компонент диапазонного слайдера |

---

### 🖼 Blade-шаблоны

| Файл | Описание |
|------|----------|
| `resources/views/modules/catalog/subsubcategory.blade.php` | Основной шаблон страницы каталога |
| `resources/views/components/filter/filters.blade.php` | Отображение фильтров |
| `resources/views/components/filter/filtration.blade.php` | Обёртка фильтров с кнопкой "Show products" |
| `resources/views/components/filter/heading.blade.php` | Обёртка фильтров и сортировки (десктоп и мобилка) |
| `resources/views/components/filter/list.blade.php` | Секция для карточек товаров (без самих карточек) |
| `resources/views/components/filter/pagination.blade.php` | Пагинация результатов каталога |
| `resources/views/components/filter/selected-filters-popup.blade.php` | Выбранные фильтры (мобильная версия) |
| `resources/views/components/filter/selected-filters.blade.php` | Выбранные фильтры (десктоп) |
| `resources/views/components/filter/view.blade.php` | Общая обёртка для фильтров |
| `resources/views/components/form/option-selector.blade.php` | Чекбокс или радиокнопка |
| `resources/views/components/skeletons/range-input.blade.php` | Скелетон для загрузки диапазонного инпута |

---

> ⚠️ Обратите внимание: компоненты карточек товаров и серверная логика не включены в репозиторий.
