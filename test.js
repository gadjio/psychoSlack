var request = require('request');
var AtmanWrapper = require('./src/AtmanWrapper');

console.log('starting test');

var wrapper = new AtmanWrapper(request);
var languageCode = 'en-us';
wrapper.CreateCandidate('test12324sss@gmail.com', 'Marc', 'Beaudry', 'M', languageCode).then(
    //success callback
    function(data, status) {
        wrapper.GetQuestion(data, languageCode);
    },
    //failure callback
    function(data, status) {
    }
);