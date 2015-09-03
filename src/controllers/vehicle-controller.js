import _ from 'lodash';
import * as vehicleService from '../services/vehicle-service';
import {createJsonRoute} from '../utils';

let getVehicles = createJsonRoute((req, res) => {
    let params = {
        areas: ensureArray(req.query.area)
    };

    var lines = ensureArray(req.query.line);
    params.lines = _.map(lines, (lineString) => {
        const [area, id] = _splitMultiParameter(lineString);

        return {
            area,
            id
        };
    });

    var bounds = req.query.bounds;
    if (_.isArray(bounds)) {
        if (bounds.length < 3) {
            const err = new Error('Bounds have to form a polygon');
            err.status = 400;
            throw err;
        }

        params.bounds = _.map(bounds, _parseCoordinate);
    }

    return vehicleService.getVehicles(params);
});

function ensureArray(obj) {
    if (_.isArray(obj)) {
        return obj
    } else if (!_.isUndefined(obj)) {
        return [obj];
    }

    return obj;
}

function _parseCoordinate(coordString) {
    const [latitude, longitude] = _splitMultiParameter(coordString);
    return {
        latitude,
        longitude
    };
}

function _splitMultiParameter(paramValue) {
    const splitted = paramValue.split(':');

    if (splitted.length !== 2) {
        const msg = 'Invalid format of parameter';
        const err = new Error(msg);
        err.status = 400;
        throw err;
    }

    return splitted;
}

export {
    getVehicles
};
