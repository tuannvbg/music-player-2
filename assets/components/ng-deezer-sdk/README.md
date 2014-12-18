[![Build Status](https://travis-ci.org/gianarb/ng-deezer-sdk.svg)](https://travis-ci.org/gianarb/ng-deezer-sdk)
## ng-deezer-sdk
![deezer logo](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQOkJ3jggEbtdYFEtBHa_dEpmzwzE9W-iUZFmmy4IiL6OpMiAc)

### Bower
``` json
{
    "dependencies": {
        "ng-deezer-sdk": "git@github.com:gianarb/ng-deezer-sdk.git"
    }
}
```

### First integration step
``` html
<script src="incude/script/deezer.js"></script>
<script src="//cdn-files.deezer.com/js/min/dz.js"></script>
```
Include my module and deezer official sdk

### My bootstrap example
``` javascript
angular.module( 'ngBoilerplate', [
  'gianarb.deezer'
])
.config(function myAppConfig ($deezerProvider) {
    // Init provider configuration
    $deezerProvider.setChannelUrl("http://yourchannel.url");
    $deezerProvider.setAppId("xxxxxx");
})
.run(['DeezerFactory', '$rootScope', function run (DeezerFactory, $rootScope) {
    //Check if I'm already logged
    if(!$rootScope.user_data){    
        DeezerFactory.login(function(response){
            $rootScope.user_data = {                                                                                                                                                                                                                                                               
                "access_token"  : response.authResponse.accessToken,                                                                                                                                                                                                                               
                "user_id"       : response.userID                                                                                                                                                                                                                                                  
            };    
        });
    }
}])
```

### I'm me!
``` javascript
.controller( 'HomeCtrl', ['$scope', 'deezer', function HomeController( $scope, deezer ) {
    deezer.api('album/7723488').then(function(resp){
        $scope.album = resp;
    });
}]);

```
