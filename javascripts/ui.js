var UI = {
  
  // LIST OF WORDS
  templateListWordsItem: function(word){
    var learnedClass = word.learned() ? 'learned': '';
    return '<li id="'+ word.id +'"" class="'+ learnedClass + '" data-role="option">' +
           '<a href="#word-page">'+
           '<p class="ui-block-a text">'+ word.text() + '&nbsp;' + word.phonetic() +
           '</p><p class="ui-block-b translation">'+ UI.summaryTranslation(word.translation()) +
           '</p></a></li>';
  },
  
  summaryTranslation: function(translation){
    var words = [];
    var terms = translation.split('\n');
    for(var i=0; i < terms.length; i+=1){
      words.push(terms[i].split(', ')[0]);
    }
    
    return words.join(', ');
  },
  
  addWordToList: function(word){
    $('#list-words').prepend(UI.templateListWordsItem(word));
    $('#list-words').listview('refresh');
  },
  
  deleteWordFromList: function(word){
    console.log('UI delete word:', word)
    $('#list-words #' + word.id).remove();
    $('#list-words').listview('refresh');
  },

  importListWords: function(list){
    list.forEach(function (word) {
      $('#list-words').prepend(UI.templateListWordsItem(word));
    });
    $('#list-words').listview('refresh');
  },
  
  // SHOW WORD PAGE
  templateWordShow: function(word){
    var translationBody = "";
    var terms = word.translation().split('\n');
    for(var i=0; i < terms.length; i++){
      translationBody += '<p>'+ terms[i] +'</p>'; 
    }
    // audio tag
    // It's test feature 
    var source = 'http://www.gstatic.com/dictionary/static/sounds/de/0/'+ word.text().toLowerCase() +'.mp3';
    var audio = '<audio controls="controls" loop="true"><source src="'+ source +'" /></audio>';
    var html = '<dl><dt>'+ word.text() + '&nbsp;' + word.phonetic() + '&nbsp;'+ audio +'</dt>' +
               '<dd>'+ translationBody + '</dd></dl>';
    return html;
  },
  
  showWord: function(wordId){
    if(!wordId) return;
    DB.findWord(wordId, function(word){
      window.currentWord = word;
      console.log('heeee');
      $('#word-page-wrapper').html(UI.templateWordShow(word));
    })
  },
  
  editWord: function(word){
    $('#edit-text-field').val(word.text());
    $('#edit-translation-field').val(word.translation());
  },
  
  updateWord: function(word){
    $('#list-words #' + word.id + ' .text').html(word.text() + '&nbsp;' + word.phonetic());
    $('#list-words #' + word.id + ' .translation').html(UI.summaryTranslation(word.translation()));
    $('#list-words').listview('refresh');
  },
  
  clearAddWordForm: function(){
    $('#add-text-field').val('');
    $('#add-translation-field').val('');
    $('#add-phonetic-field').val('');
    $('.phonetic-field').html('');
  },
  
  clearEditWordForm: function(){
    $('#edit-text-field').val('');
    $('#edit-translation-field').val('');
    $('#edit-phonetic-field').val('');
    $('.phonetic-field').html('');
  },
  
  redirectToListWordsPage: function(){
    $.mobile.changePage('#list-words-page', 'slide', false);
    window.location.hash = '';
  }
}

