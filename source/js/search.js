var app = angular.module('myApp', [])

  app.factory('RdList', ['$http', function ($http) {
        return{
            get: function(callback){
                $http.get('rdlist.json').success(function(item){
                    item.forEach(function (data){
                        data.FullName = data.First + ' ' + data.Last;
                        if(data.GravatarHash){
                          data.Avatar = 'http://www.gravatar.com/avatar/' + data.GravatarHash + '?s=200';
                        }
                        else{
                          data.Avatar = 'http://placekitten.com/g/200/200';
                        }
                    });
                    callback(item);
                });
            }
        };
    }]);


    app.controller('DataCtrl', function($scope, RdList) {

        RdList.get(function(data){
            $scope.items = data;
            $scope.displayeditem = data[99];
        });
        
        $scope.show = function(item){
            $scope.displayeditem = item;
        };
    });
