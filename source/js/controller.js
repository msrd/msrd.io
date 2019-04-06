var app = angular.module('msrd', []);
    // config(function($routeProvider){
    //     $routeProvider.
    //         when('/archive', {templateUrl:'../pages/archive.html', controller:archiveCtrl}).
    //         when('/home', {templateUrl: '../index.html', controller:homeCtrl}).
    //         otherwise(redirectTo:'/home'});
    // )};

var decodeEmail = function ( encodedEmail ) {
    var result = '';
    for ( var i = 0; i < encodedEmail.length; i++ ) {
        var letter = String.fromCharCode( encodedEmail[i] - 1 );
        result += letter;
    }
    return result;
};

app.factory('RdList', ['$http', function ($http) {
    return{
        get: function(callback){
            $http.get('../rdlist.json').success(function(item){
                item.forEach(function (data){
                    data.FullName = data.First + ' ' + data.Last;
                    data.Email = decodeEmail( data.Email );
                    data.Avatar = data.GravatarHash
                        ? 'http://www.gravatar.com/avatar/' + data.GravatarHash + '?s=256'
                        : '../images/logo/ico/fav256.png';
                });
                callback(item);
            });
        }
    };
}]);

app.controller('searchCtrl', function($scope, RdList) {

    RdList.get(function(data){
        $scope.items = data;
        $scope.displayeditem = data[99];
    });
    
    $scope.show = function(item){
        $scope.displayeditem = item;
    };

    $scope.clear = function(){
        $scope.search.FullName = null;
    };
});

app.controller('newsCtrl', function($scope, $http){

    $http.get('../articles.json').success(function(results){
        $scope.articles = results;
    });

});
