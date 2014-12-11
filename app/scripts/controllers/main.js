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
  // https://www.polymer-project.org/apps/topeka/ -open source front end


  $scope.quizObject = {
    date: "",
    questions: [],
    playsInfo: {}
  }

  $scope.imageQuestions = [];
  $scope.articleTitlesArray = [];
  $scope.articleKeyWordsArray = [];
  $scope.articleSnippetsArray = [];
  $scope.articleImagesArray = [];

  function ImageQuestion(question, image, answerChoices, questionType, showQuestion, difficultyLevel){
    this.question = question;
    this.image = image;
    this.answerChoices = [];
    this.questionType = questionType;
    this.showQuestion = showQuestion;
    this.difficultyLevel = difficultyLevel;
  }


  $scope.NYTapiKey = "bdcebec4874a5076dbaaa7f2a5f0db3b:3:70140904";
  $scope.apiCallNYT = function(resultsPageNumber) {
    $http.get('http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=source:("The New York Times") AND pub_date:("2014-12-3")' + '&page=' + resultsPageNumber + '&api-key=' + $scope.NYTapiKey)
    .success(function(results, status, headers, jqXHR) {

      var resultsObject = results;
      var docsArray = resultsObject['response']['docs'];
      console.log(docsArray);
      // create the articleTitlesArray - used for the answers to easy questions.
      docsArray.forEach(function(document) {
        if (document.headline.main && document.headline.main !== "") {
          $scope.articleTitlesArray.push(document.headline.main);
        }
      });

      // create the articleKeyWordsArray - used for the answers to medium questions
      // this could possibly be improved by removing anything thats inside ( ) from the key words string
      docsArray.forEach(function(document) {
        if (document.keywords.length > 0) {
          var keywordsString = "";
          document.keywords.forEach(function(keywordObject) {
            if (keywordObject.value) {
              keywordsString += keywordObject.value + "," + " ";
            }
          });
          keywordsString = keywordsString.trim();
          keywordsString = keywordsString.substring(0, keywordsString.length-1);
          $scope.articleKeyWordsArray.push(keywordsString);
        }
      });

      // create the articleSnippetsArray and articleImagesArray - used for the questions for hard questions
      docsArray.forEach(function(document) {
        if (document.snippet && document.multimedia.length > 0) {
          $scope.articleSnippetsArray.push(document.snippet);
          $scope.articleImagesArray.push("http://www.nytimes.com/" + document.multimedia[0].url);
        }
      });



      // create the Easy and Medium Questions
      docsArray.forEach(function(doc, index) {
        // easy
        if (doc.multimedia.length > 0) {

          var newEasyImageQuestion = new ImageQuestion();
          newEasyImageQuestion.question = "The image above most likely goes with which article?";
          newEasyImageQuestion.image = "http://www.nytimes.com/" + doc.multimedia[0].url;
          newEasyImageQuestion.answerChoices.push({'value': doc.headline.main, 'isCorrect': true});
          newEasyImageQuestion.questionType = "image";
          newEasyImageQuestion.showQuestion = true;
          newEasyImageQuestion.difficultyLevel = 0;

          for (var i = 0; i < 4; i++) {
            var randomIndex = Math.floor((Math.random() * (docsArray.length -1)) + 0);
            if (newEasyImageQuestion.answerChoices[0].value !== $scope.articleTitlesArray[randomIndex]) {
              newEasyImageQuestion.answerChoices.push({'value': $scope.articleTitlesArray[randomIndex], 'isCorrect': false});
            }
          }
          $scope.imageQuestions.push(newEasyImageQuestion);
        }


        // medium
        if (doc.multimedia.length > 0 && doc.keywords.length > 0) {
          var newMediumImageQuestion = new ImageQuestion();
          newMediumImageQuestion.question = "The image above relates most to which set of keywords?";
          newMediumImageQuestion.image = "http://www.nytimes.com/" + doc.multimedia[0].url;
          newMediumImageQuestion.questionType = "image";
          newMediumImageQuestion.showQuestion = true;
          newMediumImageQuestion.difficultyLevel = 1;
          var keywordsString = "";
          doc.keywords.forEach(function(keywordObject) {
            if (keywordObject.value) {
              keywordsString += keywordObject.value + "," + " ";
            }
          });
          keywordsString = keywordsString.trim();
          keywordsString = keywordsString.substring(0, keywordsString.length-1);
          newMediumImageQuestion.answerChoices.push({'value': keywordsString, 'isCorrect': true});

          for (var i = 0; i < 4; i++) {
            var randomIndex = Math.floor((Math.random() * (docsArray.length -1)) + 0);
            if (newMediumImageQuestion.answerChoices[0].value !== $scope.articleKeyWordsArray[randomIndex]) {
              newMediumImageQuestion.answerChoices.push({'value': $scope.articleKeyWordsArray[randomIndex], 'isCorrect': false});
            }
          }
          $scope.imageQuestions.push(newMediumImageQuestion);

        }

        // hard
        if (doc.snippet && doc.multimedia.length > 0) {
          var newHardImageQuestion = new ImageQuestion();
          newHardImageQuestion.question = "Which image does the quotation above belong to?";
          newHardImageQuestion['snippet'] = doc.snippet;
          newHardImageQuestion.image = "http://www.nytimes.com/" + doc.multimedia[0].url;
          newHardImageQuestion.questionType = "image";
          newHardImageQuestion.showQuestion = true;
          newHardImageQuestion.difficultyLevel = 2;
          $scope.imageQuestions.push(newHardImageQuestion);
          newHardImageQuestion.answerChoices.push({'value': newHardImageQuestion.image, 'isCorrect': true});

          for (var i = 0; i < 4; i++) {
            var randomIndex = Math.floor((Math.random() * (docsArray.length -1)) + 0);
            if (newHardImageQuestion.answerChoices[0].value !== $scope.articleImagesArray[randomIndex]) {
              debugger;
              newHardImageQuestion.answerChoices.push({'value': $scope.articleImagesArray[randomIndex], 'isCorrect': false});
            }
          }
        }


      });








      // outside of all for loops
      $scope.quizObject.questions = $scope.imageQuestions;
      console.log($scope.articleKeyWordsArray);
      console.log($scope.quizObject);
      console.log($scope.articleSnippetsArray);
      console.log($scope.imageQuestions);




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




  $scope.easyQuestionFilter = function(question) {
    if (question.difficultyLevel === 0) {
      return true;
    } else {
      return false;
    }
  };

  $scope.mediumQuestionFilter = function(question) {
    if (question.difficultyLevel === 1) {
      return true;
    } else {
      return false;
    }
  };

  $scope.hardQuestionFilter = function(question) {
    if (question.difficultyLevel === 2) {
      return true;
    } else {
      return false;
    }
  };

});
