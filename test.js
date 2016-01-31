var request = require('request');
var AtmanWrapper = require('./src/AtmanWrapper');

console.log('starting test');

var wrapper = new AtmanWrapper(request);
var languageCode = 'en-us';
var email = 'test'+Date.now()+'@gmail.com';
console.log(email);

wrapper.createCandidate(email, 'Marc', 'Beaudry', 'M', languageCode).then(
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
                        wrapper.getCandidateState(authKey).then(
                            function(successState) {
                                var state = successState.body;
                                console.log(state);
                            }
                        );
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



var existingEmail = 'test@gmail.com';
console.log('Test auth');
wrapper.candidateAuthentication(existingEmail).then(
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
