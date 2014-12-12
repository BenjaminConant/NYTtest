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
  // question types
  ///   what we have
  //
  //     1 image to 1 article title | 1 snippet to one image
  //     complete the headline .... type in answer
  //     who is ....



  //     1 image to  1 keyword --- backburner----
  //     snippet to image

  //   news_desk
  //



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
    $http.get('http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=source:("The New York Times") AND type_of_material:("News") AND news_desk:("Sports" "Science")' + '&begin_date=20141211&end_date=20141211' + '&page=' + resultsPageNumber + '&api-key=' + $scope.NYTapiKey)
    .success(function(results, status, headers, jqXHR) {
      console.log(results);

      var resultsObject = results;
      var docsArray = resultsObject['response']['docs'];
      //console.log(docsArray);

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

      // create the articleSnippetsArray used for the questions to hard questions
      docsArray.forEach(function(document) {
        if (document.snippet) {
          $scope.articleSnippetsArray.push(document.snippet);
        }
      });

      //create the articleImages array used for the answer to hard questions
      docsArray.forEach(function(document) {
        if (document.multimedia.length > 0) {
          $scope.articleImagesArray.push("http://www.nytimes.com/" + document.multimedia[0].url);
        }
      });



      // create the Easy and Medium Questions
      docsArray.forEach(function(doc, index) {

        // easy
        if (doc.multimedia.length > 0 && doc.headline.main) {

          var newEasyImageQuestion = new ImageQuestion();
          newEasyImageQuestion.question = "The image above most likely goes with which article?";
          newEasyImageQuestion.image = "http://www.nytimes.com/" + doc.multimedia[0].url;
          newEasyImageQuestion.answerChoices.push({'value': doc.headline.main, 'isCorrect': true});
          newEasyImageQuestion.questionType = "imageToTitle";
          newEasyImageQuestion.showQuestion = true;
          newEasyImageQuestion.difficultyLevel = 0;

          for (var i = 0; i < 4; i++) {
            var randomIndex = Math.floor((Math.random() * ($scope.articleTitlesArray.length -1)) + 0);
            var articleTitlesArray = [];
            newEasyImageQuestion.answerChoices.forEach(function(answerChoice) {
              articleTitlesArray.push(answerChoice.value)
            });
            if (articleTitlesArray.indexOf($scope.articleTitlesArray[randomIndex]) === - 1) {
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
            var randomIndex = Math.floor((Math.random() * ($scope.articleKeyWordsArray.length -1)) + 0);


            var keywordsArray = [];
            newMediumImageQuestion.answerChoices.forEach(function(answerChoice) {
              keywordsArray.push(answerChoice.value);
            });
            if (keywordsArray.indexOf($scope.articleKeyWordsArray[randomIndex]) === -1) {
              newMediumImageQuestion.answerChoices.push({'value': $scope.articleKeyWordsArray[randomIndex], 'isCorrect': false});
            }
          }
          $scope.imageQuestions.push(newMediumImageQuestion);

        }

        //

        // hard
        if (doc.snippet && doc.multimedia.length > 0) {
          var newHardImageQuestion = new ImageQuestion();
          newHardImageQuestion.question = "Which image does the quotation above belong to?";
          newHardImageQuestion['snippet'] = doc.snippet;
          newHardImageQuestion.questionType = "snippetToImage";
          newHardImageQuestion.showQuestion = true;
          newHardImageQuestion.difficultyLevel = 2;
          $scope.imageQuestions.push(newHardImageQuestion);
          newHardImageQuestion.answerChoices.push({'value': "http://www.nytimes.com/" + doc.multimedia[0].url, 'isCorrect': true});

          for (var i = 0; i < 4; i++) {
            var randomIndex = Math.floor((Math.random() * ($scope.articleImagesArray.length -1)) + 0);
            var imageArray = [];
            newHardImageQuestion.answerChoices.forEach(function(answerChoice) {
              imageArray.push(answerChoice.value);
            });
            if ( imageArray.indexOf($scope.articleImagesArray[randomIndex]) === -1){
              newHardImageQuestion.answerChoices.push({'value': $scope.articleImagesArray[randomIndex], 'isCorrect': false});
            }
          }
        }




      });








       // outside of all for loops
      //  $scope.filterQuestions($scope.imageQuestions);

      $scope.quizObject.questions = $scope.imageQuestions;





    });
  };



  var queryApi = function() {
    var keepLookingThoughTheApi = true;
    var pageNumber = 0;
    while(keepLookingThoughTheApi) {
      setTimeout($scope.apiCallNYT(pageNumber), 10000);
      pageNumber++;
      if (pageNumber === 3) keepLookingThoughTheApi = false;
    }
  }
  queryApi();





  $scope.shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

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



  $scope.uniqueImageLinks = [];
  // takes a question and returns true if one or all of its images are on the page

  $scope.isQuestionImageOnPage = function(question) {

  }



  $scope.filterQuestions = function(arrayOfQuestions) {
    arrayOfQuestions.forEach(function(question) {
      $scope.isQuestionImageOnPage(question);
    });






    // var shuffledQuestions = $scope.shuffle(arrayOfQuestions);
    // var filteredQuestions = [];
    //
    //
    //
    // shuffledQuestions.forEach(function(question) {
    //   if (question.questionType === "imageToTitle" || question.questionType === "snippetToImage") {
    //
    //     // question is a image to title question
    //     if (question.questionType === "imageToTitle") {
    //       if ($scope.uniqueImageLinks.indexOf(question.image) === -1)  {
    //         $scope.uniqueImageLinks.push(question.image);
    //         filteredQuestions.push(question);
    //       }
    //     }
    //     // question is a snippet to image question --- check if any of the answers
    //     if (question.questionType === "snippetToImage") {
    //
    //
    //       var answerImages = []
    //
    //       question.answerChoices.forEach(function(imageAnswerObject) {
    //             answerImages.push(imageAnswerObject.value);
    //       });
    //       console.log(answerImages);
    //       var push = true;
    //       answerImages.forEach(function(answerImage) {
    //         if ($scope.uniqueImageLinks.indexOf(answerImage) === -1)  {
    //         } else {
    //           push = false;
    //         }
    //       });
    //       if (push){
    //         filteredQuestions.push(question);
    //         $scope.uniqueImageLinks.push(answerImages);
    //       }
    //     }
    //   }
    // });
    // $scope.quizObject.questions = filteredQuestions;
  }




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
