const chakram = require('chakram');
const expect = chakram.expect;

describe('Dju computation', function () {
    it('data fixture is correctly loaded', function () {
        Dju.count()
            .then(function(nb) {
                expect(nb).to.be.equal(8760);
            });
    })
});
