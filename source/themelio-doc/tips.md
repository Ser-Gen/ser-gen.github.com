## ХТМЛ

// Не используйте слово `banner` в имени изображения баннера, если хотите избежать его блокирования адблоком.

[СВГ в ПНГ](http://www.fileformat.info/convert/image/svg2raster.htm)


## ЦСС

// Используя фоновое изображение для оформления элемента, старайтесь ограничивать элемент в размерах, чтобы можно было использовать склеенные изображения.

// Стили для неактивной кнопки нужно указывать после кнопок всех цветов, при этом специфичность селектора должна быть одинаковой.

[Вместо input для кнопок лучше использовать button](http://stackoverflow.com/a/14017782).

// Если кнопка неактивна, пиктограмма тоже должна стать такой

```css
.btn.disabled .icon {
  opacity: .5;
}
```

// Для нормального скругления углов по кругу можно применять `1em`

// Маргин сдвигает элемент в ту сторону, откуда он спозиционирован

// Проблема в ИЕ10 с очень жирным шрифтом, нужно [тоньше настраивать жирность шрифта](http://stackoverflow.com/a/12165315)

// Проверять верстку в ИЕ лучше и в режиме совместимости, и в ИЕТестере; в нескольких случаях ИЕТестер оказался правдивей.

// Чтобы работал транзишн у элементов, которые должны изначально быть скрыты, скрывать такие элементы не при помощи `display: none`, а `visibility: hidden`.

[Информация](https://twitter.com/banzalik/status/399861318087622656)   
[Обрезание многострочного текста](http://css-tricks.com/line-clampin/)   
[Как оказалось, оно старое](http://dropshado.ws/post/1015351370/webkit-line-clamp)   
[Обрезка многострочного текста подробно](http://css-tricks.com/line-clampin/)   
[Ещё несколько способов](http://www.css-101.org/articles/line-clamp/line-clamp_for_non_webkit-based_browsers.php)   

```css
.webkit-multiline-overflow-ellipsis {
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```


## ДЖС

// Обмениваться данными между вкладками можно при помощи локалСтораге

// [Как получить тип инпута в джКуери](http://stackoverflow.com/a/3165569).

// В джКуери не так просто менять тип поля для пароля, [поэтому](http://stackoverflow.com/questions/1544317/jquery-change-type-of-input-field)

// [Эквиваленты джКуери в ДЖС](http://codepen.io/HugoGiraudel/pen/Lvodz).

// [Найти порядковый номер кликнутого элемента](http://stackoverflow.com/a/1188774)

// [Получить элемент из объекта джКуери](http://stackoverflow.com/a/1677910)

// [Скорость работы цсс джКуери и стайл ДЖС](http://jsperf.com/style-versus-jquery-css/8)

// [Функции анимации](https://github.com/danro/jquery-easing/blob/master/jquery.easing.js)
