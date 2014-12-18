describe("deezer provider", function() {
    beforeEach(function() {
        DZ = jasmine.createSpyObj('DZ', ['init']);
        module('gianarb.deezer');
    });

    var _$deezer;

    beforeEach(inject(function($deezer) {
        _$deezer= $deezer;
    }));

    it('it call init of deezer javascript sdk', function() {
        expect(DZ.init).toHaveBeenCalled();
    });

});
