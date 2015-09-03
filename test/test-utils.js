import _ from 'lodash';
import {expect} from 'chai';
import ajax from '../src/ajax';

const VERBOSE =  process.env.VERBOSE_TESTS === 'true';
const apiUrl = 'http://localhost:' + process.env.PORT + '/api';

// Convenience ajax function to call the local API
function apiAjax(relativeUrl, opts = {}) {
    opts = _.merge({
        raw: true,
        verbose: VERBOSE,
        logPrefix: '  -> '
    }, opts);

    return ajax(apiUrl + relativeUrl, opts);
}

function expectBadRequest(ajaxPromise, msg) {
    return ajaxPromise.then((res) => {
        expect(res.status).to.equal(400, msg);
    });
}

const log = console.log.bind(this, '--> ');

export {
    apiUrl,
    apiAjax,
    expectBadRequest,
    log
};
