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
        .when('/video/:id', {
            templateUrl: 'partials/video-form.html',
            controller: 'EditVideoCtrl'
        })
        .when('/video/delete/:id', {
            templateUrl: 'partials/video-delete.html',
            controller: 'DeleteVideoCtrl'
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
        Videos.query(function(videos){   //we use the query method to get all videos.
            $scope.videos = videos;
            $scope.search = keyword;
        });
    }]);

// a controller is responsible for handling events raised by the view, which is click event of the Save button
app.controller('AddVideoCtrl',
    function($scope, $resource, $location){
        $scope.save = function(){        //we define the save method on the $scope. This method will be called when the user clicks the Save button.
            var Videos = $resource('/api/videos'); //we call the $resource method passing the address of our API (/api/videos). This returns an object with methods to work with the API. In the last section
            //The videos.save method takes two parameters: the object to post, and the callback function, which we use the $location service to change the browser’s address to the root of the site. 
            Videos.save($scope.video, function(){   //we use the save method to post a video to our API ; scope.video of vdieo-form html
                $location.path('/');
            });
        };
    });

// Edit the video // this part no yet!
// We have an extra dependency here: $routeParams, which we use for accessing parameters in the route (URL). In this case, the ID of the video to edit will be our route parameter.
app.controller('EditVideoCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){   
        var Videos = $resource('/api/videos/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        Videos.get({ id: $routeParams.id }, function(video){
            $scope.video = video;
        });

        $scope.save = function(){
            Videos.update($scope.video, function(){
                $location.path('/');
            });
        }
    }]);

app.controller('DeleteVideoCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Videos = $resource('/api/videos/:id');

        Videos.get({ id: $routeParams.id }, function(video){
            $scope.video = video;
        })

        $scope.delete = function(){
            Videos.delete({ id: $routeParams.id }, function(video){
                $location.path('/');
            });
        }
    }]);