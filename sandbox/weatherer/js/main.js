/*!
 * Weatherer 1.0 JS
 * https://github.com/Ser-Gen/weatherer
 * Эксперимент с геопозиционированием и фоновой подгрузкой данных
 * MIT licensed
 *
 * Создан Сергеем Васильевым (@Ser_Gen)
 */

(function( window, undefined ) {

  // http://freehabr.ru/blog/html/1041.html
  var isLocalStorageAvailable;
  (function (){
    try {
      isLocalStorageAvailable = 'localStorage' in window && window.localStorage !== null && window.localStorage !== undefined;
    } catch (e) {
      isLocalStorageAvailable = false;
    }
  })();


  var timeZone = new Date().getTimezoneOffset()/60,

      times,
      updateDelay = 10*60*1000,

      overlayState = 0,
      addressIsEdited = false,

      overlay = d.getElementById('OverlayGradientMain'),
      overlayHelper = d.getElementById('OverlayGradientHelper'),

      weatherNow = d.getElementById('WeatherNow'),

      weatherForecastHours = d.getElementById('WeatherForecastHours'),
      weatherForecastHoursWeathers = weatherForecastHours.getElementsByClassName('Weather'),

      weatherForecastDaily = d.getElementById('WeatherForecastDaily'),
      weatherForecastDailyWeathers = weatherForecastDaily.getElementsByClassName('Weather'),

      addressDetect = d.getElementById('addressDetectAgain');


  if (localLoadState()) {
    var pos = localLoadState();
  } else {
        // центр Воронежа
    var pos = {
          coords : {
            latitude : 51.656887,
            longitude : 39.202534
          }
        };
  }


  // https://github.com/Ser-Gen/troller/
  // http://blogs.msdn.com/b/ie/archive/2011/09/20/touch-input-for-ie10-and-metro-style-apps.aspx
  // http://msdn.microsoft.com/en-US/library/ie/hh673557.aspx
  var actionEventUp;
  if ( window.navigator.msPointerEnabled ) {
    actionEventUp = 'MSPointerUp';
  } else if ( 'ontouchstart' in window ) {
    actionEventUp = 'touchend';
  } else {
    actionEventUp = 'click';
  }


  // http://stackoverflow.com/questions/492994/compare-dates-with-javascript
  // Source: http://stackoverflow.com/questions/497790
  var dates = {
    convert:function(d) {
      // Converts the date in d to a date-object. The input can be:
      //   a date object: returned without modification
      //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
      //   a number     : Interpreted as number of milliseconds
      //                  since 1 Jan 1970 (a timestamp) 
      //   a string     : Any format supported by the javascript engine, like
      //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
      //  an object     : Interpreted as an object with year, month and date
      //                  attributes.  **NOTE** month is 0-11.
      return (
        d.constructor === Date ? d :
        d.constructor === Array ? new Date(d[0],d[1],d[2]) :
        d.constructor === Number ? new Date(d) :
        d.constructor === String ? new Date(d) :
        typeof d === "object" ? new Date(d.year,d.month,d.date) :
        NaN
      );
    },
    compare:function(a,b) {
      // Compare two dates (could be of any type supported by the convert
      // function above) and returns:
      //  -1 : if a < b
      //   0 : if a = b
      //   1 : if a > b
      // NaN : if a or b is an illegal date
      // NOTE: The code inside isFinite does an assignment (=).
      return (
        isFinite(a=this.convert(a).valueOf()) &&
        isFinite(b=this.convert(b).valueOf()) ?
        (a>b)-(a<b) :
        NaN
      );
    },
    inRange:function(d,start,end) {
      // Checks if date in d is between dates in start and end.
      // Returns a boolean or NaN:
      //    true  : if d is between start and end (inclusive)
      //    false : if d is before start or after end
      //    NaN   : if one or more of the dates is illegal.
      // NOTE: The code inside isFinite does an assignment (=).
     return (
        isFinite(d=this.convert(d).valueOf()) &&
        isFinite(start=this.convert(start).valueOf()) &&
        isFinite(end=this.convert(end).valueOf()) ?
        start <= d && d <= end :
        NaN
      );
    }
  };


  overlay.addEventListener(actionEventUp, overlayStateLoop, false);

  address.addEventListener(actionEventUp, addressFocus, false);
  address.addEventListener('blur', addressBlur, false);

  addressDetect.addEventListener(actionEventUp, addressDetectHandler, false);

  d.addEventListener('keydown', documentKeyHandler, false);

  locator();
  var locatorLoop = setInterval(locator, updateDelay);


  function localSaveState(data) {
    if (isLocalStorageAvailable) {
      localStorage.setItem('WeathererDB', JSON.stringify(data));
    } else {
      return false;
    }
  }
  function localLoadState() {
    if (isLocalStorageAvailable) {
      return JSON.parse(localStorage.getItem('WeathererDB'));
    } else {
      return false;
    }
  }


  function addClass(element, name) {
    element.className = element.className.replace(/\s+$/gi, '') + ' ' + name;
  }
  function removeClass(element, name) {
    element.className = element.className.replace(name, '');
  }

  // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };


  function changeFavicon(src) {
    var link = document.createElement('link'),
       oldLink = document.getElementById('favicon');
    link.id = 'favicon';
    link.rel = 'shortcut icon';
    link.type = 'image/x-icon';
    link.href = src;
    if (oldLink) {
      document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
  }


  function addressDetectHandler() {
    var addressTransitionHandler = function () {
      addressDetect.style.display = 'none';
      addressDetect.removeEventListener('transitionend', addressTransitionHandler, false);
    };
    pos.alternate = false;
    localSaveState(pos);
    locator();
    removeClass(addressDetect, 'isAlertnated');
    addressDetect.addEventListener('transitionend', addressTransitionHandler, false);
  }

  function addressFocus() {
    addressVal = address.value;
    address.select();
    addressIsEdited = true;
    address.removeEventListener(actionEventUp, addressFocus, false);
    overlay.removeEventListener(actionEventUp, overlayStateLoop, false);
    address.addEventListener('keydown', addressKeyHandler, false);
  }
  function addressBlur() {
    if (addressVal !== address.value) {
      geoGetter(address.value);
      address.setAttribute('disabled', 'disabled');
      addressDisabledDisabler = setTimeout(function () {
        countDataToLoad = 2;
        dataIsLoaded();
      }, 15000);
    }
    addressIsEdited = false;
    address.addEventListener(actionEventUp, addressFocus, false);
    overlay.addEventListener(actionEventUp, overlayStateLoop, false);
    address.removeEventListener('keydown', addressKeyHandler, false);
  }
  function addressKeyHandler(e) {
    e = e || window.event;
    if (e.keyCode === 13) { /* ентер */
      address.blur();
    }
    if (e.keyCode === 27) { /* еск */
      address.value = addressVal;
      address.blur();
    }
  }
  function documentKeyHandler(e) {
    e = e || window.event;
    if (e.ctrlKey && e.keyCode === 70) { /* ктрл + а */
      e.preventDefault();
      addressFocus();
    }
    if ((e.keyCode === 32) && !addressIsEdited) { /* пробел */
      e.preventDefault();
      overlayStateLoop();
    }
    if ((e.shiftKey && (((e.keyCode > 47) && (e.keyCode < 91)) || (e.keyCode === 188) || (e.keyCode === 190) || (e.keyCode === 192) || (e.keyCode === 219) || (e.keyCode === 221) || (e.keyCode === 222))) && !addressIsEdited) { /* шифт + буквенные клавиши */
      addressFocus();
    }
  }


  function overlayStateLoop() {
    switch (overlayState) {
      case 0:
        weatherNow.className = 'Weather WeatherNow showForecastHours';
        overlayState = 1;
        break;
      case 1:
        weatherNow.className = 'Weather WeatherNow showForecastDaily';
        overlayState = 2;
        break;
      case 2:
        weatherNow.className = 'Weather WeatherNow';
        overlayState = 0;
        break;
    }
  }


  // http://stackoverflow.com/questions/9922101/get-json-data-from-external-url-and-display-a-particular-value-by-injecting-it-i
  function getData(link) {
    var script = d.createElement('script');
    script.src = link;
    body.appendChild(script);
  }




  // http://api.yandex.ru/maps/doc/geocoder/desc/concepts/About.xml
  // http://api.yandex.ru/maps/doc/geocoder/desc/examples/geocoder_examples.xml
  // http://api.yandex.ru/maps/doc/geocoder/desc/concepts/response_structure.xml#json_response

  function geoGetter(data) {
    // http://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
    if (data.substring) {
      getData('http://geocode-maps.yandex.ru/1.x/?format=json&results=3&callback=getPos&geocode='+ data);
    } else{
      getData('http://geocode-maps.yandex.ru/1.x/?format=json&results=3&callback=getName&geocode='+ data.coords.longitude +','+ data.coords.latitude);
    }
  }

  window.getPos = function getPos(data) {
    if (data.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.found > 0) {
      var place = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
      locator(place);
      return place;
    } else {
      address.removeAttribute('disabled');
      address.value = 'Место не нашлось :(';
      clearTimeout(addressDisabledDisabler);
    }
  };

  // http://stackoverflow.com/questions/15523514/find-by-key-deep-in-nested-json-object
  window.getName = function getName(data) {
    var addressName,
        addressFull;

    if (data.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.found > 0) {
      var addressDetails = data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails;
      if (addressDetails.hasOwnProperty('Country')) {
        addressName = addressDetails.Country.CountryName;

        if (addressDetails.Country.hasOwnProperty('AddressLine')) {
          addressFull = addressDetails.Country.AddressLine;
        } else {
          addressFull = 'Местность определена приблизительно';
        }

        if (addressDetails.Country.hasOwnProperty('AdministrativeArea')) {
          addressName = addressDetails.Country.AdministrativeArea.AdministrativeAreaName;
          if (addressDetails.Country.AdministrativeArea.hasOwnProperty('Locality')) {
            if (addressDetails.Country.AdministrativeArea.Locality.hasOwnProperty('LocalityName')) {
              addressName = addressDetails.Country.AdministrativeArea.Locality.LocalityName;
            }
            if (addressDetails.Country.AdministrativeArea.Locality.hasOwnProperty('DependentLocality')) {
              addressName = addressDetails.Country.AdministrativeArea.Locality.DependentLocality.DependentLocalityName;
            }
          } else if (addressDetails.Country.AdministrativeArea.hasOwnProperty('SubAdministrativeArea')) {
            addressName = addressDetails.Country.AdministrativeArea.SubAdministrativeArea.SubAdministrativeAreaName;
            if (addressDetails.Country.AdministrativeArea.SubAdministrativeArea.hasOwnProperty('Locality')) {
              if (addressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.hasOwnProperty('LocalityName')) {
                addressName = addressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName;
              }
            }
          }
        } else if (addressDetails.Country.hasOwnProperty('Locality')) {
          if (addressDetails.Country.Locality.hasOwnProperty('LocalityName')) {
            addressName = addressDetails.Country.Locality.LocalityName;
          }
          if (addressDetails.Country.Locality.hasOwnProperty('Premise')) {
            addressName = addressDetails.Country.Locality.Premise.PremiseName;
          }
        }
      }
      address.value = addressName;
      address.title = addressFull;
    } else {
      address.value = 'Точное место не нашлось :(';
      address.removeAttribute('disabled');
      clearTimeout(addressDisabledDisabler);
    }
  };


  // http://htmlbook.ru/html5/geolocation
  // https://code.google.com/p/geo-location-javascript/
  // http://jsfiddle.net/RXQus/
  function locator(p) {
    var chance;
    // countDataToLoad = 0;
    if (p === undefined) {
      if (pos.alternate === true) {
        callback();
      } else {
        if (geo_position_js.init()) {
          if (!pos.timestamp) {
            chance = setTimeout(callback, 15*1000);
          }
          geo_position_js.getCurrentPosition(success_callback,callback);
        } else {
          callback();
        }
      }
    } else {
      pos = {
        coords : {
           latitude : p[1],
          longitude : p[0]
        },
        alternate : true
      };
      localSaveState(pos);
      addClass(body, 'cityIsChanging');
      overlayHelper.className = 'OverlayGradient helper';
      addClass(overlayHelper, getTimes(pos));
      // https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transitions#Detecting_the_completion_of_a_transition
      weatherNow.addEventListener('transitionend', callback, false);
    }

    function success_callback(p) {
      callback(p);
    }
    function callback(p) {
      if (pos.alternate === true) {
        addressDetect.style.display = 'block';
        addClass(addressDetect, 'isAlertnated');
      }
      if (chance) {
        clearTimeout(chance);
      }
      if (((p && p.timestamp) || pos.alternate === false) && p.PERMISSION_DENIED !== 1) {
        pos = p;
      }
      weatherNow.removeEventListener('transitionend', callback, false);
      setTimes(pos);
      getWeather(pos);
      geoGetter(pos);
    }
  }


  // http://www.suncalc.net/
  // https://github.com/mourner/suncalc
  function getTimes(pos) {
    var curDate = new Date();

    times = SunCalc.getTimes(curDate, pos.coords.latitude, pos.coords.longitude); // (дата, широта, долгота)
    if (dates.inRange(curDate, times.goldenHourEnd, times.goldenHour)) {
      changeFavicon('img/ico/favicon_day.ico');
      return 'OverlayGradient day';
    } else if ((dates.inRange(curDate, times.sunrise, times.goldenHourEnd)) || (dates.inRange(curDate, times.goldenHour, times.sunset))) {
      changeFavicon('img/ico/favicon_day.ico');
      return 'OverlayGradient day border';
    } else if ((dates.inRange(curDate, times.dawn, times.sunrise)) || (dates.inRange(curDate, times.sunset, times.dusk))) {
      changeFavicon('img/ico/favicon_night.ico');
      return 'OverlayGradient night twilight';
    } else if ((dates.inRange(curDate, times.nauticalDawn, times.dawn)) || (dates.inRange(curDate, times.dusk, times.nauticalDusk))) {
      changeFavicon('img/ico/favicon_night.ico');
      return 'OverlayGradient night nauticalTwilight';
    } else {
      changeFavicon('img/ico/favicon_night.ico');
      return 'OverlayGradient night';
    }
  }

  function setTimes(pos) {
    overlay.className = getTimes(pos);
  }


  // http://openweathermap.org/API
  // http://bugs.openweathermap.org/projects/api/wiki/Api_2_5
  // http://bugs.openweathermap.org/projects/api/wiki/Weather_Data
  // http://bugs.openweathermap.org/projects/api/wiki/Weather_Condition_Codes

  // Прогноз возможно получить по такой ссылке, например
  // http://api.openweathermap.org/data/2.5/forecast/daily?id=524901&lang=ru

  function getWeather(pos) {
    getData("http://api.openweathermap.org/data/2.5/weather?lat="+ pos.coords.latitude +"&lon="+ pos.coords.longitude +"&lang=ru&callback=insertWeather");
    getData("http://api.openweathermap.org/data/2.5/forecast?lat="+ pos.coords.latitude +"&lon="+ pos.coords.longitude +"&lang=ru&cnt=4&mode=json&callback=insertForecastHours");
    getData("http://api.openweathermap.org/data/2.5/forecast/daily?lat="+ pos.coords.latitude +"&lon="+ pos.coords.longitude +"&lang=ru&cnt=4&mode=json&callback=insertForecastDaily");
  }

  window.insertWeather = function insertWeather(weather) {
    if (weather.main.temp) {
      weatherNow.getElementsByClassName('WeatherTemp')[0].innerHTML = (Math.round(weather.main.temp - 273.15)) +'&deg;C';
    } else {
      weatherNow.getElementsByClassName('WeatherTemp')[0].innerHTML = 'n/a';
    }
    if (weather.weather[0].id) {
      weatherNow.getElementsByClassName('WeatherIcon')[0].className = 'WeatherIcon s'+ weather.weather[0].id;
    }
    if (weather.weather[0].description) {
      weatherNow.getElementsByClassName('WeatherIcon')[0].title = weather.weather[0].description.capitalize();
    }

    if (weather) {
      dataIsLoaded();
    }
  };
  window.insertForecastHours = function insertForecastHours(forecastHours) {
    if (forecastHours.list) {
      for (var i = 1; i < 4; i++) {
        if (forecastHours.list[i].dt_txt) {
          var time = forecastHours.list[i].dt_txt.replace(/^\S*\s/g, '').split(':')[0]*1 - timeZone;
          if (time > 24) {
            time = time - 24;
          } else if (time < 0) {
            time = time + 24;
          }
          weatherForecastHoursWeathers[i-1].getElementsByClassName('WeatherDate')[0].innerHTML = time +':00';
        }
        if (forecastHours.list[i].main.temp) {
          weatherForecastHoursWeathers[i-1].getElementsByClassName('WeatherTemp')[0].innerHTML = (Math.round(forecastHours.list[i].main.temp - 273.15)) +'&deg;C';
        }
        if (forecastHours.list[i].weather[0].id) {
          weatherForecastHoursWeathers[i-1].getElementsByClassName('WeatherIcon')[0].className = 'WeatherIcon s'+ forecastHours.list[i].weather[0].id;
        }
        if (forecastHours.list[i].weather[0].description) {
          weatherForecastHoursWeathers[i-1].getElementsByClassName('WeatherIcon')[0].title = forecastHours.list[i].weather[0].description.capitalize();
        }
      }
      dataIsLoaded();
    }
  };
  window.insertForecastDaily = function insertForecastDaily(forecastDaily) {
    // http://stackoverflow.com/questions/3818193/how-to-add-number-of-days-to-todays-date
    var date = new Date();

    if (forecastDaily.list) {
      for (var i = 1; i < 4; i++) {
        date.setDate(date.getDate() + 1);
        weatherForecastDailyWeathers[i-1].getElementsByClassName('WeatherDate')[0].innerHTML = date.getDate() +'.'+ (date.getMonth()*1 + 1 < 10 ? '0'+ (date.getMonth()*1 + 1) : date.getMonth()*1 + 1);
        if (forecastDaily.list[i].temp.max) {
          weatherForecastDailyWeathers[i-1].getElementsByClassName('WeatherTemp')[0].innerHTML = (Math.round(forecastDaily.list[i].temp.max - 273.15)) +'&deg;C';
        }
        if (forecastDaily.list[i].weather[0].id) {
          weatherForecastDailyWeathers[i-1].getElementsByClassName('WeatherIcon')[0].className = 'WeatherIcon s'+ forecastDaily.list[i].weather[0].id;
        }
        if (forecastDaily.list[i].weather[0].description) {
          weatherForecastDailyWeathers[i-1].getElementsByClassName('WeatherIcon')[0].title = forecastDaily.list[i].weather[0].description.capitalize();
        }
      }
      dataIsLoaded();
    }
  };

})( window );
