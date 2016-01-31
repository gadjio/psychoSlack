var request = require('request');
var AtmanWrapper = require('./src/AtmanWrapper');

console.log('starting test');

var wrapper = new AtmanWrapper(request);
var languageCode = 'en-us';
/*wrapper.createCandidate('test123242ss2ss@gmail.com', 'Marc', 'Beaudry', 'M', languageCode).then(
    //success callback
    function(success) {
        var authKey = success.body;
        wrapper.getQuestion(authKey, languageCode).then(
            //success callback
            function(success) {
                console.log("asdasd");
                var assessmentQuestion = JSON.parse(success.body);
                var questionId = assessmentQuestion.questionId;
                console.log(questionId);
                wrapper.answerQuestion(authKey, questionId, 'A', languageCode);
            }
        )
    }
);*/

wrapper.createCandidate('test123242ss2ss@gmail.com', 'Marc', 'Beaudry', 'M', languageCode).then(
    //success callback
    function(success) {
        var authKey = success.body;
        console.log(authKey);
        wrapper.getSkills(authKey).then(
            function(success) {
                var skills = success.body;
                console.log(skills);
            }
        );
    }
);
