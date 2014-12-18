(function () {
    angular.module('musicPlayer').controller('MainController', ['appSettings', function(appSettings){
        this.message = appSettings.text;
    }]);
})();