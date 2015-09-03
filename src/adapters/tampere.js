// Example adapter for Tampere city
// Returned format from original API is a bit strange and very deeply nested.
// Original API url: http://data.itsfactory.fi/siriaccess/vm/json

import moment from 'moment';
import ajax from '../ajax';

const id = 'tampere';
const name = 'Tampere';
const apiUrl = 'http://data.itsfactory.fi/siriaccess/vm/json';

function fetch() {
    return ajax(apiUrl).then(_transform);
}

function _transform(data) {
    const vehicles = data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity;
    return vehicles.map(_transformVehicle.bind(this, data));
}

function _transformVehicle(data, vehicle) {
    const journey = vehicle.MonitoredVehicleJourney;

    return {
        id: journey.VehicleRef.value,
        type: 'bus',
        line: journey.LineRef.value,
        latitude: journey.VehicleLocation.Latitude,
        longitude: journey.VehicleLocation.Longitude,
        rotation: journey.Bearing,
        responseTime: moment(data.Siri.ServiceDelivery.ResponseTimestamp).toISOString()
    };
}

export {
    id,
    name,
    fetch
};
