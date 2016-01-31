/**
 * Created by Dany on 2016-01-31.
 */
(function(){

    function MessageFormatter() { }

    MessageFormatter.prototype.formatQuestion = function(JSONquestion) {

        var possibleAnswers = JSONquestion.assessmentAnswer;
        possibleAnswers = possibleAnswers.map(function(answer) {
            return {
                question: answer.value + ":\t" + answer.text,
                isDisabled: answer.isDisabled
            }
        }).filter(function(answer) {
            return !answer.isDisabled;
        }).map(function(answer) {
            return answer.question;
        }).reduce(function(a, b) {
            return a + "\n" + b;
        });

        var fallback = JSONquestion.assessmentQuestion + " - " + possibleAnswers;
        var numberOfQuestionsRemaining = JSONquestion.totalNumberOfQuestions -
            JSONquestion.numberOfQuestionAnswered + " questions remaining";
        const NUMBER_OF_B_REMAINING = JSONquestion.numberOfBLeft;
        var remainingBColor = NUMBER_OF_B_REMAINING >= 8
            ? "#1ecd26" : NUMBER_OF_B_REMAINING >= 4
            ? "#f5ed18"
            : "#f52d18";

        var temp = JSONquestion.localizedNumberOfB.toString();
        console.log(temp);
        var test = temp.substring(0, temp.indexOf('of'));
        console.log(test);

        return {
            "text" : "",
            "attachments": [
                {
                    "fallback": fallback,
                    "color": "#DE9E31",
                    "pretext": numberOfQuestionsRemaining,
                    "title": JSONquestion.assessmentQuestion,
                    "text": possibleAnswers
                },
                {
                    "text" : test,
                    "color" : remainingBColor
                }
            ]
        };

    };

    MessageFormatter.prototype.getGenderQuestion = function() {

        var possibleAnswers = [
            {"value":"M","text":"Male","isDisabled":false},
            {"value":"F","text":"Female","isDisabled":false}
        ];
        possibleAnswers = possibleAnswers.map(function(answer) {
            return {
                question: answer.value + ":\t" + answer.text,
                isDisabled: answer.isDisabled
            }
        }).filter(function(answer) {
            return !answer.isDisabled;
        }).map(function(answer) {
            return answer.question;
        }).reduce(function(a, b) {
            return a + "\n" + b;
        });

        return {
            "text" : "",
            "attachments": [
                {
                    "fallback": '',
                    "color": "#DE9E31",
                    "pretext": '',
                    "title": 'Please select your gender',
                    "text": possibleAnswers
                }
            ]
        };

    };

    MessageFormatter.prototype.formatResult = function(JSONResult, username) {

        var picturesDictionary =  [];

        var improviserURL = "http://imageshack.com/a/img921/4349/JHfyTi.png";
        var qualityControllerURL = "http://imageshack.com/a/img922/3301/Wk9Kr0.png";
        var hardHeadedURL = "http://imageshack.com/a/img923/9121/52W7NB.png";
        var sprinterURL = "http://imageshack.com/a/img922/7804/aaY0LL.png";
        var cocoonedURL = "http://imageshack.com/a/img924/452/cs6qPf.png";

        picturesDictionary.push(improviserURL);
        picturesDictionary.push(qualityControllerURL);
        picturesDictionary.push(hardHeadedURL);
        picturesDictionary.push(sprinterURL);
        picturesDictionary.push(cocoonedURL);

        const PRETEXT = "CONGRATS! You have completed your personality test. Here are your top skills. Ready to see what you're made of?";

        var attachments = [];
        attachments.push({
            "color": "#DE9E31",
            "pretext": PRETEXT
        });


        var relatedSkills = JSONResult.relatedSkills;
        var counter = 0;
        relatedSkills = relatedSkills
            .map(function(msg) {
                return {
                    "color": "#1ecd26",
                    "text" : " *" + msg.name + "* - " + msg.description[0] + " " + msg.description[1],
                    "mrkdwn_in": ["text"],
                    "thumb_url" : picturesDictionary[counter++]
                };
            }).forEach(function(item) {
                attachments.push(item);
            });

        console.log(username);

        var bloomedLinkItem ={
            "color": "#1ecd26",
            "pretext" : " View your complete profile: " + "bloomed.com" + " \nUsername : " + username + "\nTemporary Password : 1234" ,

        };
        attachments.push(bloomedLinkItem);

        return {
            "text" : "",
            "attachments": attachments
        };
    };

    MessageFormatter.prototype.getEasterEgg = function() {

        var attachments = [
            {
                "color": "#DE9E31",
                "title": 'Cognibox Hackathon Easter Egg!',
                "text": 'The *Bloomed* bot was brought to you by the *Cognibox Hackathon edition 2016* psycho-slack team. Expect ' +
                'even more from us next year!',
                "mrkdwn_in": ["text"]
            }
        ];


        var userList = [];
        const thumb = "https://www.google.ca/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwif147V0tTKAhVJbB4KHcZ-CQAQjRwIAw&url=http%3A%2F%2Ffr.123rf.com%2Fimages-libres-de-droits%2Fsmiley_rire.html&psig=AFQjCNEtBO5GW4p1pO12XtizXZdqiHn0MQ&ust=1454350156946848";
        const phil = {
            "title": "Philippe Grandmont",
            "text": "The Procrastinator, The ER Doctor, The Sprinter, The Hard-to-Convince, The Sniper.",
            "thumb_url": "http://imageshack.com/a/img924/8941/MhtIEt.jpg"
        };

        const dan = {
            "title": "Dany Pellerin",
            "text": "The Improviser, The Sprinter, The Caesar of Recognition, The Do-Whatever-it-Takes!.",
            "thumb_url": "http://imageshack.com/a/img922/7646/6hHIdV.jpg"
        };

        const marc = {
            "title": "Marc-André Beaudry",
            "text": "The Improviser, The Eccentric Ice-Breaker.",
            "thumb_url": "http://imageshack.com/a/img923/2343/EYgxKF.png"
        };

        const Joe = {
            "title": "Jonatan Bouillon",
            "text": "The Soft-Spoken One, The listener, The Improviser, The Go-With-The-Flow.",
            "thumb_url": "http://imageshack.com/a/img924/5862/dROhB2.jpg"
        };

        const alex = {
            "title": "Alexandre Boulay",
            "text": "The Caesar of Recognition, The Eccentric Ice-Breaker.",
            "thumb_url": "http://imageshack.com/a/img922/7589/0LZKwh.jpg"
        };

        const steph = {
            "title": "Stephan Poirier",
            "text": "The Sprinter, The Go-with-the-flow, The Procrastinator, The Improviser, The Listener.",
            "thumb_url": "http://imageshack.com/a/img924/6375/fs15nk.png"
        };

        userList.push(phil);
        userList.push(dan);
        userList.push(marc);
        userList.push(Joe);
        userList.push(alex);
        userList.push(steph);

        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        shuffle(userList);
        userList.forEach(function(user) {
            attachments.push(user);
        });


        return {
            "text" : "",
            "attachments": attachments
        };

    };

    module.exports = MessageFormatter;
})();

