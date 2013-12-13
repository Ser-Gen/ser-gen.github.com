# Основы

Всегда отображаем вертикальную полосу прокрутки, чтобы избежать резкого изменения ширины страницы, когда она действительно понадобится.

Исправляем отображение некоторых новых элементов из HTML5.

В разделе [Помощники](helpers.md) есть несколько более удобных способов скрытия элемента, но иногда может пригодиться и атрибут:

	[hidden] {
	  display: none;
	}


Исправляем выделение текста с тенью, отключая её. Для использования псевдокласса `::selection` необходимо задавать фоновый цвет и цвет текста, в противном случае самого выделения вы не увидите.
К сожалению, из спецификации CSS3 [переменные для системных цветов](http://www.w3.org/TR/CSS2/ui.html#system-colors) убрали, предлагая использовать неподходящее в этой ситуации `appereance`.
Про это свойство [в документации Мозиллы](https://developer.mozilla.org/en-US/docs/CSS/-moz-appearance) и [на сайте CSS-трюки](http://css-tricks.com/almanac/properties/a/appearance/).
На случай, если эти переменные окончательно отключат, оставлена замена.

Здесь же можно задать, каким цветом раскрашивать выделенный текст и само выделение.

	::-moz-selection {
		background-color: #69c;
		background-color: Highlight;
		color: #fff;
		color: HighlightText;
		text-shadow: none;
	}
	::selection {
		background-color: #69c;
		background-color: Highlight;
		color: #fff;
		color: HighlightText;
		text-shadow: none;
	}