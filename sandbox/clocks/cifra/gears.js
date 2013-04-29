/*!
 * Gears of CIFRA
 * Vasiliev SerGen, 2012
 * You can see this without punishment
 */



 var oldTimeHM = 0,
    oldTimeHm = 0,
    oldTimeMM = 0,
    oldTimeMm = 0,
    check = 0,
    time;

var clock = body.getElementsByTagName('clock')[0],
    hours = clock.getElementsByTagName('hours')[0],
    minutes = clock.getElementsByTagName('minutes')[0],
    hoursMaj = hours.getElementsByTagName('major')[0],
    minutesMaj = minutes.getElementsByTagName('major')[0],
    hoursMin = hours.getElementsByTagName('minor')[0],
    minutesMin = minutes.getElementsByTagName('minor')[0],

    hoursMajLeftDown = hoursMaj.getElementsByTagName('leftD')[0],
    hoursMajRightDown = hoursMaj.getElementsByTagName('rightD')[0],
    hoursMajLeft = hoursMaj.getElementsByTagName('left')[0],
    hoursMajRight = hoursMaj.getElementsByTagName('right')[0],

    hoursMinLeftDown = hoursMin.getElementsByTagName('leftD')[0],
    hoursMinRightDown = hoursMin.getElementsByTagName('rightD')[0],
    hoursMinLeft = hoursMin.getElementsByTagName('left')[0],
    hoursMinRight = hoursMin.getElementsByTagName('right')[0],

    minutesMajLeftDown = minutesMaj.getElementsByTagName('leftD')[0],
    minutesMajRightDown = minutesMaj.getElementsByTagName('rightD')[0],
    minutesMajLeft = minutesMaj.getElementsByTagName('left')[0],
    minutesMajRight = minutesMaj.getElementsByTagName('right')[0],

    minutesMinLeftDown = minutesMin.getElementsByTagName('leftD')[0],
    minutesMinRightDown = minutesMin.getElementsByTagName('rightD')[0],
    minutesMinLeft = minutesMin.getElementsByTagName('left')[0],
    minutesMinRight = minutesMin.getElementsByTagName('right')[0];

var start = getTime(),
    mmDelay = (60 - start.s) * 1000 - start.ms,
    mMDelay = (((10 - (start.m % 10)) * 60) - start.s) * 1000 - start.ms,
    hmDelay = (((60 - start.m) * 60) - start.s) * 1000 - start.ms;
if (start.h >= 20) {
  var hMDelay = (((((24 - start.h) * 60) - start.m) * 60) - start.s) * 1000 - start.ms + 10;
} else {
  var hMDelay = (((((10 - (start.h % 10)) * 60) - start.m) * 60) - start.s) * 1000 - start.ms + 10;
}

if (!window.localStorage) {
  try {
    var lightness = localStorage.getItem('lightness');
  } catch (e) {
    console.error(e);
  }
}


function hasClass(o, c) {
  return o.className.match(new RegExp('(\\s|^)'+c+'(\\s|$)'))
}

function addClass(o, c){
  var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
  if (re.test(o.className)) return
  o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}


function getTime () {
  var date = new Date(),
      result = {
        h : date.getHours(),
        m : date.getMinutes(),
        s : date.getSeconds(),
        ms : date.getMilliseconds()
      }
  return result;
}

