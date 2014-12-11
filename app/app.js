(function() {
    angular.module('music-player',[
        'ngRoute'
    ]);

    angular.module('music-player').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){

        $routeProvider
            .when('/', {
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });

    }]);
})();