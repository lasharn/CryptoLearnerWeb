

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
    }]);
    
    app.controller('CaesarLevelOne', ['$scope', '$window', function($scope, $window) {
        this.wordList = getWordList();
        $scope.key = Math.floor((Math.random() * 25) + 1);
        $scope.word = newWord();
        $scope.answer = encryptCaesar($scope.word, $scope.key);
        $scope.setupChallenge = function() {
            $scope.key = Math.floor((Math.random() * 25) + 1);
            $scope.word = newWord();
            $scope.answer = encryptCaesar($scope.word, $scope.key);
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