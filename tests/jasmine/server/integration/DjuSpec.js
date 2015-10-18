describe('DjuService', function() {
    it('fixture is ok', function () {
       expect(Djus.find().count()).toBe(8760);
    });

    it('from 01/10 to 31/04, all the week, with 20°C all the day should return 2661', function () {
    });
});