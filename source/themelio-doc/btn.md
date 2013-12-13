# Кнопки

Видов кнопок может быть несколько, поэтому для начала опишем базовый класс `btn`.
Кнопка отображается строчно-блоковой, она наследует вертикальное выравнивание, по умолчанию у кнопок `baseline`.
Во всех ИЕ для элементов `button` псевдоэлементы, выходящие за пределы кнопки, изначально скрыты, поэтому [нужно использовать `overflow: visible;`](http://stackoverflow.com/questions/11164634/ie8-and-ie9-before-and-after-elements-position-absolute-are-hidden)
Также, это свойство убирает [лишний внутренний отступ в ИЕ7](http://stackoverflow.com/questions/5008500/ie7-css-padding-issue-cannot-figure-out)

	.btn {
	  cursor: pointer;
	  display: inline-block;
	  font: inherit;
	  overflow: visible;
	  -webkit-user-select: none;
	     -moz-user-select: none;
	      -ms-user-select: none;
	          user-select: none;
	}

	.ie7 .btn {
		display: inline;
		zoom: 1;
	}


`btnMain` — основная кнопка. Окрашивается в цвет активных элементов, принятый на создаваемом сайте.
`btnDefault` — стандартная серая кнопка.
Рекомендуется использовать для других цветов кнопок отдельные модификаторы, совпадающие по названию с их цветом.

Состояния кнопок следует дублировать классами с тем же названием (`.hover`, `.active`) для переключения скриптом и, следовательно, большей гибкости в использовании.

	.btnMain:hover,
	.btnMain.hover {
		...
	}

Идеальным кнопкам нужно выравнивание текста по центру из-за того, что в какой-то ситуации им может быть задана фиксированная ширина. Также, рекомендуется использовать `white-space: nowrap;`, чтобы её многословный текст не превращался в многострочный в узких контейнерах.
Для того, чтобы использовать псевдоклассы `:active`, нужны элементы `a`, `input[type="button"]`, `input[type="reset"]`, `input[type="submit"]` или `button`.

Неактивной кнопка становится при помощи класса `.disabled`.
Для такой кнопки полезно сделать курсор по умолчанию и украсить её менее яркими цветами, чем у оригинальной.

Модификаторы, изменяющие размер кнопки:

	.btn.big {
		font-size: 2em;
	}
	.btn.small {
		font-size: .75em;
	}


Чтобы добавить кнопке пиктограмму, внутри неё нужно расположить дополнительный элемент `i.btnIcon`, при этом кнопка должна быть элементом `button` или `a`. Тег `<i>` используется только потому, что он очень короткий и слово *icon* начинается с такой же буквы.
Если есть возможность украшать элемент псевдоэлементами — это нужно делать. В то же время, для пиктограмм кнопок лучше всего использовать отдельный элемент. С его помощью проще управлять положением пиктограммы в кнопке, потому что, если не использовать абсолютное позиционирование, положение псевдоэлемента привязывается к его типу (`:after` или `:before`). К тому же, сам псевдоэлемент освобождается для оформительских задач.
Проблема с вертикальным выравниванием пиктограммы по центру возникает оттого, что она выравнивается по строчному тексту, а не по высоте строки, добавляется компенсация:

	.btnIcon {
		background: url(/img/ui.png) no-repeat;
		display: inline-block;
		margin-top: -.155em;
		margin-right: .4em;
		vertical-align: middle;
	}
	.ie7 .btnIcon {
		display: inline;
		zoom: 1;
	}


Анимированное изображение не получится объединить со спрайтом обычных пиктограмм.
Для предварительной загрузки этого изображения, которое должно появиться, например, при смене класса-модификатора для пиктограммы, можно воспользоваться модификатором предзагрузки. Возможность предзагрузки добавлена как к специальному элементу пиктограммы, так и к самой кнопке.

	.btn.preload:after,
	.btnIcon.preload:after {
		content: '';
		display: block;
	}
	.btn.preloadLoading:after,
	.btnIcon.preloadLoading:after,
	.btn.loading .btnIcon {
		background: url(/img/loading.gif);
	}


Таким образом, эволюцию кнопок можно представить следующим образом

	.btn
	-> .btn.btnDefault
	-> .btn.btnDefault.btnGreen
	-> .btn.btnDefault.btnGreen.recalculate .btnIcon
	-> .btn.btnDefault.btnGreen.recalculate.preload.preloadLoading .btnIcon