function AtmanWrapper(request) {
    this.request = request;
};

AtmanWrapper.prototype.getRequestInfoData = function(authKey) {
    return { AuthenticationKey : authKey };
};

AtmanWrapper.prototype.CreateCandidate = function (email, firstname, lastname, gender, language){

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
            'Authorization': 'Basic cGhpbGlwcGUuZ3JhbmRtb250QGdtYWlsLmNvbTpoTlV1ajI=',
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
            return body;
        } else {
            console.log("request error");
            return null;
        }
    });
};

module.exports = AtmanWrapper;
