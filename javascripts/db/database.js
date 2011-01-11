var DB = {
  findWord: function(id, callback){
    Word.all().filter("id", '=', id).one(null, function(word){
      callback(word);
    });
  },
  
  addWord: function(newWord, callback){
    var word = new Word(newWord);
    persistence.add(word);
    persistence.flush(null, callback(word))
  },
  
  updateWord: function(id, params){
    DB.findWord(id, function(word){
      console.log('Updated', id);
      if(params.text !== undefined) word.text(params.text); 
      if(params.translation !== undefined) word.translation(params.translation); 
      if(params.phonetic !== undefined) word.phonetic(params.phonetic); 
      if(params.learned !== undefined) word.learned(params.learned); 

      persistence.flush();
    })
  },
  
  deleteWord: function(word, callback){
    persistence.remove(word);
    persistence.flush(null, callback());
  },
  
  // Save all changes in models
  save: function(callback){
    persistence.flush(null, function(){
      callback();
    });
  }
};


$(function() {
  if (window.openDatabase) {
    persistence.store.websql.config(persistence, "dictionary", 'database', 5 * 1024 * 1024);
  } else {
    console.log('Database is not support sqlite')
  }
  persistence.db.log = true;
  
  Word = persistence.define('Words', {
            text: "TEXT",
            translation: "TEXT",
            phonetic: "TEXT",
            learned: "BOOL"
          });
  
  persistence.schemaSync(null, function(tx) {
     console.log('SCHEMA SYNC');
      // Get all words
      Word.all().list(null, function (results) {
        UI.importListWords(results);
      });
    });

});
