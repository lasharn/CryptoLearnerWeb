(function () {
    var app = angular.module('cryptoLearner', ['ui.bootstrap', 'ngCookies']);
    var levelOrder = ['caesar/intro','caesar/1','caesar/2', 'caesar/3', 'substitution/intro', 'substitution/1', 'substitution/2', 'vigenere/intro', 'vigenere/1', 'vigenere/2' , 'vigenere/3'];
    var wordList = getListFromFile("../res/words.txt");
    var sentenceList = getSentenceList();
    function getListFromFile(filename) {
        // read the list of words in the words.txt file
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", filename, false);
        var list = "";
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                    list = allText.split("\n");
                    list = list.map(function(x) { return x.slice(0, x.length - 1)});
                }
            }
        }
        rawFile.send(null);
        return list;
    }

    function getSentenceList() {
        var jsonResponse = getJsonFromFile("../res/sentences.json");
        var jsonSentences = jsonResponse.sentences;
        var sentenceList = [];
        for (var i in jsonSentences) {
            sentenceList.push(new Sentence(jsonSentences[i].sentence.toUpperCase(), jsonSentences[i].hints.map(function (hint) { return hint.toUpperCase()})))
        }
        return sentenceList;
    }

    function Sentence(sentence, hints) {
        this.sentence = sentence;
        this.hints = hints;
    }

    function getJsonFromFile(filename) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", filename, false);
        var allText = "";
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    allText = JSON.parse(rawFile.responseText);

                }
            }
        }
        rawFile.send(null);
        return allText;
    }

    function getNewWord() {
        // retrieve a random plaintext from the list of words
        var index = Math.floor(Math.random() * wordList.length);
        var newWord = wordList[index].toUpperCase();
        return newWord;
    }

    function getWordFromList(list) {
        // retrieve a random plaintext from the list of words
        var index = Math.floor(Math.random() * list.length);
        var newWord = list[index].toUpperCase();
        return newWord;
    }

    function getNewSentenceObject() {
        // retrieve a random plaintext from the list of words
        var index = Math.floor(Math.random() * sentenceList.length);
        var newSentenceObject = sentenceList[index];
        return newSentenceObject;
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
            keyboardArray.push(new KeyboardLetter(i, uniqueStr[i]));
        }
        return keyboardArray;
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

    function shuffleArray(array) {
        var j, x, i;
        for (i = array.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = array[i - 1];
            array[i - 1] = array[j];
            array[j] = x;
        }
        return array;
    }

    function KeyboardLetter(num, letter) {
        this.id = num;
        this.char = letter;
        this.selectable = true;
    }

    function AnswerLetter(id, correctLetter) {
        this.id = id;
        this.correctLetter = correctLetter;
        this.currentLetter = "";
        this.deselectable = false;
        this.keyboardLetterId = -1;
    }

    function retrieveAnswer(answerText) {
        var answerLetterArr = [];
        for (i = 0; i < answerText.length; i++) {
            answerLetterArr.push(new AnswerLetter(i, answerText[i]));
        }
        return answerLetterArr;
    }

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
                name: 'Introduction',
                isUnlocked: $cookies.get($scope.gameOrder[0]),
                icon: 'fa-puzzle-piece',
                challenge: 'intro'
            }, {
                name: 'Encrypt',
                isUnlocked: $cookies.get($scope.gameOrder[1]),
                icon: '',
                challenge: 1
            }, {
                name: 'Decrypt',
                isUnlocked: $cookies.get($scope.gameOrder[2]),
                icon: 'fa-unlock-alt',
                challenge: 2
            }, {
                name: 'Brute Force',
                isUnlocked: $cookies.get($scope.gameOrder[3]),
                icon: '',
                challenge: 3
            }]
        }, {
            name: 'Substitution Cipher',
            level: 'substitution',
            buttons: [{
                name: 'Introduction',
                isUnlocked: $cookies.get($scope.gameOrder[4]),
                icon: 'fa-puzzle-piece',
                challenge: 'intro'
            }, {
                name: 'Frequency Analysis',
                isUnlocked: $cookies.get($scope.gameOrder[5]),
                icon: 'fa-bar-chart',
                challenge: 1
            }, {
                name: '',
                isUnlocked: $cookies.get($scope.gameOrder[6]),
                icon: '',
                challenge: 2
            }]
        }, {
            name: 'Vigènere Cipher',
            level: 'vigenere',
            buttons: [{
                name: 'Introduction',
                isUnlocked: $cookies.get($scope.gameOrder[7]),
                icon: 'fa-puzzle-piece',
                challenge: 'intro'
            }, {
                name: '',
                isUnlocked: $cookies.get($scope.gameOrder[8]),
                icon: '',
                challenge: 1
            }, {
                name: '',
                isUnlocked: $cookies.get($scope.gameOrder[9]),
                icon: '',
                challenge: 2
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
                if ($scope.currentLevelIndex < $scope.gameOrder.length - 1) $cookies.put($scope.gameOrder[$scope.currentLevelIndex+1], true, {'path':'/'});
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
            path = path.match(/\w*\/\w*\.html/).toString().replace(".html", "");
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

    app.controller('AnswerController', ['$scope', function($scope) {
        $scope.incorrectAnswer = false;
        $scope.correctAnswer = false;
        $scope.selectLetter = function(letter) {
            if (!letter.selectable) return;
            $scope.correctAnswer = false;
            var selectedLetter = letter.char;
            var nextEmptyIndex = -1;
            //get the index of the answer being selected
            for (var i = 0; i < $scope.answerKeyboard.length; i++) {
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

        $scope.partialCompleteSolutionLettersNotFilled = function (numLettersNotFilled) {
            var letters = [];
            // get all the keyboard letters in correct solution
            for (var i = 0; i < $scope.answerKeyboard.length; i++) {
                var currentLetter = $scope.answerKeyboard[i].correctLetter;
                // check to avoid duplicates
                if ($.grep(letters, function(e){ return e.char == currentLetter; }).length == 0) {
                    var keyboardSearchResult = $.grep($scope.keyboard, function(e){ return e.char == currentLetter; });
                    if (keyboardSearchResult.length > 0) {
                        letters.push(keyboardSearchResult[0]);
                    }
                }
            }
            // get number of letters to fill
            if (numLettersNotFilled < 0) numLettersNotFilled = 0;
            var numLettersToFill = letters.length - numLettersNotFilled;
            if (numLettersToFill < 0) return;

            for (i = 0; i < numLettersToFill; i++) {
                $scope.selectLetter(letters[i]);
            }
        }

        $scope.partialCompleteSolutionLettersFilled = function (numLettersFilled) {
            var letters = [];
            // get all the keyboard letters in correct solution
            for (var i = 0; i < $scope.answerKeyboard.length; i++) {
                var currentLetter = $scope.answerKeyboard[i].correctLetter;
                // check to avoid duplicates
                if ($.grep(letters, function(e){ return e.char == currentLetter; }).length == 0) {
                    var keyboardSearchResult = $.grep($scope.keyboard, function(e){ return e.char == currentLetter; });
                    if (keyboardSearchResult.length > 0) {
                        letters.push(keyboardSearchResult[0]);
                    }
                }
            }
            if (numLettersFilled > letters.length) numLettersFilled = letters.length;
            for (i = 0; i < numLettersFilled; i++) {
                $scope.selectLetter(letters[i]);
            }
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
    }]);

    app.controller('VigenereAnswerController', ['$scope', function($scope) {
        $scope.incorrectAnswer = false;
        $scope.correctAnswer = false;
        $scope.currentAnswerIndex = 0;
        $scope.selectLetter = function(keyboardLetter) {
            if (!keyboardLetter.selectable || $scope.currentAnswerIndex == -1) return;
            $scope.correctAnswer = false;
            var selectedLetter = keyboardLetter.char;
            var index = $scope.currentAnswerIndex;

            // if there is already a selection. remove that selection
            if ($scope.answerKeyboard[index] != "") {
                $scope.deselectLetter($scope.answerKeyboard[index]);
            }
            // insert the selected keyboardLetter into the answer
            $scope.answerKeyboard[index].currentLetter = selectedLetter;
            $scope.answerKeyboard[index].keyboardLetterId = keyboardLetter.id;
            $scope.answerKeyboard[index].deselectable = true;
            //get index of earliest empty keyboardLetter and highlight it
            $scope.currentAnswerIndex = -1;
            for (var i = 0; i < $scope.answerKeyboard.length; i++) {
                if ($scope.answerKeyboard[i].currentLetter == "") {
                    $scope.currentAnswerIndex = i;
                    break;
                }
            }
            keyboardLetter.selectable = !keyboardLetter.selectable;
            if (answerFilled()) {
                $scope.correctAnswer = checkSuccess();
                $scope.incorrectAnswer = !$scope.correctAnswer;
                if ($scope.correctAnswer) {
                    $scope.showModal();
                }
            }
        }

        $scope.deselectLetter = function(answerKeyboardletter) {
            // get index of deselected answerKeyboardletter
            $scope.currentAnswerIndex = answerKeyboardletter.id;
            if(!answerKeyboardletter.deselectable) return;
            var deselectedLetter = answerKeyboardletter.currentLetter;
            // remove all instances of the answerKeyboardletter from the answer
            $scope.answerKeyboard[$scope.currentAnswerIndex].currentLetter = "";
            // match the deselected answerKeyboardletter to the keyboard to reenable it
            var keyboardIndex = answerKeyboardletter.keyboardLetterId;
            if (keyboardIndex == -1) return;
            $scope.keyboard[keyboardIndex].selectable = true;
            $scope.incorrectAnswer = false;
        }

        $scope.partialCompleteSolutionLettersNotFilled = function(numLettersNotFilled) {
            var letters = [];
            // get all the keyboard letters in correct solution
            for (var i = 0; i < $scope.answerKeyboard.length; i++) {
                var currentLetter = $scope.answerKeyboard[i].correctLetter;
                // check to avoid duplicates
                if ($.grep(letters, function(e){ return e.char == currentLetter; }).length == 0) {
                    var keyboardSearchResult = $.grep($scope.keyboard, function(e){ return e.char == currentLetter; });
                    if (keyboardSearchResult.length > 0) {
                        letters.push(keyboardSearchResult[0]);
                    }
                }
            }
            // get number of letters to fill
            if (numLettersNotFilled < 0) numLettersNotFilled = 0;
            var numLettersToFill = letters.length - numLettersNotFilled;
            if (numLettersToFill < 0) return;

            for (i = 0; i < numLettersToFill; i++) {
                $scope.selectLetter(letters[i]);
            }
        }

        $scope.createVigenereKeyboard = function(answerWord) {
            var KEYBOARD_SIZE = 10;
            var keyboardLetters = answerWord;
            var keyboardArray = [];
            // pad the keyboard with random letters
            while (keyboardLetters.length < KEYBOARD_SIZE) {
                var newLetter = String.fromCharCode(Math.floor((Math.random() * 26)) + "A".charCodeAt(0));
                keyboardLetters += newLetter;
            }
            keyboardLetters = shuffle(keyboardLetters);
            //put the string into an array which has [string, bool] objects
            for (i = 0; i < keyboardLetters.length; i++) {
                keyboardArray.push(new KeyboardLetter(i, keyboardLetters[i]));
            }
            return keyboardArray;
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

        $scope.createKeywordKeyboard = function (plaintext, keyword) {
            var keywordKeyboard = [];
            for (var i = 0; i < plaintext.length; i++) {
                var num = i % keyword.length;
                keywordKeyboard.push(new KeywordLetter(num, keyword[num]));
            }
            return keywordKeyboard;
        }

        function KeywordLetter (number, letter) {
            this.keywordNumber = number;
            this.letter = letter;
            this.isSelected = false;
        }
    }]);

    app.controller('CaesarLevel', ['$scope', '$window', '$controller', function($scope, $window, $controller) {
        $controller('AnswerController', {$scope: $scope});
        $scope.key = Math.floor((Math.random() * 25) + 1);
        $scope.plaintext = getNewWord();
        $scope.ciphertext = encryptCaesar($scope.plaintext, $scope.key);
        // determine if level is an encrypt or decrypt challenge
        $scope.answertext = ($scope.currentLevelIndex == 1) ? $scope.ciphertext : $scope.plaintext;
        $scope.answerKeyboard = retrieveAnswer($scope.answertext);
        $scope.keyboard = createKeyboard($scope.answertext);
        $scope.$on('nextStage', function(e) {
            $scope.setupStage();
            $scope.levelSetup();
        });
        $scope.setupStage = function() {
            $scope.key = Math.floor((Math.random() * 25) + 1);
            $scope.plaintext = getNewWord();
            $scope.ciphertext = encryptCaesar($scope.plaintext, $scope.key);
            $scope.answertext = ($scope.currentLevelIndex == 1) ? $scope.ciphertext : $scope.plaintext;
            $scope.answerKeyboard = retrieveAnswer($scope.answertext);
            $scope.keyboard = createKeyboard($scope.answertext);
            $scope.incorrectAnswer = false;
            $scope.correctAnswer = false;
        }
        
        function encryptCaesar(plainText, key) {
            var zCharCode = "Z".charCodeAt(0);
            var aCharCode = "A".charCodeAt(0);
            plainText = plainText.toUpperCase();
            var cipherTextArray = [];
            for (var i = 0; i < plainText.length; i++) {
                var charCode = plainText.charCodeAt(i);
                // skip non alphabetical characters
                if (charCode < aCharCode || charCode > zCharCode) continue;
                var newValue = charCode + key;
                if (newValue > zCharCode) {
                    newValue -= 26;
                }
                cipherTextArray[i] = String.fromCharCode(newValue);
            }
            var cipherText = cipherTextArray.join("");
            // remove non-alphabetical characters
            cipherText = cipherText.replace(/\W+/g, "");
            return cipherText;
        }
    }]);

    app.controller('CaesarIntroLevel', ['$scope', '$window', '$controller', function($scope, $window, $controller) {
        $controller('CaesarLevel', {$scope: $scope});
        $scope.$parent.maxStage = 1;
        $scope.partialCompleteSolutionLettersNotFilled(2);

    }]);

    app.controller('CaesarEncrypt', ['$scope', '$window', '$controller', function($scope, $window, $controller) {
        $controller('CaesarLevel', {$scope: $scope});
        $scope.levelSetup = function() {
        }
    }]);

    app.controller('CaesarDecrypt', ['$scope', '$window', '$controller', function($scope, $window, $controller) {
        $controller('CaesarLevel', {$scope: $scope});
        $scope.partialCompleteSolutionLettersFilled(1);
        $scope.levelSetup = function() {
            $scope.partialCompleteSolutionLettersFilled(1);
        }
    }]);

    app.controller('CaesarBruteForce', ['$scope', '$window', '$controller', function($scope, $window, $controller) {
        $controller('CaesarLevel', {$scope: $scope});
        $controller('SentenceDisplayController', {$scope: $scope});
        $scope.sentenceObject = getNewSentenceObject();
        $scope.plaintext = $scope.sentenceObject.sentence;
        $scope.ciphertext = encryptCaesar($scope.plaintext, $scope.key);
        $scope.formattedSentence = $scope.createFormattedSentence($scope.ciphertext);
        $scope.currentKey = currentKey;
        $scope.levelSetup = function() {
            $scope.sentenceObject = getNewSentenceObject();
            $scope.plaintext = $scope.sentenceObject.sentence;
            $scope.ciphertext = encryptCaesar($scope.plaintext, $scope.key);
            $scope.formattedSentence = $scope.createFormattedSentence($scope.ciphertext);
            $scope.currentKey = currentKey;
        }

        $scope.displayLiveDecrypt = function(char) {
            if (char == " ") return " ";
            var charCode = char.charCodeAt(0);
            var newCode = charCode - $scope.currentKey;
            newCode = (newCode < "A".charCodeAt(0)) ? newCode + 26 : newCode;
            return String.fromCharCode(newCode);
        }

        function encryptCaesar(plainText, key) {
            var zCharCode = "Z".charCodeAt(0);
            var aCharCode = "A".charCodeAt(0);
            plainText = plainText.toUpperCase();
            var cipherTextArray = [];
            for (var i = 0; i < plainText.length; i++) {
                var charCode = plainText.charCodeAt(i);
                var newValue = charCode;
                // skip non alphabetical characters
                if (charCode >= aCharCode && charCode <= zCharCode) {
                    newValue = charCode + key;
                    if (newValue > zCharCode) {
                        newValue -= 26;
                    }
                }
                cipherTextArray[i] = String.fromCharCode(newValue);
            }
            var cipherText = cipherTextArray.join("");
            return cipherText;
        }
        
        $scope.updateKey = function() {
            $scope.currentKey = currentKey;
        }

        updateKeyTouch = function() {
            var scope = angular.element($("#game")).scope();
            scope.$apply(function(){
                $scope.currentKey = currentKey;
            })
        }

        $scope.submitAnswer = function() {
            if ($scope.currentKey == $scope.key) {
                $scope.showModal();
                $(".live-preview").addClass("correct-letter");
            } else {
                setTimeout(function() {
                    $(".live-preview").addClass("incorrect-letter");
                }, 1);
                $(".live-preview").removeClass("incorrect-letter");
            }
        }
    }]);

    app.controller('SentenceDisplayController', ['$scope', function($scope) {
        $scope.createFormattedSentence = function(sentence) {
            var LINE_SIZE = 20;
            var wordsArray = sentence.split(" ");
            var i = 0, currentLineWidth = 0, currentSentence = "", formattedSentence = [];
            for (var i = 0; i < wordsArray.length; i++) {
                currentLineWidth += wordsArray[i].length;
                if (currentLineWidth > LINE_SIZE) {
                    formattedSentence.push(currentSentence.trim());
                    currentLineWidth = 0;
                    currentSentence = "";
                    i--;
                } else {
                    currentSentence += wordsArray[i] + " ";
                    currentLineWidth = currentSentence.length;
                }
            }
            formattedSentence.push(currentSentence.trim());
            return formattedSentence;
        }

        function checkSuccess() {
            for (var i = 0; i < $scope.answerKeyboard.length; i++) {
                if ($scope.answerKeyboard[i].currentLetter != $scope.answerKeyboard[i].correctLetter) {
                    return false;
                }
            }
            return true;
        }

        $scope.displayUserSelection = function(char) {
            if (char == " ") return char;
            // if level complete, show full answer
            if (checkSuccess()) {
                var findMapping = $.grep($scope.mapping, function(map){ return map.cipherLetter == char; });
                if (findMapping.length > 0) {
                    return findMapping[0].keyLetter;
                }
                return "";
            }
            var index = -1;
            for (var i = 0; i < $scope.answerKeyboard.length; i++) {
                if ($scope.answerKeyboard[i].currentLetter == char) {
                    index = i;
                    break;
                }
            }
            if (index == -1) return "";
            return $scope.plaintext[index];

        }
    }]);

    app.controller('SubstitutionBaseController', ['$scope', '$window', '$controller', function($scope, $window, $controller) {
        $controller('AnswerController', {$scope: $scope});
        $scope.Math = window.Math;
        $scope.sentenceObject = getNewSentenceObject();
        $scope.mapping = createNewMapping();
        $scope.frequencies = getLetterFrequencies($scope.sentenceObject.sentence);
        $scope.englishFrequencies = [
            ["E", 12.7],
            ["T", 9.1],
            ["A", 8.2],
            ["O", 7.5],
            ["I", 7.0],
            ["N", 6.7],
            ["S", 6.3],
            ["H", 6.1],
            ["R", 6.0],
            ["D", 4.3],
            ["L", 4.0],
            ["C", 2.8],
            ["U", 2.8],
            ["M", 2.4],
            ["W", 2.4],
            ["F", 2.2],
            ["G", 2.0],
            ["Y", 2.0],
            ["P", 1.9],
            ["B", 1.5],
            ["V", 1.0],
            ["K", 0.8],
            ["J", 0.2],
            ["X", 0.2],
            ["Q", 0.1],
            ["Z", 0.1]
        ];
        $scope.setupStage = function() {
            $scope.sentenceObject = getNewSentenceObject();
            $scope.mapping = createNewMapping();
            $scope.frequencies = getLetterFrequencies($scope.sentenceObject.sentence);
        }
        $scope.$on('nextStage', function(e) {
            $scope.setupStage();
            $scope.levelSetup();
        });

        function createNewMapping() {
            var mapping = [];
            var alphabet = new Array();
            var shuffledAlphabet = new Array();
            // create array of ordered alphabet
            for (i = 0; i < 26; i++) {
                alphabet[i] = String.fromCharCode(i + "A".charCodeAt(0));
                shuffledAlphabet[i] = alphabet[i];
            }
            // shuffle the shuffledAlphabet
            var shuffledAlphabet = shuffleArray(shuffledAlphabet);
            // map the ordered alphabet to shuffled queue
            for (i = 0; i < alphabet.length - 1; i++) {
                var currentShuffledLetter = shuffledAlphabet.shift();
                // map to the top of queue if key doesn't match value (i.e. "A" won't map to "A")
                if (alphabet[i] != currentShuffledLetter) {
                    mapping[i] = new Mapping(alphabet[i], currentShuffledLetter);
                } else {
                    // if mapping is invalid, push letter to back of queue and take the next one
                    shuffledAlphabet.push(currentShuffledLetter);
                    // get the next top one. guaranteed to be different
                    currentShuffledLetter = shuffledAlphabet.shift();
                    mapping[i] = new Mapping(alphabet[i], currentShuffledLetter);
                }
            }
            // handle mapping the last letter ("Z")
            var lastLetter = shuffledAlphabet.shift();
            if (alphabet[alphabet.length-1] != lastLetter) {
                mapping[alphabet.length-1] = new Mapping(alphabet[alphabet.length-1], lastLetter);
            } else {
                // if the letters match, need to swap with another entry
                var firstValue = mapping[0].cipherLetter;
                mapping[0] = new Mapping(alphabet[0], lastLetter);
                mapping[alphabet.length-1] = new Mapping(alphabet[alphabet.length-1], currentShuffledLetter);
            }
            return mapping;
        }

        function Mapping(plain, cipher) {
            this.keyLetter = plain;
            this.cipherLetter = cipher;
        }

        $scope.encryptSubstitution = function(text, mapping) {
            for (var i = 0; i < text.length; i++) {
                var findMapping = $.grep(mapping, function(map){ return map.keyLetter == text[i]; });
                if (findMapping.length == 0) {
                    // no mapping found for this character, skip it
                    continue;
                } else {
                    text = text.replaceAt(i, findMapping[0].cipherLetter);
                }
            }
            return text;
        }

        String.prototype.replaceAt = function(index, character) {
            return this.substr(0, index) + character + this.substr(index+character.length);
        }

        function getLetterFrequencies(text) {
            var frequencyArray = new Array();
            // initialize each letter with a frequency of 0
            for (var i = 0; i < 26; i++) {
                var searchLetter = String.fromCharCode(i + "A".charCodeAt(0));
                var regexp = new RegExp(searchLetter, "gi");
                var count = (text.match(regexp) || []).length;
                frequencyArray[i] = new Frequency(searchLetter, count);
            }
            return frequencyArray;
        }

        $scope.getFrequencyCountOfLetter = function(letter, isPlaintext) {
            isPlaintext = (typeof isPlaintext === 'undefined') ? true : isPlaintext;
            if (isPlaintext) {
                var findFrequency = $.grep($scope.frequencies, function(freq) {return freq.letter == letter});
            } else {
                var findFrequency = $.grep($scope.frequencies, function(freq) {return freq.mapping.cipherLetter == letter});
            }
            if (findFrequency.length == 0) return 0;
            var count = findFrequency[0].count;
            return count;
        }

        $scope.getFrequencyPercentOfLetter = function (letter, isPlaintext) {
            isPlaintext = (typeof isPlaintext === 'undefined') ? true : isPlaintext;
            var count = $scope.getFrequencyCountOfLetter(letter, isPlaintext);
            var size = $scope.sentenceObject.sentence.replace(/\W/g, "").length;
            var percentValue = Math.round((count / size) * 100);
            return percentValue;
        }

        function Frequency(plainLetter, count) {
            this.letter = plainLetter;
            this.count = count;
            this.mapping = new Mapping("","");
            var findMapping = $.grep($scope.mapping, function(map){ return map.keyLetter == plainLetter; });
            if (findMapping.length > 0) {
                this.mapping = findMapping[0];
            }
        }



    }]);

    app.controller('SubstitutionIntroController', function($scope, $controller) {
        $controller('SubstitutionBaseController', {$scope: $scope});
        $scope.plaintext = getNewWord();
        $scope.ciphertext = $scope.encryptSubstitution($scope.plaintext, $scope.mapping);
        $scope.answerKeyboard = retrieveAnswer($scope.ciphertext);
        $scope.keyboard = createKeyboard($scope.ciphertext);
        $scope.$parent.maxStage = 1;
    });

    app.controller('SubstitutionLevelOne', function($scope, $controller) {
        $controller('SubstitutionBaseController', {$scope: $scope});
        $controller('SentenceDisplayController', {$scope: $scope});
        $scope.encryptedSentence = $scope.encryptSubstitution($scope.sentenceObject.sentence, $scope.mapping);
        $scope.plaintext = "ETA";
        $scope.answerText = $scope.encryptSubstitution($scope.plaintext, $scope.mapping);
        $scope.answerKeyboard = retrieveAnswer($scope.answerText);
        $scope.keyboardLetters = getKeyboardLetters($scope.answerText, $scope.frequencies);
        $scope.keyboard = createKeyboard($scope.keyboardLetters);
        $scope.formattedSentence = $scope.createFormattedSentence($scope.encryptedSentence);
        $scope.levelSetup = function() {
            $scope.encryptedSentence = $scope.encryptSubstitution($scope.sentenceObject.sentence, $scope.mapping);
            $scope.plaintext = "ETA";
            $scope.answerText = $scope.encryptSubstitution($scope.plaintext, $scope.mapping);
            $scope.answerKeyboard = retrieveAnswer($scope.answerText);
            $scope.keyboardLetters = getKeyboardLetters($scope.answerText, $scope.frequencies);
            $scope.keyboard = createKeyboard($scope.keyboardLetters);
            $scope.formattedSentence = $scope.createFormattedSentence($scope.encryptedSentence);
        }

        function getKeyboardLetters(answerText, frequencies) {
            var KEYBOARD_SIZE = 10;
            var sortedFreq = frequencies.sort(function(a,b) {
                return b.count - a.count;
            });
            var keyboardText = answerText;
            var i = 0;
            while(keyboardText.length < KEYBOARD_SIZE && i < frequencies.length) {
                var newChar = sortedFreq[i].mapping.cipherLetter;
                if (keyboardText.indexOf(newChar) == -1) {
                    keyboardText += newChar;
                }
                i++;
            }
            return keyboardText;
        }
    });

    app.controller('VigenereBaseController', function($scope, $controller) {
        $controller('VigenereAnswerController', {$scope: $scope});
        $scope.keyword = getNewKeyword();
        $scope.plainWord = getNewPlainWord();
        $scope.keywordKeyboard = $scope.createKeywordKeyboard($scope.plainWord, $scope.keyword);

        function getNewKeyword() {
            var MAX_KEY_SIZE = 3;
            var shortWordList = wordList.filter(function(x) {return x.length <= MAX_KEY_SIZE});
            return getWordFromList(shortWordList);
        }

        function getNewPlainWord() {
            var MIN_WORD_SIZE = 4;
            var longWordList = wordList.filter(function(x) { return x.length >= MIN_WORD_SIZE});
            return getWordFromList(longWordList);
        }

        $scope.encryptVigenere = function(plaintext, keyword) {
            plaintext = plaintext.toUpperCase();
            var keyValues = keyword.split("").map(function(x) { return x.charCodeAt(0) - "A".charCodeAt(0)});
            var cipherTextArray = [];
            for (i = 0; i < plaintext.length; i++) {
                // skip non-word characters
                if (/\W/.test(plaintext[i])) continue;
                var key = keyValues[i % keyValues.length];
                var newValue = plaintext.charCodeAt(i) + key;
                if (newValue > "Z".charCodeAt(0)) {
                    newValue -= 26;
                }
                cipherTextArray[i] = String.fromCharCode(newValue);
            }
            var cipherText = cipherTextArray.join("");
            return cipherText;
        }
    });

    app.controller('VigenereIntroController', function($scope, $controller) {
        $controller('VigenereBaseController', {$scope: $scope});
        $scope.plaintext = $scope.plainWord
        $scope.ciphertext = $scope.encryptVigenere($scope.plaintext, $scope.keyword);
        $scope.answerKeyboard = retrieveAnswer($scope.ciphertext);
        $scope.keyboard = $scope.createVigenereKeyboard($scope.plaintext, $scope.ciphertext);
        $scope.$parent.maxStage = 1;

    });
    
    var levelState = {
        currentStage: 1,
        maxStage: 3
    };


        
})();
