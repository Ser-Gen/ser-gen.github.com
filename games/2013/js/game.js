function coreGame(a){var c=this;c.drawBuffer=[];c.showBuffer=[];c.intervalDraw=!1;c.intervalShow=!1;c.prevTimeShow=0;c.prevTimeDraw=0;void 0==a&&(a={});c.speedDraw=void 0!=a.speedDraw?a.speedDraw:16;c.speedShow=void 0!=a.speedShow?a.speedShow:16;c.start=function(){var a=(new Date).getTime();c.prevTimeDraw=a+c.speedDraw;c.prevTimeShow=a+c.speedShow;c.intervalDraw=setTimeout(c.draw,c.speedDraw);c.intervalShow=setTimeout(c.show,c.speedShow);c.drawBuffer=[];c.showBuffer=[]};c.stop=function(){c.intervalDraw&& clearTimeout(c.intervalDraw);c.intervalShow&&clearTimeout(c.intervalShow);c.intervalDraw=!1;c.intervalShow=!1};c.show=function(){var a=c.showBuffer;c.showBuffer=[];a.reverse();for(var d;d=a.pop();)d();do c.prevTimeShow+=c.speedShow;while((new Date).getTime()>c.prevTimeShow);c.intervalShow=setTimeout(c.show,c.prevTimeShow-(new Date).getTime())};c.pushShow=function(a){c.showBuffer.push(a)};c.clearShow=function(){c.showBuffer=[]};c.draw=function(){do{var a=c.drawBuffer;c.drawBuffer=[];a.reverse();for(var d;d= a.pop();)if(d[0]--,0<d[0])c.drawBuffer.push(d);else if(5==d.length)d[1](d[2],d[3],d[4]);else if(4==d.length)d[1](d[2],d[3]);else if(3==d.length)d[1](d[2]);else d[1]();c.prevTimeDraw+=c.speedDraw}while((new Date).getTime()>c.prevTimeDraw);c.intervalDraw=setTimeout(c.draw,c.prevTimeDraw-(new Date).getTime())};c.pushDraw=function(a,d,e,h,g){var f=[];void 0!=d?f.push(Math.ceil(d)):f.push(1);f.push(a);void 0!=e&&f.push(e);void 0!=h&&f.push(h);void 0!=g&&f.push(g);c.drawBuffer.push(f)};c.clearDraw=function(){c.drawBuffer= []}}function drawImage(a){ctx.drawImage(a.image,a.scrollX,a.scrollY,a.width,a.height,a.X,a.Y,a.width,a.height)}function drawStart(a){a.bShow||(a.bShow=!0,void 0!=a.show&&a.show());a.bDraw||(a.bDraw=!0,void 0!=a.draw&&a.draw())}function clearCanvas(){ctx.clearRect(0,0,canvasWidth,canvasHeight);cGame.pushShow(clearCanvas)} function isContactObj(a,c){var b=void 0!=a.contactX?a.contactX:0,d=void 0!=a.contactY?a.contactY:0,e=a.X+b,b=a.X+b+(void 0!=a.contactWidth?a.contactWidth:a.width),h=a.Y+d,d=a.Y+d+(void 0!=a.contactHeight?a.contactHeight:a.height),g=void 0!=c.contactX?a.contactX:0,f=void 0!=c.contactY?a.contactY:0,j=c.X+g,g=c.X+g+(void 0!=c.contactWidth?c.contactWidth:c.width),k=c.Y+f,f=c.Y+f+(void 0!=c.contactHeight?c.contactHeight:c.height);return e>=j&&e<=g&&h>=k&&h<=f||b>=j&&b<=g&&h>=k&&h<=f||e>=j&&e<=g&&d>=k&& d<=f||b>=j&&e<=g&&d>=k&&d<=f?!0:!1} function drawGame(){var a=this;a.bShow=!1;a.bDraw=!1;a.drawSpeed=1;a.holes=[];a.snakes=[];a.time=!1;a.life=!1;a.countSnakes=0;a.drawStepShowSnake=150;a.drawSpeedShowSnake=130;a.resetGame=function(){for(var c=a.holes.length-1;0<=c;c--)a.holes[c].bShow=!1,delete a.holes[c];for(c=a.snakes.length-1;0<=c;c--)a.snakes[c].bDraw=!1,delete a.snakes[c];a.drawStepShowSnake=150;a.drawSpeedShowSnake=130;a.life=new drawLife;a.time=new drawTime;a.holes=[];a.snakes=[];a.countSnakes=0};a.drawGameStart=function(){(new Date).getHours(); a.bDraw||($(".pageMain").removeClass("page-start page-end"),a.resetGame(),a.life.start(),a.time.start(),drawStart(a),a.drawCreateHole(),a.drawCreateSnake())};a.draw=function(){if(a.bDraw&&a.time.bDraw){for(var c=0;c<a.snakes.length;c++)if(!a.snakes[c].lockHole){a.drawShowSnake(c);break}cGame.pushDraw(a.draw,a.drawSpeed)}else a.drawGameStop()};a.mouseClick=function(c,b){if(a.bDraw)for(var d={X:c,Y:b,contactX:0,contactY:0,contactWidth:1,contactHeight:1},e=0;e<a.snakes.length;e++)a.snakes[e].lockHole&& (a.snakes[e].bDraw&&isContactObj(d,a.snakes[e]))&&a.drawDamage(a.snakes[e])};a.drawDamage=function(c){c.damage()&&(a.life.damage(),c.damageBonus&&(a.time.drawTime+=5E3),0<a.drawSpeedShowSnake&&a.drawSpeedShowSnake--)};a.drawCreateHole=function(){if(a.bDraw){do{for(var c=new drawHole,b=!1,d=0;d<a.holes.length;d++)b=b||isContactObj(c,a.holes[d]);b||(c.start(),a.holes.push(c))}while(10>a.holes.length)}};a.drawCreateSnake=function(){var c=a.randomHole();if(a.bDraw&&0<=c){do{var c=a.randomHole(),b=new drawSnake(a.holes[c], a.drawSpeedShowSnake);b.lockHole&&(a.snakes.push(b),cGame.pushDraw(a.snakes[a.countSnakes].start,20),a.countSnakes++)}while(4>a.snakes.length&&0<=c)}};a.drawShowSnake=function(c){if(a.bDraw&&!a.snakes[c].lockHole){var b=a.randomHole();0<=b&&(b=new drawSnake(a.holes[b],a.drawSpeedShowSnake),b.lockHole&&(a.countSnakes++,0<a.drawStepShowSnake&&a.drawStepShowSnake--,a.snakes[c].bDraw=!1,a.snakes[c]=b,cGame.pushDraw(a.snakes[c].start,20+Math.ceil(a.drawStepShowSnake*Math.random()))))}};a.randomHole=function(){for(var c= -1,b=[],d=0;d<a.holes.length;d++)a.holes[d].bLockSnake||b.push(d);0<b.length&&(0.5<Math.random()&&b.reverse(),0<b.length&&(b.sort(function(){return 0.5<Math.random()}),c=b.pop()));return c};a.drawGameStop=function(){a.bDraw=!1;for(var c=0;c<a.snakes.length;c++)a.snakes[c].bDraw=!1;a.life.bShow=!1;a.time.bDraw=!1;var c=parseInt(a.life.drawLife),b=a.countSnakes,d=c*b;Math.round(b*d/d.toString().length);0==c%10||5<=c%10||11<=c%100&&14>=c%100?$(".screen-end h2").html("\u043f\u043e\u043f\u0430\u0434\u0430\u043d\u0438\u0439"): 1==c%10?$(".screen-end h2").html("\u043f\u043e\u043f\u0430\u0434\u0430\u043d\u0438\u0435"):$(".screen-end h2").html("\u043f\u043e\u043f\u0430\u0434\u0430\u043d\u0438\u044f");$(".screen-end .result").html(c);$(".pageMain").removeClass("page-start").addClass("page-end")}} function drawHole(){var a=this;a.image=imageHole;a.scrollX=82*Math.round(2*Math.random());a.scrollY=0;a.width=82;a.height=82;a.X=Math.round((831-a.width)*Math.random())+66;a.Y=Math.round((517-a.height)*Math.random())+98;a.contactX=-5;a.contactY=-5;a.contactWidth=92;a.contactHeight=92;a.bShow=!1;a.bLockSnake=!1;a.start=function(){drawStart(a)};a.show=function(){if(a.bShow||a.bLockSnake)drawImage(a),cGame.pushShow(a.show)}} function drawSnake(a,c){var b=this;b.image=imageSnake;b.damageBonus=!1;b.viewStep=40;b.X=0;b.Y=0;b.scrollX=0;b.scrollY=0;b.width=106;b.height=107;0.91<Math.random()&&(b.scrollY=2*b.height,b.damageBonus=!0,c=Math.ceil(c/10),b.viewStep=30);b.bShow=!1;b.bDraw=!1;b.lockHole=!1;b.imageCur=0;b.showImageCount=8;b.showSpeed=2;b.viewSpeed=1;b.snowball=!1;void 0!=a&&(b.X=a.X-13,b.Y=a.Y-13,a.bLockSnake=!0,b.lockHole=!0);c=void 0==c?100:0<parseInt(c)?parseInt(c):0;b.viewStep+=c;b.start=function(){b.lockHole&& drawStart(b)};b.show=function(){b.bShow&&(drawImage(b),cGame.pushShow(b.show))};b.draw=function(){b.bDraw?(b.scrollX=b.width*b.imageCur,b.imageCur++,b.imageCur<b.showImageCount?cGame.pushDraw(b.draw,b.showSpeed):b.drawView()):b.drawHide()};b.drawView=function(){b.bDraw?(b.viewStep--,0<b.viewStep?cGame.pushDraw(b.drawView,b.viewSpeed):(b.imageCur-=2,cGame.pushDraw(b.drawHide,b.viewSpeed))):(b.imageCur-=2,b.drawHide())};b.drawHide=function(){b.bDraw=!1;!1!=b.snowball&&b.snowball.bDraw?cGame.pushDraw(b.drawHide, b.showSpeed):!1!=b.snowball?(b.scrollY+=b.height,b.snowball=!1,b.damageBonus&&(b.bonus=new drawBonus(b.X+Math.round(b.width/2),b.Y-20),b.bonus.start()),cGame.pushDraw(b.drawHide,b.showSpeed)):0<b.imageCur?(b.imageCur--,b.scrollX=b.width*b.imageCur,cGame.pushDraw(b.drawHide,b.showSpeed)):(a.bLockSnake=!1,b.lockHole=!1,b.bShow=!1)};b.damage=function(){return b.bDraw?(b.snowball=new drawSnowball(b.X+Math.round(b.width/2),b.Y),b.snowball.start(),b.bDraw=!1,!0):!1}} function drawSnowball(a,c){var b=this;b.image=imageSnowball;b.scrollX=0;b.scrollY=0;b.width=192;b.height=204;b.X=a-Math.round(b.width/2);b.Y=c;b.bShow=!1;b.bDraw=!1;b.drawSpeed=2;b.imageCur=0;b.showImageCount=9;b.start=function(){drawStart(b)};b.show=function(){b.bShow&&(drawImage(b),cGame.pushShow(b.show))};b.draw=function(){b.bDraw?(b.imageCur++,b.imageCur<b.showImageCount?(b.scrollX=b.width*b.imageCur,cGame.pushDraw(b.draw,b.drawSpeed)):(b.bDraw=!1,b.bShow=!1)):b.bShow=!1}} function drawBonus(a,c){var b=this;b.image=imageBonus;b.scrollX=0;b.scrollY=0;b.width=129;b.height=32;b.X=a-Math.round(b.width/2);b.Y=c;b.bShow=!1;b.bDraw=!1;b.drawSpeed=3;b.imageCur=0;b.showImageCount=10;b.start=function(){drawStart(b)};b.show=function(){b.bShow&&(drawImage(b),cGame.pushShow(b.show))};b.draw=function(){b.bDraw?(b.imageCur++,b.imageCur<b.showImageCount?(b.scrollX=b.width*b.imageCur,cGame.pushDraw(b.draw,b.drawSpeed)):(b.bDraw=!1,b.bShow=!1)):b.bShow=!1}} function drawLife(){var a=this;a.image=imageLifeTime;a.X=748;a.Y=22;a.scrollX=0;a.scrollY=0;a.width=39;a.height=39;a.bShow=!1;a.drawLife=0;a.fillStyle="#000000";a.font="bold "+drawLevelFontSize+"px sans-serif";a.symb=String.fromCharCode(215);a.start=function(){drawStart(a)};a.show=function(){a.bShow&&(drawImage(a),ctx.font=a.font,ctx.fillStyle=a.fillStyle,ctx.fillText(a.symb+a.drawLife,a.X+a.width,a.Y+29),cGame.pushShow(a.show))};a.damage=function(){a.bShow&&a.drawLife++}} function drawTime(){var a=this;a.image=imageLifeTime;a.X=859;a.Y=22;a.scrollX=39;a.scrollY=0;a.width=39;a.height=39;a.bShow=!1;a.bDraw=!1;a.drawSpeed=10;a.drawTime=6E4;a.fillStyle="#000000";a.font="bold "+drawLevelFontSize+"px sans-serif";a.start=function(){a.drawTime+=(new Date).getTime();drawStart(a)};a.show=function(){if(a.bShow){drawImage(a);var c=Math.ceil((a.drawTime-(new Date).getTime())/1E3);ctx.font=a.font;ctx.fillStyle=a.fillStyle;ctx.fillText(Math.floor(c/60)+":"+(10>c%60?"0":"")+c%60, a.X+a.width,a.Y+29);cGame.pushShow(a.show)}};a.draw=function(){a.bDraw?0<a.drawTime-(new Date).getTime()?cGame.pushDraw(a.draw,a.drawSpeed):(a.bDraw=!1,a.bShow=!1):a.bShow=!1}}canvasWidth=980;canvasHeight=630;gameSpeed=16;imageHole=new Image;imageHole.src="img/holes-sprite-82x82.png";imageSnake=new Image;imageSnake.src="img/snake-sprite-animation.png";imageSnowball=new Image;imageSnowball.src="img/snow-ball-sprite-192x204.png";imageBonus=new Image;imageBonus.src="img/bonus-animation-sprite-129x32.png"; imageLifeTime=new Image;imageLifeTime.src="img/hud-sprite-39x39.png";drawLevelSpeed=20;drawLevelFontSize=24;var isTouch="ontouchstart"in window,actionEvent=isTouch?"touchstart":"mousedown"; $(document).ready(function(){drawCanvas=document.getElementById("drawCanvas");drawCanvas.width=canvasWidth;drawCanvas.height=canvasHeight;drawCanvas&&drawCanvas.getContext&&(ctx=drawCanvas.getContext("2d"));if(isTouch){var a,c,b=function(b){a=c=0;if(b.offsetParent){do a+=b.offsetLeft,c+=b.offsetTop;while(b=b.offsetParent)}};b(drawCanvas);$(window).resize(function(){b(drawCanvas)})}cGame=new coreGame({speedDraw:gameSpeed,speedShow:gameSpeed});cGame.start();clearCanvas();game=new drawGame;document.body.ontouchmove= function(a){a&&a.preventDefault&&a.preventDefault();a&&a.stopPropagation&&a.stopPropagation();return!1};drawCanvas.addEventListener(actionEvent,function(b){var e="mousedown"==b.type;game.mouseClick(e?void 0==b.offsetX?b.layerX:b.offsetX:b.touches[0].clientX-a,e?void 0==b.offsetY?b.layerY:b.offsetY:b.touches[0].clientY-c)})});