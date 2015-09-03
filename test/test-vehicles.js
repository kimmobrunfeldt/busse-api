import {apiAjax, expectBadRequest} from './test-utils';

function testVehicles() {
    describe('/vehicles', function() {
        this.timeout(5000);

        it('topLeft without bottomRight should not be accepted', (done) => {
            _expectBadVehiclesRequest({
                query: {
                    topLeft: '123.122:123.22'
                }
            }, done);
        });

        it('bottomRight without topLeft should not be accepted', (done) => {
            _expectBadVehiclesRequest({
                query: {
                    bottomRight: '123.122:123.22'
                }
            }, done);
        });

        it('invalid bottomRight should not be accepted', (done) => {
            _expectBadVehiclesRequest({
                query: {
                    bottomRight: '123.122'
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
