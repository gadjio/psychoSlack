function AtmanWrapper(request, debug) {
    this.debug = debug;
    this.request = request;
    this.authorization = 'Basic cGhpbGlwcGUuZ3JhbmRtb250QGdtYWlsLmNvbTpoTlV1ajI=';
    this.createCandidateUrl = 'https://sandbox.atmanco.com/api/v1/CreateCandidate';
    this.getQuestionUrl = 'https://sandbox.atmanco.com/api/v1/GetAssessmentInformation';
    this.answerQuestionUrl = 'https://sandbox.atmanco.com/api/v1/GetAssessmentInformation';
    this.getSkillsUrl = 'https://sandbox.atmanco.com/api/v1/GetSkills';
    this.candidateAuthenticationUrl = 'https://sandbox.atmanco.com/api/v1/CandidateAuthentication';
    this.getCandidateStateUrl = 'https://sandbox.atmanco.com/api/v1/GetCandidateState';
};

AtmanWrapper.prototype.getRequestInfoData = function(authKey) {
    return { AuthenticationKey : authKey };
};

AtmanWrapper.prototype.createCandidate = function (email, firstname, lastname, gender, language) {
    if(this.debug) console.log("createCandidate");
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

        if(self.debug) console.log('before request createCandidate');
        self.request(options, function (error, response, body) {
            if(self.debug) console.log("createCandidate received");
            if(self.debug) console.log(response.statusCode);
            if(self.debug) console.log(body);
            if (!error && response.statusCode == '200') {
                if(self.debug) console.log("createCandidate ok");
                success({body:body});
            } else {
                if(this.debug) console.log("createCandidate error");
                failure(null);
            }
        });
    });
};

AtmanWrapper.prototype.getQuestion = function (authKey, languageCode) {

    if(this.debug) console.log("getQuestion");
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

        if(self.debug) console.log('before request getQuestion');
        self.request(options, function (error, response, body) {
            if(self.debug) console.log("response received getQuestion");
            if(self.debug) console.log(response.statusCode);
            if(self.debug) console.log(body);
            if (!error && response.statusCode == '200') {
                if(self.debug) console.log("getQuestion ok");
                success({body:body});
            } else {
                if(self.debug) console.log("getQuestion error");
                failure(null);
            }
        });
    });
};

AtmanWrapper.prototype.answerQuestion = function (authKey, questionId, answer, languageCode) {

    if(this.debug) console.log("answerQuestion");
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

        if(self.debug) console.log('before request answerQuestion');
        self.request(options, function (error, response, body) {
            if(self.debug) console.log("answerQuestion received");
            if (!error && response.statusCode == '200') {
                if(self.debug) console.log("answerQuestion ok");
                success({body:body});
            } else {
                if(self.debug) console.log("answerQuestion error");
                failure(null);
            }
        });
    });
};

AtmanWrapper.prototype.getSkills = function (authKey) {
    if(this.debug) console.log("getSkills");
    var self = this;

    return new Promise(function(success, failure) {
        var body = {
            VisualizationCode: "BLOOMED",
            RequestInfo: self.getRequestInfoData(authKey)
        };

        var options = {
            url: self.getSkillsUrl,
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Authorization': self.authorization,
                'Content-Type': 'application/json'
            }
        };

        if(self.debug) console.log('before request getSkills');
        self.request(options, function (error, response, body) {
            if(self.debug) console.log("getSkills received");
            if (!error && response.statusCode == '200') {
                if(self.debug) console.log("getSkills ok");
                success({body:body});
            } else {
                if(self.debug) console.log("getSkills error");
                failure(null);
            }
        });
    });
};

AtmanWrapper.prototype.candidateAuthentication = function (email) {
    if(this.debug) console.log("candidateAuthentication");
    var self = this;

    return new Promise(function(success, failure) {
        var body = {
            candidateEmail: email,
            candidatePin  : "1234"
        };

        var options = {
            url: self.candidateAuthenticationUrl,
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Authorization': self.authorization,
                'Content-Type': 'application/json'
            }
        };

        if(self.debug) console.log('before request candidateAuthentication');
        self.request(options, function (error, response, body) {
            if(self.debug) console.log("candidateAuthentication received");
            if (!error && response.statusCode == '200') {
                if(self.debug) console.log("candidateAuthentication ok");
                success({body:body});
            } else {
                if(self.debug) console.log("candidateAuthentication error");
                failure(null);
            }
        });
    });
};


AtmanWrapper.prototype.getCandidateState = function (authKey) {
    if(this.debug) console.log("GetCandidateState");
    var self = this;

    return new Promise(function(success, failure) {
        var body = {
            RequestInfo: self.getRequestInfoData(authKey)
        };

        var options = {
            url: self.getCandidateStateUrl,
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Authorization': self.authorization,
                'Content-Type': 'application/json'
            }
        };

        if(self.debug) console.log('before request GetCandidateState');
        self.request(options, function (error, response, body) {
            if(self.debug) console.log("GetCandidateState received");
            if (!error && response.statusCode == '200') {
                if(self.debug) console.log("GetCandidateState ok");
                success({body:body});
            } else {
                if(self.debug) console.log("GetCandidateState error");
                failure(null);
            }
        });
    });
};
module.exports = AtmanWrapper;