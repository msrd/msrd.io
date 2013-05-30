function listCtrl($scope, $http){

    $http.get('test.json').success(function(callbackData)
    {
        $scope.directors = callbackData;
    });
}
