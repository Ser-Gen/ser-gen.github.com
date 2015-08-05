---
layout: post
title: Сравнение способов именования сущностей
categories: 
  - dev
published: true
---

### [БЭМ](http://bem.info/)
Особенности:
- в БЭМ применяется префикс для определения блока — `b-` (необязательно; использовать при наличии старой, сделанной по другой методологии вёрстки);
- слова в названии блока разделяются `-`, элементы отделяются от блока `__`, модификаторы — `_`;
- модификаторы указываются в формате `элемент_ключ_значение`.

```html
<!-- БЭМ с префиксом -->
<div class="b-action b-action_small">
  <h2 class="b-action__header"></h2>
  <ul class="b-action-list">
    <div class="b-action-list__item b-action-list__item_over"></div>
  </ul>
</div>

<!-- и без -->
<div class="action action_small">
  <h2 class="action__header"></h2>
  <ul class="action-list">
    <div class="action-list__item action-list__item_over"></div>
  </ul>
</div>
```

### [МЦСС](http://operatino.github.io/MCSS/)
Особенности:
- при именовании блок указывается обычным словом, модификатору спереди приписывается знак `__` (чтобы не указывать `.action-list_item__over` вместе с обычным `.action-list_item`);
- при составлении имени сущности также используются знаки `-`, и `_`;
- в современной версии (03.2014) применяются те же разделители, что и в БЭМ.

```html
<!-- МЦСС -->
<div class="action __small">
  <h2 class="action_header"></h2>
  <ul class="action-list">
    <li class="action-list_item __over"></li>
  </ul>
</div>
```

### Фундамент
Есть много способов делать классы уникальными.

В БЭМ для обозначения блока используется префикс `b-`.

[Николас Галлахер](http://nicolasgallagher.com/) иногда пишет название блока с большой буквы. [Гарри Робертс](http://csswizardry.com/) [предлагает](http://csswizardry.com/2013/05/hashed-classes-in-css/) использовать для такого уточнения использовать символ идентификатора — `#`.

Меня не устраивал префикс своей бессмысленностью: приходилось писать лишние символы у каждого класса, чтобы отделить новую вёрстку от старой. Если все классы пишутся с `b-`, этот префикс напоминает аппендикс.

Элемент наследует имя блока: `Block__elem`.

Для модификаторов был выбран способ написания из одного слова (`.mod`), когда большая специфичность не критична. В селекторах ЦСС они должны указываться вместе с модифицируемым элементом. В **абстрактных блоках**, во избежание пересечений при объединениях, модификатор также наследует имя блока — `.Block--mod`.

В то же время, отличать блоки от модификаторов как-то нужно, а [классы чувствительны к регистру](https://developer.mozilla.org/en-US/docs/Case_Sensitivity_in_class_and_id_Names), поэтому было решено использовать первую букву класса блока в верхнем регистре. Таким образом, появилась возможность и отделить «старую» вёрстку от «новой» и выделить наименование блока.

Особенности:
- для отдельных сущностей используется преображённый верблюжийСтиль;
- класс блока выделяется заглавной буквой, модификатор с маленькой, чтобы они не могли совпасть.

```html
<!-- Фундамент -->
<div class="Action small">
  <h2 class="Action__header"></h2>
  <ul class="ActionList">
    <li class="ActionList__item over"></li>
  </ul>
</div>
```