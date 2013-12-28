Семантика документа:

Теги
[Cтатьи по семантике](http://web-standards.ru/tag/semantic/)

[Семантика для роботов](http://noteskeeper.ru/994/)
[РДФа](https://support.google.com/webmasters/answer/146898?hl=ru)

Интерфейс — не содержимое.
Вёрстка интерфейса должна быть полной, чтобы быть легко модифицируемой, описанной во всех свои состояниях, не зависимой от окружения, не влияющей на другие элементы интерфейса.
Вёрстка содержимого же должна быть максимально семантичной, чтобы все его потребители могли распознать смысл, заложенный в нём. Конечно, сам объём распознавания зависит от возможностей потребителя.

Разметку любого документа всегда можно сделать при помощи `div` и `span`, но в этом случае теряется возможность указать на смысл, заложенный в содержимом документа, специальным программам, которые могут распознавать его и преподносить пользователям. Самыми популярными программами такого типа являются поисковые машины и обработчики для людей с ограниченными возможностями.

Есть несколько способов разметить содержимое более семантично:

- использовать теги в соответствии с их семантическим значением
- использовать дополнительную разметку, которой множество видов: микроформаты, микроданные, вайария, рдфа

Каждый из этих способов независим друг от друга.


Микроформаты
Микроданные
http://help.yandex.ru/webmaster/microformats/what-is-microformat.xml
http://help.yandex.ru/webmaster/hproduct/general.xml
http://help.yandex.ru/webmaster/schema-org/intro-schema-org.xml
http://microformats.org/wiki/hproduct
http://www.google.com/webmasters/tools/richsnippets
http://help.yandex.ru/webmaster/yandex-indexing/validator.xml
http://microformats.org/wiki/google-rich-snippets-examples

http://googlewebmastercentral.blogspot.ru/search/label/structured%20data
https://support.google.com/webmasters/topic/2774098?hl=en&ref_topic=2692946
https://support.google.com/webmasters/answer/2774358?hl=en&ref_topic=2774098
http://schema.org/Product


## Микроформаты

[Документация Яндекса](http://help.yandex.ru/webmaster/?id=1111670)
[Координаты фирмы](http://microformats.org/wiki/hcard)
[Генератор](http://microformats.org/code/hcard/creator)
[Поддерживаемые параметры](http://help.yandex.ru/webmaster/?id=1111574)
[Информация о товаре](http://help.yandex.ru/webmaster/?id=1113264)
[Поддерживаемые параметры](http://help.yandex.ru/webmaster/?id=1113265)
[Валидация микроразметки](http://webmaster.yandex.ru/microtest.xml)

Пример:

  <div id="" class="vcard">
    <div class="org">Самсон-опт</div>
    <a class="email" href="mailto:vrn@samsonopt.ru">vrn@samsonopt.ru</a>
    <div class="adr">
      <div class="street-address">ул. 45-й Стрелковой Дивизии, 261а </div>
      <span class="locality">Воронеж</span>, 
      <span class="postal-code">394026</span>
      <span class="country-name">Россия</span>
    </div>
    <div class="tel">
      (473) 242-58-11,
            242-58-12,
            242-58-13,
            242-58-14
    </div>
   </div>


Вайарию
