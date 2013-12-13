# HTML

Для удобного написания стилей для ИЕ применяется техника [опорных классов](http://paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/). При условии, что ИЕ6 дезинтегрировался, документ начинается со строк

	<!doctype html>
	<!--[if lte IE 7]> <html class="ie7" lang="ru"> <![endif]-->
	<!--[if IE 8]> <html class="ie8" lang="ru"> <![endif]-->
	<!--[if IE 9]> <html class="ie9" lang="ru"> <![endif]-->
	<!--[if gt IE 9]><!--> <html lang="ru"> <!--<![endif]-->

А в таблице стилей можно писать так

	.ie7 .listItems.line {
		display: inline;
		zoom: 1;
	}

Таким образом мы *избавляем* себя от лишних файлов (следовательно, от мест для редактирования, собирая весь код в одном месте), и пользователей ИЕ от необходимости загружать дополнительные файлы стилей.

Классы для нескольких версий я решил не объединять (в отличие от последней версии данного способа), так как вероятность обнаружить у версий 7,8,9 одинаковое багоповедение *крайне мала* (хотя таковая есть у 6,7).

Правила с такими классами в селекторах лучше всего писать рядом с оригинальными правилами.


`head` начинается с указания кодировки

	    <meta charset="utf-8">
	или <meta charset="windows-1251">


Потом следует написать

	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>

Данная строка указывает обозревателю на необходимость открытия страницы в самой лучшей доступной версии движка или использовать ХромФрейм, если он установлен.
Вот про это [в документации ХТМЛ5Бойлерплейт](https://github.com/h5bp/html5-boilerplate/blob/master/doc/html.md#x-ua-compatible)


Затем уже заголовок страницы и информационные метатеги

	<title>Страница на фундаменте</title>
	<meta name="description" content="">


[Настраиваем вьюпорт](https://developer.apple.com/library/safari/#documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html)

	<meta name="viewport" content="width=device-width">


Далее подключаются склеенные и мумифицированные файлы стилей.
Сначала основные, межпроектовые стили, затем файлы стилей самого сайта, потом для используемых джс-плагинов.

	<link rel="stylesheet" href="/css/main.css" media="all">
	<link rel="stylesheet" href="/css/theme.css" media="all">
	<link rel="stylesheet" href="/css/plugins.css" media="all">


Неплохо будет положить в корень сайта файлы пиктограмм сайта для обычных браузеров (favicon.ico) и [мобильных устройств](http://mathiasbynens.be/notes/touch-icons).


Стоит отметить, что в хтмл есть определённый [набор тегов](http://www.w3.org/TR/2011/WD-html5-20110525/syntax.html#optional-tags), которые опциональны в документе и которые необязательно закрывать.


Перед `</body>` указываются используемые скрипты, подключается джКуери с СДН, склеенные плагины, основной файл скриптов.

	<script src="js/jquery-1.8.2.min.js"></script>
	<script src="js/plugins.js"></script>
	<script src="js/load.js"></script>

В конце концов, `<html>` закрывается.