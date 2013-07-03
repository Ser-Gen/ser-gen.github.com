/*!
 * Weatherer 1.0 JS
 * https://github.com/Ser-Gen/weatherer
 * Эксперимент с геопозиционированием и фоновой подгрузкой данных
 * MIT licensed
 *
 * Создан Сергеем Васильевым (@Ser_Gen)
 */

(function( window, undefined ) {

  // центр Воронежа
  var pos = {
        coords : {
          latitude : 51.656887,
          longitude : 39.202534
        }
      },

      // http://javascript.ru/Date/getTimezoneOffset
      timeZone = new Date().getTimezoneOffset()/60,

      times, weather,
      updateDelay = 10*60*1000,

      overlayState = 0,
      addressIsEdited = false,

      favicon = d.getElementById('favicon'),

      overlay = d.getElementById('OverlayGradientMain'),

      weatherNow = d.getElementById('WeatherNow'),

      weatherForecastHours = d.getElementById('WeatherForecastHours'),
      weatherForecastHoursWeathers = weatherForecastHours.getElementsByClassName('Weather'),

      weatherForecastDaily = d.getElementById('WeatherForecastDaily'),
      weatherForecastDailyWeathers = weatherForecastDaily.getElementsByClassName('Weather');

  var address = d.getElementById('address'),
      addressVal,
      addressDisabledDisabler;

  var actionEventUp;

  // https://github.com/Ser-Gen/troller/
  // http://blogs.msdn.com/b/ie/archive/2011/09/20/touch-input-for-ie10-and-metro-style-apps.aspx
  // http://msdn.microsoft.com/en-US/library/ie/hh673557.aspx
  if ( window.navigator.msPointerEnabled ) {
    actionEventUp = 'MSPointerUp';
  } else if ( 'ontouchstart' in window ) {
    actionEventUp = 'touchend';
  } else {
    actionEventUp = 'click';
  }


  overlay.addEventListener(actionEventUp, overlayStateLoop, false);

  locator();
  var locatorLoop = setInterval(locator, updateDelay);


  address.addEventListener(actionEventUp, addressFocus, false);
  address.addEventListener('blur', addressBlur, false);


  d.addEventListener('keydown', documentKeyHandler, false);



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
    if (addressVal != address.value) {
      codeAddress();
      address.setAttribute('disabled', 'disabled');
      addressDisabledDisabler = setTimeout(function () {
        address.removeAttribute('disabled');
      }, 5000);
    };
    addressIsEdited = false;
    address.addEventListener(actionEventUp, addressFocus, false);
    overlay.addEventListener(actionEventUp, overlayStateLoop, false);
    address.removeEventListener('keydown', addressKeyHandler, false);
  }
  function addressKeyHandler(e) {
    e = e || window.event;
    if (e.keyCode == 13) { /* ентер */
      address.blur();
    }
    if (e.keyCode == 27) { /* еск */
      address.value = addressVal;
      address.blur();
    }
  }
  function documentKeyHandler(e) {
    e = e || window.event;
    if (e.ctrlKey && e.keyCode == 70) { /* ктрл + а */
      e.preventDefault();
      addressFocus();
    }
    if ((e.keyCode == 32) && !addressIsEdited) { /* пробел */
      e.preventDefault();
      overlayStateLoop();
    };
    if ((e.shiftKey && (((e.keyCode > 47) && (e.keyCode < 91)) || (e.keyCode == 188) || (e.keyCode == 190) || (e.keyCode == 192) || (e.keyCode == 219) || (e.keyCode == 221) || (e.keyCode == 222))) && !addressIsEdited) { /* шифт + буквенные клавиши */
      addressFocus();
    }
  }

  function overlayStateLoop() {
    switch (overlayState) {
      case 0:
        weatherNow.className = 'Weather WeatherNow showForecastHours';
        overlayState = 1;
        break
      case 1:
        weatherNow.className = 'Weather WeatherNow showForecastDaily';
        overlayState = 2;
        break
      case 2:
        weatherNow.className = 'Weather WeatherNow';
        overlayState = 0;
        break
    }
  }

  // https://developers.google.com/maps/documentation/javascript/geocoding?hl=ru
  google.maps.event.addDomListener(window, 'load', initialize);
  var geocoder;
  var map;
  function initialize() {
    geocoder = new google.maps.Geocoder();
  }

  function codeAddress() {
    geocoder.geocode( { 'address': address.value}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        locator(results[0].geometry.location);
        return results[0].geometry.location;
      } else {
        address.value = 'Город не нашёлся :(';
        address.removeAttribute('disabled');
        clearTimeout(addressDisabledDisabler);
      }
    });
  }

  // https://developers.google.com/maps/documentation/javascript/geocoding?hl=ru#ReverseGeocoding
  function findName(pos) {
    var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results) {
          var t = setAddressName(results);
          address.value = t;
          title.innerHTML = t +' &mdash; Погодник';
        } else {
          address.value = 'Город не нашёлся :(';
        }
      } else {
        address.value = 'Город не нашёлся :(';
      }
    });
  }

  function setAddressName(data) {
    if (data[0]) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].types) {
          if (data[i].types[0] == 'locality') {
            return data[i].address_components[0].long_name;
          };
        };
      };
      for (var i = 0; i < data.length; i++) {
        if (data[i].types) {
          if (data[i].types[0] == 'administrative_area_level_2') {
            return data[i].address_components[0].long_name;
          };
        };
      };
      for (var i = 0; i < data.length; i++) {
        if (data[i].types) {
          if (data[i].types[0] == 'administrative_area_level_1') {
            return data[i].address_components[0].long_name;
          };
        };
      };
      return 'Неточная местность'
    };
  }


  // http://openweathermap.org/API
  // http://bugs.openweathermap.org/projects/api/wiki/Api_2_5
  // http://bugs.openweathermap.org/projects/api/wiki/Weather_Data
  // http://bugs.openweathermap.org/projects/api/wiki/Weather_Condition_Codes

  // Прогноз возможно получить по такой ссылке, например
  // http://api.openweathermap.org/data/2.5/forecast/daily?id=524901&lang=ru


  // http://htmlbook.ru/html5/geolocation
  // https://code.google.com/p/geo-location-javascript/
  // http://jsfiddle.net/RXQus/
  function locator(p) {
    var chance;
    if (p === undefined) {
      if (pos.alternate === true) {
        callback();
      } else {
        if (geo_position_js.init()) {
          if (!pos.timestamp) {
            chance = setTimeout(callback, 15*1000);
          };
          geo_position_js.getCurrentPosition(success_callback,callback);
        } else {
          callback();
        }
      }
    } else {
      pos = {
        coords : {
           latitude : p.jb,
          longitude : p.kb
        },
        alternate : true
      };
      callback();
    };

    function success_callback(p) {
      callback(p);
    }
    function callback(p) {
      if (chance) {
        clearTimeout(chance);
      };
      if ((p && p.timestamp) || pos.alternate == false) {
        pos = p;
      };
      getTimes(pos);
      getWeather(pos);
      findName(pos);
    }
  }

  // http://www.suncalc.net/
  // https://github.com/mourner/suncalc
  function getTimes(pos) {
    var curDate = new Date();

    times = SunCalc.getTimes(curDate, pos.coords.latitude, pos.coords.longitude); // (дата, широта, долгота)
    if (dates.inRange(curDate, times.goldenHourEnd, times.goldenHour)) {
      overlay.className = 'OverlayGradient day';
      favicon.setAttribute('href', 'favicon_day.ico');
    } else if ((dates.inRange(curDate, times.sunrise, times.goldenHourEnd)) || (dates.inRange(curDate, times.goldenHour, times.sunset))) {
      overlay.className = 'OverlayGradient day border';
      favicon.setAttribute('href', 'favicon_day.ico');
    } else if ((dates.inRange(curDate, times.dawn, times.sunrise)) || (dates.inRange(curDate, times.sunset, times.dusk))) {
      overlay.className = 'OverlayGradient night twilight';
      favicon.setAttribute('href', 'favicon_night.ico');
    } else if ((dates.inRange(curDate, times.nauticalDawn, times.dawn)) || (dates.inRange(curDate, times.dusk, times.nauticalDusk))) {
      overlay.className = 'OverlayGradient night nauticalTwilight';
      favicon.setAttribute('href', 'favicon_night.ico');
    } else {
      overlay.className = 'OverlayGradient night';
      favicon.setAttribute('href', 'favicon_night.ico');
    };
  }

  function getWeather(pos) {
    getData("http://api.openweathermap.org/data/2.5/weather?lat="+ pos.coords.latitude +"&lon="+ pos.coords.longitude +"&lang=ru&callback=insertWeather");
    getData("http://api.openweathermap.org/data/2.5/forecast?lat="+ pos.coords.latitude +"&lon="+ pos.coords.longitude +"&lang=ru&cnt=4&mode=json&callback=insertForecastHours");
    getData("http://api.openweathermap.org/data/2.5/forecast/daily?lat="+ pos.coords.latitude +"&lon="+ pos.coords.longitude +"&lang=ru&cnt=4&mode=json&callback=insertForecastDaily");
  }

  // http://stackoverflow.com/questions/9922101/get-json-data-from-external-url-and-display-a-particular-value-by-injecting-it-i
  function getData(link) {
    var script = d.createElement('script');
    script.src = link;
    body.appendChild(script);
  }

  window.insertWeather = function insertWeather(weather) {
    if (weather.main.temp) {
      weatherNow.getElementsByClassName('WeatherTemp')[0].innerHTML = (Math.round(weather.main.temp - 273.15)) +'&deg;C';
    };
    if (weather.weather[0].id) {
      weatherNow.getElementsByClassName('WeatherIcon')[0].className = 'WeatherIcon s'+ weather.weather[0].id;
    };
    if (weather.weather[0].description) {
      weatherNow.getElementsByClassName('WeatherIcon')[0].title = weather.weather[0].description.capitalize();
    };
    
    if (weather) {
      body.className = 'dataLoaded';
      address.removeAttribute('disabled');
      clearTimeout(addressDisabledDisabler);
    };
  }
  window.insertForecastHours = function insertForecastHours(forecastHours) {
    if (forecastHours.list) {
      for (var i = 1; i < 4; i++) {
        if (forecastHours.list[i].dt_txt) {
          var time = forecastHours.list[i].dt_txt.replace(/^\S*\s/g, '').split(':')[0]*1 - timeZone;
          if (time > 24) {
            time = time - 24;
          } else if (time < 0) {
            time = time + 24;
          };;
          weatherForecastHoursWeathers[i-1].getElementsByClassName('WeatherDate')[0].innerHTML = time +':00';
        };
        if (forecastHours.list[i].main.temp) {
          weatherForecastHoursWeathers[i-1].getElementsByClassName('WeatherTemp')[0].innerHTML = (Math.round(forecastHours.list[i].main.temp - 273.15)) +'&deg;C';
        };
        if (forecastHours.list[i].weather[0].id) {
          weatherForecastHoursWeathers[i-1].getElementsByClassName('WeatherIcon')[0].className = 'WeatherIcon s'+ forecastHours.list[i].weather[0].id;
        };
        if (forecastHours.list[i].weather[0].description) {
          weatherForecastHoursWeathers[i-1].getElementsByClassName('WeatherIcon')[0].title = forecastHours.list[i].weather[0].description.capitalize();
        };
      };
    };

  }
  window.insertForecastDaily = function insertForecastDaily(forecastDaily) {
    // http://stackoverflow.com/questions/3818193/how-to-add-number-of-days-to-todays-date
    var date = new Date();

    if (forecastDaily.list) {
      for (var i = 1; i < 4; i++) {
        date.setDate(date.getDate() + 1);
        weatherForecastDailyWeathers[i-1].getElementsByClassName('WeatherDate')[0].innerHTML = date.getDate() +'.'+ (date.getMonth()*1 + 1 < 10 ? '0'+ (date.getMonth()*1 + 1) : date.getMonth()*1 + 1);
        if (forecastDaily.list[i].temp.max) {
          weatherForecastDailyWeathers[i-1].getElementsByClassName('WeatherTemp')[0].innerHTML = (Math.round(forecastDaily.list[i].temp.max - 273.15)) +'&deg;C';
        };
        if (forecastDaily.list[i].weather[0].id) {
          weatherForecastDailyWeathers[i-1].getElementsByClassName('WeatherIcon')[0].className = 'WeatherIcon s'+ forecastDaily.list[i].weather[0].id;
        };
        if (forecastDaily.list[i].weather[0].description) {
          weatherForecastDailyWeathers[i-1].getElementsByClassName('WeatherIcon')[0].title = forecastDaily.list[i].weather[0].description.capitalize();
        };
      };
    }
  }

})( window );
