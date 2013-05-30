var app = angular.module('msrdio', [])

    app.controller('listCtrl', function($scope, $http, $filter)
    {
        $http.get('test.json').success(function(callbackData)
        {
            $scope.directors = callbackData;
            
            $scope.$watch("searchText", function(query){
                $scope.filteredData = $filter("filter")($scope.directors, query);
            });
        });
    });
