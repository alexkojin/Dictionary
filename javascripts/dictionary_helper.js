// This class makes help to get more information about word
// It retrive translation, transcrption and more...
var DictionaryHelper = {
  buildQuery: function(text){
    return '/dictionary/json?callback=DictionaryHelper.parse&q='+ encodeURIComponent(text) +'&sl=en&tl=ru&restrict=pr,de&client=te';
  },
  
  translate: function(text, callback){
    console.log('translate');
    this.callback = callback;
    $.ajax({
      url: this.buildQuery(text),
      success: function(data){
        console.log('success');
        //console.log(data);
        //eval(data); // Call the parse method
      }
    });
  },
  
  parse: function(data, n, m){
    console.info(data);
    if(!data["primaries"]) return;
    var phonetic = data["primaries"][0]["terms"][1]["text"]; 
    var json = $.parseJSON(data);
    console.info("PHOHETIC", phonetic);
    
    var translation = [];
    var entries = data["primaries"][0]["entries"];
    $.each(entries, function(index, entry){
      var terms = [];
      $.each(entry.entries, function(index, obj){
        terms.push(obj["terms"][0]["text"]);
        console.log(obj["terms"][0]["text"]);
      });
      translation.push(terms.join(', '));
    });
    translation = translation.join('\n');
    //console.info(data["primaries"][0]["entries"]);
    DictionaryHelper.callback(phonetic, translation);
  }
};