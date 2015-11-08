import _ from 'lodash';
import moment from 'moment';

function transformFirebaseVehicles(vehicles) {
    return _.map(vehicles, _transformFirebaseVehicle);
}

function _transformFirebaseVehicle(vehicle) {
    return {
        id: vehicle.id,
        type: vehicle.vtype || 'bus',
        line: vehicle.routeTag,
        latitude: vehicle.lat,
        longitude: vehicle.lon,
        rotation: vehicle.heading,
        responseTime: moment().toISOString()
    };
};

function transformGtfsFeed(feed) {
    // feed.entity is an array of entities
    return _.map(feed.entity, _transformGtfsEntity);
}

function _transformGtfsEntity(entity) {
    return {
        id: entity.vehicle.vehicle.id,
        // TODO: other types?
        type: 'bus',
        line: entity.vehicle.vehicle.label,
        latitude: entity.vehicle.position.latitude,
        longitude: entity.vehicle.position.longitude,
        rotation: entity.vehicle.position.bearing || 0,
        responseTime: moment().toISOString()
    };
}

export default {
    transformFirebaseVehicles,
    transformGtfsFeed
};
