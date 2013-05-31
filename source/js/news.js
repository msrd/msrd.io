var app = angular.module('msrdio', [])

    app.controller('newsCtrl', function($scope, $http)
    {
        $http.get('../articles.json').success(function(callbackData)
        {
            $scope.articles = callbackData;
            
        });
    });
