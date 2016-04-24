(function () {
    var app = angular.module('cryptoLearner', ['ui.bootstrap']);
    app.controller('MenuController', function($scope) {
        $scope.noWrapSlides = true;
        this.levels = levels;
    });
    
    var levels = [{
        name: 'Caesar Cipher',
        buttons: [{
            name: 'Encrypt',
            isLocked: false,
            icon: 'glyphicon-pencil'
        }, {
            name: '',
            isLocked: true,
            icon: ''
        }, {
            name: '',
            isLocked: true,
        }]
    }, {
        name: 'Vigenere Cipher',
        buttons: [{
            name: 'Encrypt',
            isLocked: false,
            icon: 'glyphicon-pencil'
        }, {
            name: '',
            isLocked: true,
            icon: ''
        }, {
            name: '',
            isLocked: true,
            icon: ''
        }]
    }, {
        name: 'Substitution Cipher',
        buttons: [{
            name: 'Encrypt',
            isLocked: false,
            icon: 'glyphicon-pencil'
        }, {
            name: '',
            isLocked: true,
            icon: ''
        }, {
            name: '',
            isLocked: true,
            icon: ''
        }]
    }];
        
})();