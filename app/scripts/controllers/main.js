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
    // image questions (show image and ask what article it is from)
    // city type question (show article and ask waht city it was written in)
    // columist type question (show a headline and ask what columist wrote it)
    //     -- harder type would be a random sentence
    // resturant type question this article was about which NYC resturant
    // theaters.


    function ImageQuestion(question, image, answerChoices, questionType, showQuestion){
      this.question = question;
      this.image = image;
      this.answerChoices = [];
      this.questionType = questionType;
      this.showQuestion = showQuestion;
    }

    $scope.imageQuestions = [];


    $scope.NYTapiKey = "bdcebec4874a5076dbaaa7f2a5f0db3b:3:70140904",
    $scope.NYTtimesShown = 0,

    $scope.showApiCall = [];

    $scope.apiCallNYT = function(){
    $http.get('http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=source:("The New York Times") AND pub_date:("2014-12-3")' + '&page=' + $scope.NYTtimesShown + '&api-key=' + $scope.NYTapiKey)
              .success(function(results, status, headers, jqXHR) {
                  var resultsString = JSON.stringify(results);
                  var resultsObject = results;
                  $scope.showApiCall = results;
                  var docsArray = resultsObject['response']['docs'];
                  console.log(docsArray);
                  docsArray.forEach(function(doc) {
                    if (doc.document_type === "multimedia") {
                      var newImageQuestion = new ImageQuestion();
                      newImageQuestion.question = "The image above most likely goes with which article?";
                      newImageQuestion.image = "http://www.nytimes.com/" + doc.multimedia[0].url;
                      var possibleAnswers = [];
                      docsArray.forEach(function(docu) {
                        if (docu.headline.main === doc.headline.main) {
                          newImageQuestion.answerChoices.push({'value': docu.headline.main, 'isCorrect': true})
                        } else {
                          newImageQuestion.answerChoices.push({'value': docu.headline.main, 'isCorrect': false});
                        }
                      });
                      newImageQuestion.questionType = "image";
                      newImageQuestion.showQuestion = true;
                      $scope.imageQuestions.push(newImageQuestion);
                    }
                  });

                });
              };


    $scope.showDefault = true;

    $scope.question = {};



    $scope.showQuestion = function() {
      $scope.showDefault = false;
    };

    $scope.getData= function() {
      $scope.apiCallNYT();
      $scope.showQuestion();
    }
  });
