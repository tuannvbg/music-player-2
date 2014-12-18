(function () {
    angular.module('musicPlayer').directive('player', [function(){
      // Runs during compile
      return {
        restrict: 'AE',
        controller: 'PlayerController',
        controllerAs: 'play',
        templateUrl: '/app/player/player.html'
      };
    }]);
})();