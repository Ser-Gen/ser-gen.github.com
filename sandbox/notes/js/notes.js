function notes() {

document.createElement('notice');
document.createElement('upload');
document.createElement('list');
document.createElement('note');

$('body').append("<header><upload><input type='file' id='file' title='Загрузить ранее сохранённые записки' /> Загрузить</upload><span class='save' title='Сохранить записки к себе на компьютер'>Сохранить</span><span class='refresh' title='Обновить записки'>Обновить записки</span><span class='add' title='Добавить новую записку'>Новая записка</span></header><list class='group'></list><notice><h2>Здравствуйте!</h2><p>Чтобы создать свою первую записку, вы&nbsp;можете нажать на кнопку<br/>со&nbsp;знаком «+» на верхней панели<br/>или просто начать набирать её текст, с&nbsp;большой буквы.</p></notice>");

var borderBig = " |+|?!!?|+| ";
var borderSmall = " |+=+=+| ";
var firstRun;

var string = localStorage.getItem('string');

function readString(bigString){
  var bigStringOpen = bigString.split(borderBig);
  var littleString = [];
  var strMas = [];
  var imp;
  for (var i = 0; i < bigStringOpen.length; i++) {
    littleString.push(bigStringOpen[i].split(borderSmall));
  }
  for (var i = 0; i<littleString.length;i++) {
    strMas = littleString[i];
    if (strMas[0] == "") { return littleString.length-1; } else {
      if (strMas[2] == "true")  {imp = " class='imp'" } else { imp = "" }
      $('list').append("<note" + imp + "><span class='del'>Удалить</span><span class='imp'>Важная</span><h1 contenteditable>"+strMas[0]+"</h1>"+"<em>"+strMas[1]+"</em>"+"<strong>"+i+"</strong></note>");
    }
  }
  return littleString.length;
}

if ((string!=='')&&(string!==null)) {
  var length = readString(string);
} else {
  firstRun=true;
}

function writeString() {
  var newString = "";
  var list = document.getElementsByTagName('note');
  var length = document.getElementsByTagName('note').length;
  for (var i = 1; i < length+1; i++) {
    var header = $('note:nth-child('+i+') h1').html();
    var date = $('note:nth-child('+i+') em').html();
    var invisible = $('note:nth-child('+i+')').hasClass('del');
    var importance = $('note:nth-child('+i+')').hasClass('imp');
    var id = i-1;
    if (!invisible) {
      newString = newString + header + borderSmall + date + borderSmall + importance + borderSmall + id + borderBig;
    }
  }
  localStorage.setItem('string',newString);
  return newString;
}
console.log(writeString());

function intro() {
  if ($('note').length==0) {
    $('body').addClass('intro');
    $('header span.save, header span.refresh').css('display','none');
    if (!firstRun) {
      $('notice').addClass('wip').children('h2').remove();
    }
  } else {
    $('body').removeClass('intro');
    $('header span.save, header span.refresh').css('display','inline-block');
    firstRun=false;
  }
}

function counter() {
  var count = $('note').length;
  if (count > 0) {
    var impCount = $('note.imp').length;
    var delCount = $('note.del').length;
    var impText = '';
    var delText = '';
    if (impCount > 0) {impText=' / '+impCount+'!';}
    if (delCount > 0) {
      delText=' / '+delCount+'?';
      $('header span.refresh').css('display','inline-block');
    } else {
      $('header span.refresh').css('display','none');
    }
    $('title').html(count + impText + delText + ' &mdash; Записки');
  } else {
    $('title').html('Записки');
  }
};

$(document).ready(function(){
  intro();
  counter();
})

var newText = true;

$('note span.del').live('click', function() {
  $(this).parents('note').toggleClass('del');
  writeString();
  counter();
});

$('note span.imp').live('click', function() {
  $(this).parents('note').toggleClass('imp');
  writeString();
  counter();
});
$('note h1').live('focus', function(){
  if($(this).text()==""){
    $(this).parents('note').remove();
    length = length - 1;
  }
  newText = false;
  writeString();
  intro();
  counter();
});
$('note h1').live('blur', function(){
  if($(this).text()==""){
    $(this).parents('note').remove();
    length = length - 1;
  }
  newText = true;
  writeString();
  intro();
  counter();
});
$('note textarea').live('blur', function() {
  if ($(this).val() == "") {
    $(this).parents('note').remove();
    length = length - 1;
  }
  $(this).replaceWith( "<h1 contenteditable>" + $(this).val() + "</h1>" );
  newText = true;
  writeString();
  intro();
  counter();
});

$('span.add').live('click', function(){
  if (newText) {
    length = length + 1;
    $('list').prepend("<note><span class='del'>Удалить</span><span class='imp'>Важная</span></a><textarea></textarea><em>2</em><strong>"+1+"</strong></note>");
    $('textarea').focus();
    newText = false;
  }
  intro();
  counter();
});

$('span.save').live('click', function(){
  var zip = new JSZip();
  var stringBig = 'NOTES '+ writeString();
  zip.add("Your.notes", stringBig);
  content = zip.generate();
  location.href="data:application/zip;base64,"+content;
  alert('В сохранённом ZIP-архиве будет файл .notes — это и есть ваши записки');
});


$('span.refresh').live('click', function(){
  $('note.del').remove();
  intro();
  counter();
});

function handleFileSelect(evt) {
  var files = evt.target.files;
 f = files[0];
  var reader = new FileReader();
  reader.onload = (function(theFile) {
    return function(e) {
      var span = document.createElement('span');
      if(escape(theFile.name.slice(-5)) ==  'notes') {
        if (e.target.result.slice(0,5) == 'NOTES') {
          readString(e.target.result.slice(6));
          writeString();
          intro();
          counter();
        } else {
          alert('Файл неверный!');
        }
      } else {
        alert('Файл не с тем расширением. Должно быть .notes');
      }
    };
  })(f);
  reader.readAsText(f);
}
document.getElementById('file').addEventListener('change', handleFileSelect, false);
  
$('#file').hover(
  function(){
    $(this).parents('upload').addClass('hover');
  },
  function(){
    $(this).parents('upload').removeClass('hover');
  }
)

document.onkeydown = function(e) {
  e = e || window.event;
  if (e.shiftKey && (((e.keyCode > 47) && (e.keyCode < 91)) || (e.keyCode == 188) || (e.keyCode == 190) || (e.keyCode == 192) || (e.keyCode == 219) || (e.keyCode == 221) || (e.keyCode == 222))) {
    if (newText) {
      length = length + 1;
      $('list').prepend("<note><span class='del'>Удалить</span><span class='imp'>Важная</span><textarea></textarea><em>2</em><strong>"+1+"</strong></note>");
      $('textarea').focus();
      newText = false;
    }
    intro();
    counter();
  }
  if (e.keyCode == 27) {
    if (!newText) {
      if ($('textarea').val() == "") {
        $('textarea').parents('note').remove();
        length = length - 1;
      }
      $('textarea').replaceWith( "<h1 contenteditable>" + $('textarea').val() + "</h1>" );
      newText = true;
    }
    $('h1:focus').blur();
    writeString();
    intro();
    counter();
  }
  return true;
}

}

notes();