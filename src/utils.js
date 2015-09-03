import _ from 'lodash';

// Route which assumes that the Promise `func` returns, will be resolved
// with data which will be sent as json response.
function createJsonRoute(func) {
    return createRoute(func, function sendJsonResponse(data, req, res, next) {
        res.json(data);
    });
}

// Generic route creator
// Factory function to create a new route to reduce boilerplate in controllers
// and make it easier to interact with promises.
// `func` must return a promise
// `responseHandler` receives the data from asynchronous `func` as the first
//                   parameter
function createRoute(func, responseHandler) {
    return function route(req, res, next) {
        if (!_.isFunction(responseHandler)) {
            func(req, res, next).catch(next);
        } else {
            func(req, res).then(function(data) {
                return responseHandler(data, req, res, next);
            })
            .catch(next);
        }
    };
}

export {
    createRoute,
    createJsonRoute
};
