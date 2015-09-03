import {apiAjax, expectBadRequest} from './test-utils';

function testVehicles() {
    describe('/vehicles', function() {
        this.timeout(5000);

        it('bounds with lower than 3 coordinates', (done) => {
            _expectBadVehiclesRequest({
                query: {
                    bounds: ['123.122:123.22', '123.122:123.22']
                }
            }, done);
        });

        it('invalid line should not be accepted', (done) => {
            _expectBadVehiclesRequest({
                query: {
                    line: 'helsinkinotvalid.line'
                }
            }, done);
        });
    });
}

function _expectBadVehiclesRequest(ajaxOpts, done) {
    expectBadRequest(apiAjax('/vehicles', ajaxOpts)).nodeify(done);
}

export default testVehicles;
