var app = angular.module('Vidzy', ['ngResource', 'ngRoute']); //ngRoute is one of the built-in Angular modules for configuring routes.

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){   //Now we depend on two modules: ngResource, for consuming RESTful APIs and ngRoute for routing.
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-video', {
            templateUrl: 'partials/video-form.html',
            controller: 'AddVideoCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode( true );
}]);

app.controller('HomeCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){

    	var keyword = $location.search().keyword;

        var Videos = $resource('/api/videos', { search : keyword }); // cossuming API while passing a parameter
        Videos.query(function(videos){
            $scope.videos = videos;
            $scope.search = keyword;
        });
    }]);

app.controller('AddVideoCtrl',
    function($scope, $resource, $location){
        $scope.save = function(){
            var Videos = $resource('/api/videos');
            Videos.save($scope.video, function(){   //scope.video of vdieo-form html
                $location.path('/');
            });
        };
    });