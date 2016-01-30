function AtmanWrapper(request) {
    this.request = request;
    this.authorization = 'Basic cGhpbGlwcGUuZ3JhbmRtb250QGdtYWlsLmNvbTpoTlV1ajI=';
};

AtmanWrapper.prototype.getRequestInfoData = function(authKey) {
    return { AuthenticationKey : authKey };
};

AtmanWrapper.prototype.CreateCandidate = function (email, firstname, lastname, gender, language) {
    console.log("CreateCandidate");

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

        var url = "https://sandbox.atmanco.com/api/v1/CreateCandidate";
        var options = {
            url: url,
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Authorization': this.authorization,
                'Content-Type': 'application/json'
            }
        };

        console.log('before request');
        this.request(options, function (error, response, body) {
            console.log("response received");
            console.log(response.statusCode);
            console.log(body);
            if (!error && response.statusCode == '200') {
                console.log("request ok");
                success(body);
            } else {
                console.log("request error");
                failure(null);
            }
        });
    });
};

AtmanWrapper.prototype.GetQuestion = function (authKey, languageCode) {

    console.log("GetQuestion");

    return new Promise(function(success, failure) {
        var body = {
            LanguageCode: languageCode,
            RequestInfo: this.getRequestInfoData(authKey)
        };

        var url = "https://sandbox.atmanco.com/api/v1/GetAssessmentInformation";
        var options = {
            url: url,
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Authorization': this.authorization,
                'Content-Type': 'application/json'
            }
        };

        console.log('before request');
        this.request(options, function (error, response, body) {
            console.log("response received");
            console.log(response.statusCode);
            console.log(body);
            if (!error && response.statusCode == '200') {
                console.log("request ok");
                success(data);
            } else {
                console.log("request error");
                failure(null);
            }
        });
    });
};

module.exports = AtmanWrapper;
