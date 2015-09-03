import startApp from '../src/app';
import testVehicles from './test-vehicles';
import {log, apiUrl} from './test-utils';

describe('Busse API', function testApi() {
    this.timeout(7000);
    let expressApp;

    // Gracefully start and close local server before and after tests
    before(function(done) {
        log('Starting local server ..');
        expressApp = startApp();
        expressApp.server.on('listening', function() {
            log('Server started');
            log('Test API url: ' + apiUrl + '\n');
            done();
        });
    });

    after(function(done) {
        log('Closing local server ..');
        expressApp.server.close(function() {
            log('Server closed');
            done();
        });
    });

    testVehicles();
});
