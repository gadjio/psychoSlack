var request = require('request');
var AtmanWrapper = require('./src/AtmanWrapper');

console.log('starting test');

var wrapper = new AtmanWrapper(request);
var languageCode = 'en-us';
wrapper.createCandidate('test' + Date.now() +'@gmail.com', 'Marc', 'Beaudry', 'M', languageCode).then(
    //success callback
    function(success) {
        var authKey = success.body;
        var completed = false;
        (function loop() {
            if (completed) {
                wrapper.getSkills(authKey).then(
                    function(success) {
                        var skills = success.body;
                        console.log(skills);
                    }
                );
            } else (
                wrapper.getQuestion(authKey, languageCode).then(
                    //success callback
                    function(success) {
                        console.log("asdasd");
                        var assessmentQuestion = JSON.parse(success.body);
                        var questionId = assessmentQuestion.questionId;
                        console.log(questionId);
                        wrapper.answerQuestion(authKey, questionId, 'A', languageCode).then(
                            function(answerSucces) {
                                var assessmentResult = JSON.parse(answerSucces.body)
                                completed = assessmentResult.assesmentIsCompleted;
                                loop();
                            }
                        )
                    }
                )
            )
        }());

    }
);



/*
wrapper.createCandidate('newTest' + Date.now() +'@gmail.com', 'Marc', 'Beaudry', 'M', languageCode).then(
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
*/