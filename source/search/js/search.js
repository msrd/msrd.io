var app = angular.module('search', []);

app.controller('listCtrl', function($scope, $http, $filter){
    'use strict';
    $scope.url = '../search/js/test.json';

    $http.get($scope.url).success(function(callbackData)
    {
        callbackData.forEach(function(item) {
            item.FullName = item.First + ' ' + item.Last;
        });

        $scope.directors = callbackData;

        $scope.$watch('searchText', function(query){
            $scope.filteredData = $filter('filter')($scope.directors, query);
        });
    });


});

app.directive('status', function($compile) {
    var templates = {
        'one': '<div style="color:red">{{director.FullName}}</div>',
        'two': '<div style="color:blue">{{director.FullName}}</div>',
        'three': '<div style="color:green">{{director.FullName}}</div>'
    };

    var linker = function($scope, element, attrs){
        
        var filterCount = $scope.$parent.$parent.filteredData.length;
        var html = '';

        if(filterCount >= 50){
            html = templates.one;
        }
        else if(filterCount <= 49 && filterCount >= 25){
            html = templates.two;
        }
        else{
            html = templates.three;
        }
        element.replaceWith($compile(html)($scope));
    
    };
    
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        link: linker,
        scope: {
            director: '@'
        }
    };

});
