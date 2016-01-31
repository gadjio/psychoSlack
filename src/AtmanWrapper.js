function AtmanWrapper(request) {
    this.request = request;
    this.authorization = 'Basic cGhpbGlwcGUuZ3JhbmRtb250QGdtYWlsLmNvbTpoTlV1ajI=';
    this.createCandidateUrl = 'https://sandbox.atmanco.com/api/v1/CreateCandidate';
    this.getQuestionUrl = 'https://sandbox.atmanco.com/api/v1/GetAssessmentInformation';
    this.answerQuestionUrl = 'https://sandbox.atmanco.com/api/v1/GetAssessmentInformation';
};

AtmanWrapper.prototype.getRequestInfoData = function(authKey) {
    return { AuthenticationKey : authKey };
};

AtmanWrapper.prototype.createCandidate = function (email, firstname, lastname, gender, language) {
    console.log("createCandidate");
    var self = this;

    return new Promise(function(success, failure) {

        var body = {
            selectedSexChoice: gender,
            candidateFirstname: firstname,
            candidateLastname: lastname,
            candidateCompany: 'psychoSlack',
            candidateNip: '1234',
            selectedLanguageChoice: language,
            candidateEmail: email,
            receiveOffers: null
        };

        var options = {
            url: self.createCandidateUrl,
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Authorization': self.authorization,
                'Content-Type': 'application/json'
            }
        };

        console.log('before request createCandidate');
        self.request(options, function (error, response, body) {
            console.log("createCandidate received");
            console.log(response.statusCode);
            console.log(body);
            if (!error && response.statusCode == '200') {
                console.log("createCandidate ok");
                success({body:body});
            } else {
                console.log("createCandidate error");
                failure(null);
            }
        });
    });
};

AtmanWrapper.prototype.getQuestion = function (authKey, languageCode) {

    console.log("getQuestion");
    var self = this;

    return new Promise(function(success, failure) {
        var body = {
            LanguageCode: languageCode,
            RequestInfo: self.getRequestInfoData(authKey)
        };

        var options = {
            url: self.getQuestionUrl,
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Authorization': self.authorization,
                'Content-Type': 'application/json'
            }
        };

        console.log('before request getQuestion');
        self.request(options, function (error, response, body) {
            console.log("response received getQuestion");
            console.log(response.statusCode);
            console.log(body);
            if (!error && response.statusCode == '200') {
                console.log("getQuestion ok");
                success({body:body});
            } else {
                console.log("getQuestion error");
                failure(null);
            }
        });
    });
};

AtmanWrapper.prototype.answerQuestion = function (authKey, questionId, answer, languageCode) {

    console.log("answerQuestion");
    var self = this;

    return new Promise(function(success, failure) {
        var body = {
            LanguageCode: languageCode,
            QuestionId: questionId,
            SelectedAnswer: answer,
            RequestInfo: self.getRequestInfoData(authKey)
        };

        var options = {
            url: self.answerQuestionUrl,
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Authorization': self.authorization,
                'Content-Type': 'application/json'
            }
        };

        console.log('before request answerQuestion');
        self.request(options, function (error, response, body) {
            console.log("answerQuestion received");
            if (!error && response.statusCode == '200') {
                console.log("answerQuestion ok");
                success({body:body});
            } else {
                console.log("answerQuestion error");
                failure(null);
            }
        });
    });
};

module.exports = AtmanWrapper;
