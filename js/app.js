(function () {
    var app = angular.module('cryptoLearner', ['ui.bootstrap']);
    app.controller('MenuController', ['$scope', '$window', function($scope, $window) {
        $scope.noWrapSlides = true;
        this.levels = levels;
        $scope.go = function (path) {
            $window.location.href = path;
        };
    }]);
    
    app.controller('GameController', ['$scope', '$window', function($scope, $window) {
        this.state = levelState;
        this.stage = levelState.currentStage;
        this.maxStage = levelState.maxStage;
    }]);
    
    app.controller('CaesarLevelOne', ['$scope', '$window', function($scope, $window) {
        this.wordList = getWordList();
        $scope.key = Math.floor((Math.random() * 25) + 1);
        $scope.word = newWord();
        $scope.answer = encryptCaesar($scope.word, $scope.key);
        $scope.answerKeyboard = retrieveAnswer($scope.answer);
        $scope.keyboard = createKeyboard($scope.answer);
        $scope.incorrectAnswer = false;
        $scope.correctAnswer = false;
        $scope.setupChallenge = function() {
            $scope.key = Math.floor((Math.random() * 25) + 1);
            $scope.word = newWord();
            $scope.answer = encryptCaesar($scope.word, $scope.key);
            $scope.answerKeyboard = retrieveAnswer($scope.answer);
            $scope.keyboard = createKeyboard($scope.answer);
            $scope.incorrectAnswer = false;
            $scope.correctAnswer = false;
            $scope.$apply();
        }
        
        $scope.selectLetter = function(event, letter) {
            if (!letter.selectable) return;
            var selectedLetter = letter.char;
            var nextEmptyIndex = -1;
            //$(event.currentTarget).find('span').text();
            //get the index of the answer being selected
            for (i = 0; i < $scope.answerKeyboard.length; i++) {
                if ($scope.answerKeyboard[i].currentLetter == "") {
                    nextEmptyIndex = i;
                    break;
                }
            }
            if (nextEmptyIndex == -1) return;
            // get the letter in the answer that is being selected
            var correctLetterToMatch = $scope.answerKeyboard[nextEmptyIndex].correctLetter;
            // apply selection to all letters in the answer that much this letter
            for (i = 0; i < $scope.answerKeyboard.length; i++) {
                if ($scope.answerKeyboard[i].correctLetter == correctLetterToMatch) {
                    $scope.answerKeyboard[i].currentLetter = selectedLetter;
                    $scope.answerKeyboard[i].deselectable = true;
                }
            }
            letter.selectable = !letter.selectable;
            if (answerFilled()) {
                $scope.correctAnswer = checkSuccess();
                $scope.incorrectAnswer = !$scope.correctAnswer;
                console.log($scope.incorrectAnswer);
            }
        }
        
        $scope.deselectLetter = function(letter) {
            if(!letter.deselectable) return;
            var deselectedLetter = letter.currentLetter;
            // remove all instances of the letter from the answer
            for (i = 0; i < $scope.answerKeyboard.length; i++) {
                if ($scope.answerKeyboard[i].currentLetter == deselectedLetter) {
                    $scope.answerKeyboard[i].currentLetter = "";   
                    $scope.answerKeyboard[i].deselectable = false;
                }
            }
            // match the deselected letter to the keyboard to reenable it
            var keyboardIndex = -1;
            for (i = 0; i < $scope.keyboard.length; i++) {
                if ($scope.keyboard[i].char == deselectedLetter) {
                    keyboardIndex = i;
                    break;
                }
            }
            if (keyboardIndex == -1) return;
            $scope.keyboard[keyboardIndex].selectable = true;
            $scope.incorrectAnswer = false;
        }
        
        function checkSuccess() {
            for (i = 0; i < $scope.answerKeyboard.length; i++) {
                if ($scope.answerKeyboard[i].currentLetter != $scope.answerKeyboard[i].correctLetter) {
                    return false;   
                }
            }
            return true;
        }
        
        function answerFilled() {
            for (i = 0; i < $scope.answerKeyboard.length; i++) {
                if ($scope.answerKeyboard[i].currentLetter == "") {
                    return false;  
                }
            }
            return true;
        }
        
        
        function getWordList() {
            // read the list of words in the words.txt file
            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", "../res/words.txt", false);
            rawFile.onreadystatechange = function ()
            {
                if(rawFile.readyState === 4)
                {
                    if(rawFile.status === 200 || rawFile.status == 0)
                    {
                        var allText = rawFile.responseText;
                        wordList = allText.split("\n");
                    }
                }
            }
            rawFile.send(null);
            return wordList;
        }
        
        function newWord() {
            // retrieve a random word from the list of words
            var index = Math.floor(Math.random() * this.wordList.length);
            return this.wordList[index].toUpperCase();
        }

        function shuffle(str) {
            var a = str.split(""),
                n = a.length;

            for(var i = n - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
            }
            return a.join("");
        }
        
        function createKeyboard(encryptedWord) {
            var KEYBOARD_SIZE = 10;
            var word = encryptedWord;
            var uniqueStr = "";
            var keyboardArray = [];
            for (i = 0; i < word.length; i++) {
                if (uniqueStr.indexOf(word.charAt(i)) == -1) {
                    uniqueStr += word[i];    
                }
            }
            // pad the keyboard with random letters
            while (uniqueStr.length < KEYBOARD_SIZE) {
                var newLetter = String.fromCharCode(Math.floor((Math.random() * 26)) + "A".charCodeAt(0));
                if (uniqueStr.indexOf(newLetter) == -1) {
                    uniqueStr += newLetter;    
                }
            }
            uniqueStr = shuffle(uniqueStr);
            //put the string into an array which has [string, bool] objects
            for (i = 0; i < uniqueStr.length; i++) {
                keyboardArray.push(new KeyboardLetter(uniqueStr[i]));
            }
            return keyboardArray;
        }

        function KeyboardLetter(letter) {
            this.char = letter;
            this.selectable = true;
        }
        
        function AnswerLetter(correctLetter) {
            this.correctLetter = correctLetter;
            this.currentLetter = "";
            this.deselectable = false;
        }
        
        function retrieveAnswer(cipherText) {
            var answerLetterArr = [];
            for (i = 0; i < cipherText.length; i++) {
                answerLetterArr.push(new AnswerLetter(cipherText[i]));   
            }
            return answerLetterArr;
        }
        
        function encryptCaesar(plainText, key) {
            plainText = plainText.toUpperCase();
            cipherTextArray = [];
            for (i = 0; i < plainText.length; i++) {
                newValue = plainText.charCodeAt(i) + key;
                if (newValue > "Z".charCodeAt(0)) {
                    newValue -= 26;    
                }
                cipherTextArray[i] = String.fromCharCode(newValue);
            }
            cipherText = cipherTextArray.join("");
            // remove non-alphabetical characters
            cipherText = cipherText.replace(/\W+/g, "");
            return cipherText;    
        }
    }]);
    
    var levels = [{
        name: 'Caesar Cipher',
        level: 'caesar',
        buttons: [{
            name: 'Encrypt',
            isLocked: false,
            icon: 'glyphicon-pencil',
            challenge: 1
        }, {
            name: '',
            isLocked: true,
            icon: '',
            challenge: 2
        }, {
            name: '',
            isLocked: true,
            icon: '',
            challenge: 3
        }]
    }, {
        name: 'Vigenere Cipher',
        level: 'vigenere',
        buttons: [{
            name: 'Encrypt',
            isLocked: false,
            icon: 'glyphicon-pencil',
            challenge: 1
        }, {
            name: '',
            isLocked: true,
            icon: '',
            challenge: 2
        }, {
            name: '',
            isLocked: true,
            icon: '',
            challenge: 3
        }]
    }, {
        name: 'Substitution Cipher',
        level: 'substitution',
        buttons: [{
            name: 'Encrypt',
            isLocked: false,
            icon: 'glyphicon-pencil',
            challenge: 1
        }, {
            name: '',
            isLocked: true,
            icon: '',
            challenge: 2
        }, {
            name: '',
            isLocked: true,
            icon: '',
            challenge: 3
        }]
    }];
    
    var levelState = {
        currentStage: 0,
        maxStage: 3
    };                             
        
})();

//var letterWidth = $('.answer-box').width();
//$('.answer-box').css({'height':letterWidth+'px'});