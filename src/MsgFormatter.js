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

        var improviserURL = "https://files.slack.com/files-tmb/T0KRVV4BT-F0KSE284T-15622fe05f/trophy_360.png";
        var qualityControllerURL = "https://files.slack.com/files-tmb/T0KRVV4BT-F0KSH27JT-deb2e4c0fd/star_360.png";
        var hardHeadedURL = "https://files.slack.com/files-tmb/T0KRVV4BT-F0KSHV5FS-6a3e0dd186/thumbs_up_360.png";
        var sprinterURL = "https://files.slack.com/files-tmb/T0KRVV4BT-F0KSHV5A4-925d148edd/rocket_360.png";
        var cocoonedURL = "https://files.slack.com/files-tmb/T0KRVV4BT-F0KSH1XV0-eefcf60540/smiley_360.png";



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

    module.exports = MessageFormatter;
})();

