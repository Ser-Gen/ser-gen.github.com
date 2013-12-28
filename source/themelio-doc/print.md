# Печать

Если нужно проверять вёрстку в режиме печати, можно к странице стили для печати подключать с медиазапросом экрана.

Проверять вёрстку лучше всего печатая на реальном принтере, но иногда может помочь и виртуальный.

```css
media print and (orientation:landscape) {
  /* если нужно применить стили только к альбомному положению страницы */
}
```

// [Печать страницы с альбомной ориентацией.](http://stackoverflow.com/a/4144170) Должно работать в блинках.

```css
@media print {
  @page {
    size: landscape;
  }
}
```


// Класс для непечати

```css
@media print {
  .noprint {
    display: none;
  }
}
```


Нужно печатать:
- фоновый цвет `:before` + `border-color`
- одна картинка в фоне `:before` + `content: url(png)`
- картинка с замощением `:before` + `border-image: url(png)` + `repeat`
- картинка растянутая `:before` + `border-image: url(png)` + `stretch`

Отсюда — [про преодоление проблем печати в разнообразных браузерах](http://tech.yandex.ru/events/yagosti/wsd-msk-dec-2013/talks/1521/)
