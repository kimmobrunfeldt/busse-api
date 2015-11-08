import _ from 'lodash';
import moment from 'moment';

function transformGtfsFeed(feed) {
    // feed.entity is an array of entities
    return _.map(feed.entity, transformEntity);
}

function transformEntity(entity) {
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
    transformGtfsFeed
};
