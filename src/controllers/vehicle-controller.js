import _ from 'lodash';
import * as vehicleService from '../services/vehicle-service';
import {createJsonRoute} from '../utils';

let getVehicles = createJsonRoute(function(req, res) {
    let params = {
        area: req.query.area
    };

    params.line = _.map(req.query.line, (lineString) => {
        const [area, line] = _splitMultiParameter(lineString);

        return {
            area,
            line
        };
    });

    if (req.query.topLeft) {
        params.topLeft = _parseCoordinate(req.query, 'topLeft');
    };

    if (req.query.bottomRight) {
        params.bottomRight = _parseCoordinate(req.query, 'bottomRight');
    };

    if (_.any([params.topLeft, params.bottomRight]) &&
        !_.all([params.topLeft, params.bottomRight])
    ) {
        const err = new Error('Both topLeft and bottomRight must be defined');
        err.status = 400;
        throw err;
    }

    return vehicleService.getVehicles(params);
});

function _parseCoordinate(query, paramName) {
    const [latitude, longitude] = _splitMultiParameter(query[paramName]);
    return {
        latitude,
        longitude
    };
}

function _splitMultiParameter(paramValue, name) {
    const splitted = paramValue.split(':');

    if (splitted.length !== 2) {
        const msg = 'Invalid format of parameter: ' + name;
        const err = new Error(msg);
        err.status = 400;
        throw err;
    }

    return splitted;
}

export {
    getVehicles
};
