/*
 * WTFFont — What The Format of Font
 *
 * Проверка поддерживаемого формата шрифта
 * Определяются форматы `woff`, `svg`, `otf` и `eot`
 *
 * Информация о поддерживаемом формате
 * ассоциируется с версией браузера
 * и сохраняется в локальном хранилище
 *
 * Имеет смысл запускать в браузерах ИЕ >= 9 и в других современных
 * Проверено в Опере с 10.1, ИЕ с 8, ФФ 22 и Хроме 28
 * 
 * Copyright (c) 2013 Sergei Vasiliev
 * MIT license
 */

function wtffont (callbackAfter) {

  (function(window, undefined) {

    var data, result,
        isIE = false;

    // Определяется версия браузера; она пригодится, чтобы ассоциировать версию с поддеживаемым шрифтом и не проверять поддержку с каждой загрузкой страницы
    // http://stackoverflow.com/questions/5916900/detect-version-of-browser
     navigator.sayswho = (function(){
        var N = navigator.appName,
            ua = navigator.userAgent,
            tem;
        var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
        M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];

        return M;
    })();

    // Определяется поддержка локального хранилища
    // http://mathiasbynens.be/notes/localstorage-pattern
    var storage,
        localFail,
        localUid;
    try {
      localUid = new Date;
      (storage = window.localStorage).setItem(localUid, localUid);
      localFail = storage.getItem(localUid) != localUid;
      storage.removeItem(localUid);
      localFail && (storage = false);
    } catch (e) {
      storage = false;
    }

    // хранилище есть — проверяется соответствие текущей версии браузера и сохранённой; если они равны, всё заканчивается
    if (storage) {
      var local = storage.getItem('whatFontFormatIsSupported');
      if (local !== '') {
        data = JSON.parse(local);
        if (data !== null) {
          if (data.hasOwnProperty('version') && data.version == navigator.sayswho[1]) {
            callbackAfter(data.format);
            return true;
          }
        }
      }
    }

    // Получаем версию ИЕ
    // http://stackoverflow.com/questions/280879/how-can-i-determine-which-version-of-ie-a-user-is-running-in-javascript/281291#281291
    if (navigator.appName == 'Microsoft Internet Explorer') {
      isIE = true;
      navigator.sayswho[1] = navigator.sayswho[1].replace(/[.]\d?/,'')*1;
    }


    /*
     * Основано на http://paulirish.com/2009/font-face-feature-detection/
     */

    whatFontFormatIsSupported = (function(){
      
        var fontret,
            fontmat = 'eot',
            fontfaceCheckDelay = 50;

        // ИЕ поддерживает EOT с версии 5.
        // Этот формат не в спецификации,
        // он используется только этим браузером,
        // поэтому тест на версию такого браузера приемлем.
        if (isIE && navigator.sayswho[1] >= 5 && navigator.sayswho[1] <= 8) {

          fontret = true;

        } else {
          var doc = document, docElement = doc.documentElement, 
              st  = doc.createElement('style'),
              spn = doc.createElement('span'),
              wid, nwid, body = doc.body,
              callback, isCallbackCalled;

          fontmat = 'svg';

          function addTestFont(param) {
            var id = '';
            if (param === 'id') {
              id = '#piregular';
            }
            if (param === 'woff') {

              // Это шрифт в формате ВОФФ, содержащий только символ `-`. Автор — Ethan Dunham.
              st.textContent = "@font-face{font-family:testfont;src:url(data:application/font-woff;base64,d09GRgABAAAAAAQMAA4AAAAABbQAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABRAAAABwAAAAcYZolwkdERUYAAAFgAAAAHQAAACAAMwAET1MvMgAAAYAAAAA/AAAAYFs+OAljbWFwAAABwAAAAEoAAAFSAEbm+Gdhc3AAAAIMAAAACAAAAAj//wADZ2x5ZgAAAhQAAAAqAAAALCbpWFxoZWFkAAACQAAAAC4AAAA2AdglEGhoZWEAAAJwAAAAHgAAACQJtwiiaG10eAAAApAAAAAWAAAAGBVTAABsb2NhAAACqAAAAA4AAAAOABYADm1heHAAAAK4AAAAHQAAACAASQAHbmFtZQAAAtgAAAEEAAABviG1SZJwb3N0AAAD3AAAACcAAAA2nw5NHXdlYmYAAAQEAAAABgAAAAY961HkAAAAAQAAAADMPaLPAAAAAMdSlIkAAAAAzgnuaXjaY2BkYGDgA2IJBhBgYmAEQlYgZgHzGAAEgQA4AAAAeNpjYGJ5zDiBgZWBhXUWqzEDA6M8hGa+yJDGxIAGGJE5bh4uDAwODAoPGNgY/gH5TP/+8aGpUWBgBAD9cAnTAHjaY2BgYGaAYBkGRgYQ8AHyGMF8FgYDIM0BhExAWoFB9wHD//8I1v/H/68rsEJ1gQEjGwOcywjSw8SAChghVsEBC8OwAwBabgsfAAAAAAAB//8AAnjaY2BkYGD8xLaM6R8DMwODJKOiINsyxk+MPP++MAAlGJCAIQMAuDUGwAAAeNpjYGRgYGBkcDR4u3xTPL/NVwZuDgYQOMf5LguZZlvG9A9IcTAwgXgAPDAKgAAAeNpjYGRgYPrH+IlBiG0lAxCwLWNgZEAFbABatQNpAAB42mNhgACmVQwMLECabSWEBgAPnQFoAAAAAAAAAAAAAAAAAA4AFgAAeNpjYGRgYGBjYGEA0QwMTEDMCGY7gPkMAANWAFEAAAB42mWQzS5DQRiGn+ohIQiJWJ+4AOkPC90hKgQVTsJWU6qJlDSVkLgCF+AqXIQlFmLhClyFpaczsyInM/N87/d+70wOMM0TZUrZJHDnilwis4o8xiwPicss8Zg4Y4HnxONM8ZJ4ws574hmnPxLPqX8mnjfzK/Eri3wnfqPCD9uc03cNOGPo2SGnp5JTs19hTWpz797kWn3Ins629bF8q7+nvmy96Xmjc6DS5dJuTLpQz+2M7ukEpav/kB2O1LpmXJk4ML/FAYX562zQsCrUtjjV29JbhJn8z1TVrEr4Yvd/7olVO7yiH94UJ/ZDnbMbfCN1Newr3lzza1CX41+oUv8F1xA7eHjaY2BiAIP/6QxpDNgAGxAzMjAxMDMIMDKxl+ZluhoYGAAAXY8EFgAAAVHkPeoAAA==)format('woff')}"
            } else if (param === 'otf') {

              // Формат — ОТФ
              st.textContent = "@font-face{font-family:testfont;src:url(data:font/opentype;base64,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)format('opentype')}";
            } else {

              // Формат — СВГ
              st.textContent = "@font-face{font-family:testfont;src:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiID4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8bWV0YWRhdGE+PC9tZXRhZGF0YT4KPGRlZnM+Cjxmb250IGlkPSJwaXJlZ3VsYXIiIGhvcml6LWFkdi14PSIxMDI0IiA+Cjxmb250LWZhY2UgdW5pdHMtcGVyLWVtPSIyMDQ4IiBhc2NlbnQ9IjE1MzYiIGRlc2NlbnQ9Ii01MTIiIC8+CjxtaXNzaW5nLWdseXBoIGhvcml6LWFkdi14PSI1MDAiIC8+CjxnbHlwaCB1bmljb2RlPSIgIiAvPgo8Z2x5cGggdW5pY29kZT0iLSIgaG9yaXotYWR2LXg9IjE3MDUiIGQ9Ik0wIDQ5OHYyNjhoMTcwMnYtMjY4aC0xNzAyeiIgLz4KPGdseXBoIHVuaWNvZGU9IiYjeGUwMDA7IiBkPSJNMCAweiIgLz4KPC9mb250Pgo8L2RlZnM+PC9zdmc+IA=="+ id +")format('svg')}";
            }
          };
          addTestFont();

          doc.getElementsByTagName('head')[0].appendChild(st);
          
          // знак `_` делает свойство `font` невалидным в ИЕ
          spn.setAttribute('style','font:99px a,serif;position:absolute;visibility:hidden;');
          
          if  (!body){
            body = docElement.appendChild(doc.createElement('fontface'));
          }
          
          // есть только символ `-`
          spn.innerHTML = '-------';
          spn.id        = 'fonttest';
          
          body.appendChild(spn);
          wid = spn.offsetWidth;

          spn.style.font = '99px testfont,a,serif';

          // для предотвращения ложных срабатываний (ff3, chrome, op9)
          fontret = wid !== spn.offsetWidth;

          var delayedCheck = function(){
            if (isCallbackCalled) return;
            fontret = wid !== spn.offsetWidth;

            // Опера не воспринимает шрифт в формате СВГ без указания идентификатора набора символов
            if (!fontret) {
              addTestFont('id');
              fontret = wid !== spn.offsetWidth;
              fontmat = 'svg';
            }

            if (!fontret) {
              addTestFont('woff');
              fontret = wid !== spn.offsetWidth;
              fontmat = 'woff';
            }

            if (!fontret) {
              addTestFont('otf');
              fontret = wid !== spn.offsetWidth;
              fontmat = 'otf';
            }

            callback && (isCallbackCalled = true) && callback(fontret, fontmat);
          }

          if (!fontret) {
            addEventListener('load',delayedCheck,false);
            setTimeout(delayedCheck,fontfaceCheckDelay);
          }
        }

        function ret(){  return fontret || wid !== spn.offsetWidth; };
        
        // возможность обратного вызова
        ret.ready = function(fn){
          (isCallbackCalled || fontret) ? fn(fontret, fontmat) : (callback = fn);
        }

        return ret;
    })();

    // функция определения формата шрифта сработала — сохраняем значение, передаём в вызов
    whatFontFormatIsSupported.ready(function(supports, type){
      if (supports) {
        result = {
          version : navigator.sayswho[1],
           format : type
        };
        if (storage) {
          storage.setItem('whatFontFormatIsSupported', JSON.stringify(result));
        }

        callbackAfter(type);
      };
    });

  })(window);

}
