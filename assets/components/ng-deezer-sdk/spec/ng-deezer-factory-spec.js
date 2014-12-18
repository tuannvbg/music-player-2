describe("deezer factory", function() {
    beforeEach(function() {
        DZ = jasmine.createSpyObj('DZ', ['init', "login", "api", "logout", "getLoginStatus"]);
        module('gianarb.deezer');
    });

    var _deezerFactory;

    beforeEach(inject(function(deezer) {
        _deezerFactory = deezer;
    }));

    it('shoud call init', function() {
        expect(DZ.init).toHaveBeenCalled();
    });

     it('shoud call login DZ sdk if I use login factory method', function() {
        _deezerFactory.login(function(response){
            //callback
        });
        expect(DZ.login).toHaveBeenCalled();
    });
    
    it('shoud call logout DZ sdk if I use logout factory method', function() {
        _deezerFactory.logout(function(){
            //callback
        });
        expect(DZ.logout).toHaveBeenCalled();
    });
    
    it('should call api DZ sdk method if i use api factory method', function(){
        _deezerFactory.api("users/me", function(response){
            //callback
        });
        expect(DZ.api).toHaveBeenCalled();
    });

     it('should call getLoginStatus DZ sdk method if i use getLoginStatus factory method', function(){
        _deezerFactory.getLoginStatus(function(response){
            //callback
        }, function(){});
        expect(DZ.getLoginStatus).toHaveBeenCalled();
    });

});