(function () {

  function setTime(needTime, placeLeft, placeRight, left, right, dir) {

    var first = placeLeft,
        second = placeRight,
        firstDoor = left,
        secondDoor = right;
  
    if (dir == 'rl') {
      first = placeRight;
      second = placeLeft;
      firstDoor = right;
      secondDoor = left;
    }

    time = '0';
    
    if (needTime === 'hoursMajor') {
      time = getTime().h;
      if ((time>9) && (time<20)) {
        if(!hasClass(hoursMaj, 'indent')) addClass(hoursMaj, 'indent')
      } else {      
        if(hasClass(hoursMaj, 'indent')) removeClass(hoursMaj, 'indent')
      }
      if (time < 10) {
        if (oldTimeHM !== '10') {
          time = '10';
          oldTimeHM = time;
        }
      } else {
        if (oldTimeHM !== time.toString().slice(0,1)) {
          time = time.toString().slice(0,1);
          oldTimeHM = time;
        }
      }
    }
    if (needTime === 'hoursMinor') {
      time = getTime().h;
      if (time<10) {
        if (oldTimeHm !== time.toString().slice(0,1)) {
          time = time.toString().slice(0,1);
          oldTimeHm = time;
        }
      }
      else {
        if (oldTimeHm !== time.toString().slice(1,2)){
        time = time.toString().slice(1,2);
        oldTimeHm = time;
        }
      }
    }
    
    if (needTime === 'minutesMajor') {
      time = getTime().m;
      if ((time>9) && (time<20)) {
        if(!hasClass(minutesMaj, 'indent')) addClass(minutesMaj, 'indent')
      } else {
        if(hasClass(minutesMaj, 'indent')) removeClass(minutesMaj, 'indent')
      }
      if (time < 10) {
        if (oldTimeMM !== '10') {
          time = '10';
          oldTimeMM = time;
        }
      } else {
        if (oldTimeMM !== time.toString().slice(0,1)) {
          time = time.toString().slice(0,1);
          oldTimeMM = time;
        }
      }
    }
    if (needTime === 'minutesMinor') {
      time = getTime().m;
      if (time<10) {
        if (oldTimeMm !== time.toString().slice(0,1)) {
          time = time.toString().slice(0,1);
          oldTimeMm = time;
        } else {return}
      }
      else {
        if (oldTimeMm !== time.toString().slice(1,2)){
          time = time.toString().slice(1,2);
          oldTimeMm = time;
        } else {return}
      }
    }

    function changeTime (curCase) {

      var prevCase;
      var firstDoorNum = firstDoor.getElementsByTagName('num')[0],
          firstDoorCover = firstDoor.getElementsByTagName('cover')[0],
          secondDoorNum = secondDoor.getElementsByTagName('num')[0],
          secondDoorCover = secondDoor.getElementsByTagName('cover')[0];

      if(curCase == 0){prevCase=9} else {prevCase = curCase-1}
      if(curCase == 10){prevCase=5;curCase=0}
      first.innerHTML = curCase;
      second.innerHTML = prevCase;
      setTimeout(function(){second.innerHTML = curCase;}, 500);
      addClass(firstDoor, 'active');
      addClass(firstDoorCover, 'active');
      firstDoorNum.innerHTML = prevCase;
      if (dir == 'lr') {
        var i = 0.5;
        first.style.opacity = i;
        var opInt = setInterval( function (){ opAnimate(first, 250) }, 15), i = 1; function opAnimate (element, duration) { var delta = 15/duration; if (i <= 1) { i = i + delta; element.style.opacity = i; } else { element.style.opacity = 1; clearInterval(opInt); } }
      }
      setTimeout(
        function(){
          removeClass(firstDoor, 'active')
          removeClass(firstDoorCover, 'active');
          firstDoorNum.innerHTML = curCase;
        },500
      );
      setTimeout(
        function(){
          addClass(second, 'active');
          addClass(secondDoor, 'active')
          addClass(secondDoorCover, 'active');
          secondDoorNum.innerHTML = curCase;
          setTimeout(
            function(){
              removeClass(second, 'active');
              removeClass(secondDoor, 'active')
              removeClass(secondDoorCover,'active');
            },450
          );
        },200
      );

    }
    
    switch (time) {
    
    case '0':
      changeTime(0);
      break
      
    case '1':
      changeTime(1);
      break
      
    case '2':
      changeTime(2);
      break
      
    case '3':
      changeTime(3);
      break
      
    case '4':
      changeTime(4);
      break
      
    case '5':
      changeTime(5);
      break
      
    case '6':
      changeTime(6);
      break
      
    case '7':
      changeTime(7);
      break
      
    case '8':
      changeTime(8);
      break
      
    case '9':
      changeTime(9);
      break
      
    case '10':
      changeTime(10);
      break
      
    }

  }

  setTimeout( function () {
    setTime('hoursMajor',hoursMajLeftDown,hoursMajRightDown,hoursMajLeft,hoursMajRight,'rl');
    setTimeout(
      function () {
        (function hM () {
          setTime('hoursMajor',hoursMajLeftDown,hoursMajRightDown,hoursMajLeft,hoursMajRight,'rl');
          setTimeout( hM,  1000 * 60 * 60 * 10)
        })();
      }, hMDelay
    );
  },150);

  setTimeout( function () {
    setTime('hoursMinor',hoursMinLeftDown,hoursMinRightDown,hoursMinLeft,hoursMinRight,'lr');
    setTimeout(
      function () {
        (function hm () {
          setTime('hoursMinor',hoursMinLeftDown,hoursMinRightDown,hoursMinLeft,hoursMinRight,'lr');
          setTimeout(hm, 1000 * 60 * 60)
        })();
      }, hmDelay
    )
  },50);

  setTimeout(function(){
    setTime('minutesMajor',minutesMajLeftDown,minutesMajRightDown,minutesMajLeft,minutesMajRight,'rl');
    setTimeout(
      function () {
        (function mM(){
          setTime('minutesMajor',minutesMajLeftDown,minutesMajRightDown,minutesMajLeft,minutesMajRight,'rl');
          setTimeout(mM, 1000 * 60 * 10)
        })();
      }, mMDelay
  );},100);
  
  setTime('minutesMinor',minutesMinLeftDown,minutesMinRightDown,minutesMinLeft,minutesMinRight,'lr');
  setTimeout(
    function () {
      (function mm(){
        setTime('minutesMinor',minutesMinLeftDown,minutesMinRightDown,minutesMinLeft,minutesMinRight,'lr');
        setTimeout(mm, 1000*60)
      })();
    }, mmDelay
  );

})();


if (lightness == 1) {
  addClass(body, 'light')
}

clock.addEventListener('click', function () {
  if (hasClass(body, 'light')) {
    removeClass(body, 'light');
    localStorage.setItem('lightness', 0);
  } else {
    addClass(body, 'light');
    localStorage.setItem('lightness', 1);
  }
}, false)