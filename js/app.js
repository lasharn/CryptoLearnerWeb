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
        $scope.keyboard = createKeyboard($scope.answer);
        $scope.setupChallenge = function() {
            $scope.key = Math.floor((Math.random() * 25) + 1);
            $scope.word = newWord();
            $scope.answer = encryptCaesar($scope.word, $scope.key);
            $scope.keyboard = createKeyboard($scope.answer);
            $scope.$apply();
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
            for (i = 0; i < word.length; i++) {
                if (uniqueStr.indexOf(word.charAt(i)) == -1) {
                    uniqueStr += word[i];    
                }
            }
            // pad the keyboard with random letters
            while (uniqueStr.length < KEYBOARD_SIZE + 1) {
                var newLetter = String.fromCharCode(Math.floor((Math.random() * 26)) + "A".charCodeAt(0));
                if (uniqueStr.indexOf(newLetter) == -1) {
                    uniqueStr += newLetter;    
                }
            }
            console.log(uniqueStr);
            uniqueStr = shuffle(uniqueStr);
            console.log(uniqueStr);
            return uniqueStr;
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