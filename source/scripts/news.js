angular.module('news', [])

function newsCtrl($scope, $http){

    $http.get('../articles.json').success(function(callbackData){
        
        $scope.articles = callbackData;
            
    });

}
