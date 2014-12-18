(function() {
    angular.module('musicPlayer',[
        'ngRoute'
    ]);

    angular.module('musicPlayer').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $routeProvider
            .when('/', {
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });

    }]);
})();