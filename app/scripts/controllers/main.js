'use strict';

/**
 * @ngdoc function
 * @name quizApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the quizApp
 */
angular.module('quizApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    // http://www.nytimes.com/
    // before images
    // pub date is in Timestamp (YYYY-MM-DD)
    // jfkdls;afjkdls;afjkdlsa;fjkdlsa;fjkdlsa;f
    // image questions (show image and ask what article it is from)
    // city type question (show article and ask waht city it was written in)
    // columist type question (show a headline and ask what columist wrote it)
    //     -- harder type would be a random sentence
    // resturant type question this article was about which NYC resturant
    // theaters.
    // question ideas
    // ====================================================
    // ====================================================
    // * catagory keyword => article title *
    // author to catagory keyword
    //


    $scope.quizObject = {
      date: "",
      questions: {},
      playsInfo: {}
    }
    $scope.imageQuestions = [];
    $scope.sentenceFinisherQuestions = [];
    $scope.keywordTitleQuestions = [];
    $scope.keywordTitleQuestionsAnswersArray = [];
    $scope.imageQuestionAnswersArray = [];
    $scope.sentenceFinisherQuestionAnswersArray = [];
    $scope.showApiCall = [];

    function ImageQuestion(question, image, answerChoices, questionType, showQuestion){
      this.question = question;
      this.image = image;
      this.answerChoices = [];
      this.questionType = questionType;
      this.showQuestion = showQuestion;
    }

    function SentenceFinisherQuestion(question, answerChoices, questionType, showQuestion) {
      this.question = question;
      this.answerChoices = [];
      this.questionType = questionType;
      this.showQuestion = showQuestion;
    }

    function KeywordTitleQuestion(question, answerChoices, questionType, showQuestion) {
      this.question = question;
      this.answerChoices = [];
      this.questionType = questionType;
      this.showQuestion = showQuestion;
    }


    $scope.NYTapiKey = "bdcebec4874a5076dbaaa7f2a5f0db3b:3:70140904";
    $scope.apiCallNYT = function(resultsPageNumber) {
    $http.get('http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=source:("The New York Times") AND pub_date:("2014-12-3")' + '&page=' + resultsPageNumber + '&api-key=' + $scope.NYTapiKey)
              .success(function(results, status, headers, jqXHR) {

        // start doing stuff with results
          //create a docs array from results object ... docs array is the part of  the respoce objecet we actulaly care about
                  var resultsObject = results;
                  var docsArray = resultsObject['response']['docs'];



        // [A-Z]([a-z]+|\.)(?:\s+[A-Z]([a-z]+|\.))*(?:\s+[a-z][a-z\-]+){0,2}\s+[A-Z]([a-z]+|\.)


        // generate image questions
            // generate possible answers array
                  docsArray.forEach(function(document) {
                    if (document.headline.main && document.multimedia.length > 0 && document.headline.main !== "") {

                      $scope.imageQuestionAnswersArray.push(document.headline.main);

                      }
                    });

            // generate ImageQuestions and KeyWord => KeywordTitleQuestions

                  docsArray.forEach(function(doc) {
                    if (doc.multimedia.length > 0 && doc.keywords.length > 0) {

                      var newImageQuestion = new ImageQuestion();
                      newImageQuestion.question = "The image above most likely goes with which article?";
                      newImageQuestion.image = "http://www.nytimes.com/" + doc.multimedia[0].url;
                      newImageQuestion.answerChoices.push({'value': doc.headline.main, 'isCorrect': true});
                      newImageQuestion.questionType = "image";
                      newImageQuestion.showQuestion = true;

                      var newKeywordTitleQuestion = new KeywordTitleQuestion();
                      newKeywordTitleQuestion.question = "Which of the the articles below most closly match this topic: " + doc.keywords[0].value;
                      newKeywordTitleQuestion.answerChoices.push({'value': doc.headline.main, 'isCorrect': true});
                      newKeywordTitleQuestion.questionType = "image";
                      newKeywordTitleQuestion.showQuestion = true;

                      for (var i = 0; i < 4; i++) {
                        var randomIndex = Math.floor((Math.random() * (docsArray.length -1)) + 0);
                        if (newImageQuestion.answerChoices[0].value !== $scope.imageQuestionAnswersArray[randomIndex]) {
                          newImageQuestion.answerChoices.push({'value': $scope.imageQuestionAnswersArray[randomIndex], 'isCorrect': false});
                          newKeywordTitleQuestion.answerChoices.push({'value': $scope.imageQuestionAnswersArray[randomIndex], 'isCorrect': false});
                        }
                      }
                      $scope.imageQuestions.push(newImageQuestion);
                      $scope.keywordTitleQuestions.push(newKeywordTitleQuestion);

                      console.log($scope.keywordTitleQuestions);
                    }


                  });






                // generate sentence finishers
                var sentenceFinisherQuestionPreArray = [];
                docsArray.forEach(function(document) {
                  if ( document.snippet && document.snippet.match( /[A-Z]([a-z]+|\.)(?:\s+[A-Z]([a-z]+|\.))*(?:\s+[a-z][a-z\-]+){0,2}\s+[A-Z]([a-z]+|\.)/ ))  {
                    var matchedSnippet = document.snippet.match(/[A-Z]([a-z]+|\.)(?:\s+[A-Z]([a-z]+|\.))*(?:\s+[a-z][a-z\-]+){0,2}\s+[A-Z]([a-z]+|\.)/);
                    var matchedSnippetPostString = document.snippet.substring(matchedSnippet[0].length, document.snippet.length);
                    var newSentenceFinisherQuestion = new SentenceFinisherQuestion();
                    // question.should be the matched spippet
                    newSentenceFinisherQuestion.question = matchedSnippet[0] + "...";
                    newSentenceFinisherQuestion.answerChoices.push({'value': matchedSnippetPostString + "...", isCorrect: true});
                    newSentenceFinisherQuestion.questionType = "SentenceFinisherQuestion";
                    newSentenceFinisherQuestion.showQuestion = false;
                    $scope.sentenceFinisherQuestionAnswersArray.push(matchedSnippetPostString);
                    sentenceFinisherQuestionPreArray.push(newSentenceFinisherQuestion);
                  }
                });

                sentenceFinisherQuestionPreArray.forEach(function(question) {
                  for (var i = 0; i < 4; i++) {
                    var randomIndex = Math.floor((Math.random() * ($scope.sentenceFinisherQuestionAnswersArray.length -1)) + 0);
                    if (question.answerChoices[0].value !== $scope.sentenceFinisherQuestionAnswersArray[randomIndex]) {
                      question.answerChoices.push({'value': $scope.sentenceFinisherQuestionAnswersArray[randomIndex], 'isCorrect': false});
                    }
                  }
                  $scope.sentenceFinisherQuestions.push(question);
                });


              });
            };





    var queryApi = function() {
      var keepLookingThoughTheApi = true;
      var pageNumber = 0;
      while(keepLookingThoughTheApi) {
        setTimeout($scope.apiCallNYT(pageNumber), 10000);
        pageNumber++;
        if (pageNumber === 2) keepLookingThoughTheApi = false;
      }
    }
    queryApi();

  });
