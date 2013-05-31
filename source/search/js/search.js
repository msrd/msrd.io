var app = angular.module('msrdio', [])

    app.controller('listCtrl', function($scope, $http, $filter)
    {
        $http.get('../search/js/test.json').success(function(callbackData)
        {
            callbackData.forEach(function(item) {
                item.FullName = item.First + " " + item.Last;
            });

            $scope.directors = callbackData;
            
            $scope.$watch("searchText", function(query){
                $scope.filteredData = $filter("filter")($scope.directors, query);
            });
        });
    });
