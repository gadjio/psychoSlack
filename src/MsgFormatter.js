/**
 * Created by Dany on 2016-01-31.
 */
(function(){

    function MessageFormatter() { }

    MessageFormatter.prototype.formatQuestion = function(JSONquestion) {

        console.log('formatQuestion');
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
                    "text" : JSONquestion.localizedNumberOfB,
                    "color" : remainingBColor
                }
            ]
        };

    };

    MessageFormatter.prototype.formatResult = function(JSONResult) {

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


        return {
            "text" : "",
            "attachments": attachments
        };
    };

    module.exports = MessageFormatter;
})();

