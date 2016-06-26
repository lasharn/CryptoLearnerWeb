(function () {
    var app = angular.module('cryptoLearner', ['ui.bootstrap', 'ngCookies']);
    var levelOrder = ['caesar/1','caesar/2', 'caesar/3', 'substitution/1', 'substitution/2', 'substitution/3', 'vigenere/1', 'vigenere/2' , 'vigenere/3'];
    app.controller('MenuController', ['$scope', '$window', '$cookies', function($scope, $window, $cookies) {
        $scope.noWrapSlides = true;
        $scope.gameOrder = levelOrder;
        setupCookies();

        function setupCookies() {
            $cookies.put($scope.gameOrder[0], true);
            $scope.gameOrder.forEach(setupCookie)
        }
        function setupCookie(level) {
            var cookieValue = $cookies.get(level);
            if (cookieValue == null) {
                // lock levels that don't have a cookie
                $cookies.put(level, false);
            }
        }
        $scope.go = function (path) {
            $window.location.href = path;
        };

        this.levels = [{
            name: 'Caesar Cipher',
            level: 'caesar',
            buttons: [{
                name: 'Encrypt',
                isUnlocked: $cookies.get($scope.gameOrder[0]),
                icon: 'glyphicon-pencil',
                challenge: 1
            }, {
                name: '',
                isUnlocked: $cookies.get($scope.gameOrder[1]),
                icon: '',
                challenge: 2
            }, {
                name: '',
                isUnlocked: $cookies.get($scope.gameOrder[2]),
                icon: '',
                challenge: 3
            }]
        }, {
            name: 'Substitution Cipher',
            level: 'substitution',
            buttons: [{
                name: 'Encrypt',
                isUnlocked: $cookies.get($scope.gameOrder[6]),
                icon: 'glyphicon-pencil',
                challenge: 1
            }, {
                name: '',
                isUnlocked: $cookies.get($scope.gameOrder[7]),
                icon: '',
                challenge: 2
            }, {
                name: '',
                isUnlocked: $cookies.get($scope.gameOrder[8]),
                icon: '',
                challenge: 3
            }]
        }, {
            name: 'Vigenere Cipher',
            level: 'vigenere',
            buttons: [{
                name: 'Encrypt',
                isUnlocked: $cookies.get($scope.gameOrder[3]),
                icon: 'glyphicon-pencil',
                challenge: 1
            }, {
                name: '',
                isUnlocked: $cookies.get($scope.gameOrder[4]),
                icon: '',
                challenge: 2
            }, {
                name: '',
                isUnlocked: $cookies.get($scope.gameOrder[5]),
                icon: '',
                challenge: 3
            }]
        }];
    }]);

    app.controller('GameController', ['$scope', '$window', '$compile', '$cookies', function($scope, $window, $compile, $cookies) {
        $scope.state = levelState;
        $scope.stage = levelState.currentStage;
        $scope.maxStage = levelState.maxStage;
        $scope.gameOrder = levelOrder;
        $scope.currentLevelIndex = getCurrentLevelIndex();

        setup();

        $scope.showModal = function () {
            if ($scope.stage == $scope.maxStage) {
                // unlock next challenge
                if ($scope.currentLevelIndex < $scope.gameOrder.length - 1) $cookieStore.put($scope.gameOrder[$scope.currentLevelIndex+1], true);
                // show next challenge modal
                $('#next-challenge-modal').modal('show');
                return;
            }
            $('#next-stage-modal').modal('show');
            $scope.stage++;
        }
        $scope.nextChallenge = function () {
            //navigate to main menu if at last level or current level not detected
            if ($scope.currentLevelIndex == $scope.gameOrder.length - 1 || $scope.currentLevelIndex == -1) {
                $window.location.href = '/index.html';
                return;
            }
            // navigate to next page
            var nextLevel = $scope.gameOrder[$scope.currentLevelIndex + 1];
            $window.location.href = '/' + nextLevel + '.html';
            return;
        }

        $scope.nextStage = function () {
            $scope.$broadcast('nextStage');
        }

        function getCurrentLevelIndex () {
            var path = $window.location.pathname;
            path = path.match(/\w*\/\d/).toString();
            var index = $scope.gameOrder.indexOf(path);
            return index;
        }

        function createNextChallengeModal () {
            var game = document.getElementById('game');
            var modal = document.createElement("div");
            modal.setAttribute("id", "next-challenge-modal");
            modal.setAttribute("class", "modal fade");
            modal.setAttribute("tabindex", "-1");
            modal.setAttribute("role", "dialog");
            modal.setAttribute("data-keyboard", "false");
            modal.setAttribute("data-backdrop", "static");
            modal.setAttribute("aria-labelledby", "successLabel");
            modal.setAttribute("aria-hidden", "true");
            var dialog = document.createElement("div");
            dialog.setAttribute("class", "modal-dialog");
            var content = document.createElement("div");
            content.setAttribute("class", "modal-content");
            var header = document.createElement("div");
            header.setAttribute("class", "modal-header");
            var h3 = document.createElement("h3");
            h3.setAttribute("id", "successLabel");
            h3.appendChild(document.createTextNode("Challenge Complete!"));
            var body = document.createElement("div");
            body.setAttribute("class", "modal-body");
            var para = document.createElement("p");
            para.appendChild(document.createTextNode("You have unlocked the next challenge!"));

            var footer = document.createElement("div");
            footer.setAttribute("class", "modal-footer");
            footer.setAttribute("id", "nextChallengeFooter");
            var btn = angular.element("<button class='btn btn-primary' data-dismiss='modal' ng-click='nextChallenge()'>Next Challenge</button>");
            $compile(btn)($scope);

            game.appendChild(modal);
            modal.appendChild(dialog);
            dialog.appendChild(content);
            content.appendChild(header);
            header.appendChild(h3);
            content.appendChild(body);
            body.appendChild(para);
            content.appendChild(footer);
            $("#nextChallengeFooter").append(btn);
        }

        function createNextStageModal () {
            var game = document.getElementById('game');
            var modal = document.createElement("div");
            modal.setAttribute("id", "next-stage-modal");
            modal.setAttribute("class", "modal fade");
            modal.setAttribute("tabindex", "-1");
            modal.setAttribute("role", "dialog");
            modal.setAttribute("data-keyboard", "false");
            modal.setAttribute("data-backdrop", "static");
            modal.setAttribute("aria-labelledby", "successLabel");
            modal.setAttribute("aria-hidden", "true");
            var dialog = document.createElement("div");
            dialog.setAttribute("class", "modal-dialog");
            var content = document.createElement("div");
            content.setAttribute("class", "modal-content");
            var header = document.createElement("div");
            header.setAttribute("class", "modal-header");
            var h3 = document.createElement("h3");
            h3.setAttribute("id", "successLabel");
            h3.appendChild(document.createTextNode("Correct!"));
            var body = document.createElement("div");
            body.setAttribute("class", "modal-body");
            var para = document.createElement("p");
            para.appendChild(document.createTextNode("You got it!"));
            var footer = document.createElement("div");
            footer.setAttribute("class", "modal-footer");
            footer.setAttribute("id", "nextStageFooter");
            var btn = angular.element("<button class='btn btn-primary' data-dismiss='modal' ng-click='nextStage()'>Continue</button>");
            $compile(btn)($scope);

            game.appendChild(modal);
            modal.appendChild(dialog);
            dialog.appendChild(content);
            content.appendChild(header);
            header.appendChild(h3);
            content.appendChild(body);
            body.appendChild(para);
            content.appendChild(footer);
            $("#nextStageFooter").append(btn);
        }

        function setup() {
            var isErrorPage = enforceLevelAccess();
            if (!isErrorPage) {
                createNextStageModal();
                createNextChallengeModal();
            }
        }
        function enforceLevelAccess() {
            if ($cookies.get($scope.gameOrder[$scope.currentLevelIndex]) == null || $cookies.get($scope.gameOrder[$scope.currentLevelIndex]) == 'false') {
                var body = $("body").html("<div><h1 class='text-center' style='font-size: 5vmax'>Level Locked!</h1>"
                + "<i class='fa fa-lock' style='font-size: 20vmax; width: 100%; display: inline-block; text-align: center; vertical-align: bottom'></i>"
                + "<a href='../index.html' style='font-size: 2vmax; text-align: center; vertical-align: bottom; display: inline-block; width: 100%'>Return to main menu</a>"
                + "</div>");
                return true;
            }
            return false;
        }
    }]);
    app.controller('CaesarLevel', ['$scope', '$window', function($scope, $window) {
        this.wordList = getWordList();
        $scope.key = Math.floor((Math.random() * 25) + 1);
        $scope.plaintext = newWord();
        $scope.ciphertext = encryptCaesar($scope.plaintext, $scope.key);
        $scope.answertext = ($scope.currentLevelIndex == 0) ? $scope.ciphertext : $scope.plaintext;
        $scope.answerKeyboard = retrieveAnswer($scope.answertext);
        $scope.keyboard = createKeyboard($scope.answertext);
        $scope.incorrectAnswer = false;
        $scope.correctAnswer = false;
        $scope.$on('nextStage', function(e) {
            $scope.setupStage();
        });
        $scope.setupStage = function() {
            $scope.key = Math.floor((Math.random() * 25) + 1);
            $scope.plaintext = newWord();
            $scope.ciphertext = encryptCaesar($scope.plaintext, $scope.key);
            $scope.answertext = ($scope.currentLevelIndex == 0) ? $scope.ciphertext : $scope.plaintext;
            $scope.answerKeyboard = retrieveAnswer($scope.answertext);
            $scope.keyboard = createKeyboard($scope.answertext);
            $scope.incorrectAnswer = false;
            $scope.correctAnswer = false;
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
                if ($scope.correctAnswer) {
                    $scope.showModal();
                }
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
            // retrieve a random plaintext from the list of words
            var index = Math.floor(Math.random() * this.wordList.length);
            var newWord = this.wordList[index].toUpperCase();
            // remove the newline character at the end of each word
            newWord = newWord.slice(0, newWord.length - 1);
            return newWord;
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
        
        function createKeyboard(answerWord) {
            var KEYBOARD_SIZE = 10;
            var word = answerWord;
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
        
        function retrieveAnswer(answerText) {
            var answerLetterArr = [];
            for (i = 0; i < answerText.length; i++) {
                answerLetterArr.push(new AnswerLetter(answerText[i]));
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
    
    var levelState = {
        currentStage: 1,
        maxStage: 3
    };


        
})();
