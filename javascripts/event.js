$(document).ready(function() {
  $("#add-word-form").submit(function() {
    var newWord = {text: $('#add-text-field').val(),
                  translation: $('#add-translation-field').val(),
                  phonetic: $('#add-phonetic-field').val(),
                  learned: false};
    // add value to database
    DB.addWord(newWord, function(word){
      UI.addWordToList(word);
      UI.redirectToListWordsPage();
      UI.clearAddWordForm();
    });

    return false;
  });
  
  $('#save-and-continue-btn').click(function(){
    var newWord = {text: $('#add-text-field').val(),
                  translation: $('#add-translation-field').val(),
                  phonetic: $('#add-phonetic-field').val(),
                  learned: false};
    // add value to database
    DB.addWord(newWord, function(word){
      UI.addWordToList(word);
      UI.clearAddWordForm();
    });
  });
  
  $("#edit-word-form").submit(function() {
    window.currentWord.text($('#edit-text-field').val());
    window.currentWord.translation($('#edit-translation-field').val());
    window.currentWord.phonetic($('#edit-phonetic-field').val());
    
    DB.save(function(){
      UI.updateWord(window.currentWord)
      UI.redirectToListWordsPage();
      UI.clearEditWordForm();
    });
    return false;
  });
  
  // Swipe to check a word as learned
  $('#list-words li').live('swipe', function(event, ui){
    var learned = !$(this).hasClass('learned');
    DB.updateWord($(this).attr('id'), {learned: learned});
    $(this).toggleClass('learned');
  });
  
  $('#add-word-page').live('pageshow',function(event, ui){
    console.log('Word page add');
    $('#add-text-field').focus();
  });
  
  $('#word-page').live('pageshow',function(event, ui){
    console.log('Word page show');
    //UI.showWord(currentWordId);
  });
  
  $('#edit-word-page').live('pageshow',function(event, ui){
    console.log('Word page edit');
    UI.editWord(window.currentWord);
  });

  $('#list-words a').live('click', function(event){
    currentWordId = $(this).closest('li').attr('id');
    UI.showWord(currentWordId)
    console.log('CLICKED', currentWordId);
    console.log('EVENT', event);
    return false;
   });
   
   $('#delete-word').live('click', function(){
     if(window.currentWord){
       DB.deleteWord(window.currentWord, function(){
         UI.deleteWordFromList(window.currentWord);
         // Back to the list of words page
         UI.redirectToListWordsPage();
       });
     }
   });
   
   $('.translate-by-google').live('click', function(){
     var text = $(this).closest('form').find('input[type=text]').val();
     self = this;
     DictionaryHelper.translate(text, function(phonetic, translation){
       var form = $(self).closest('form');
       if(translation) form.find('textarea').val(translation);
       if(phonetic){
         form.find('.phonetic-field').html(phonetic);
         form.find('input[type=hidden]').val(phonetic);
       }
     });
   });
});