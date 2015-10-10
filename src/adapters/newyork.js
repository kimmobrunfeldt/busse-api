// Adapter for New York

import _ from 'lodash';
import moment from 'moment';
import ajax from '../ajax';
import jsonData from './newyork.json';

const id = 'newyork';
const name = 'New York';
const latitude = 40.696727;
const longitude = -74.003061;
const apiUrl = 'http://api.prod.obanyc.com/api/siri/vehicle-monitoring.json' +
               '?key=' + process.env.MTA_API_KEY;

function fetch() {
    return ajax(apiUrl).then(_transform);
}

function _transform(data) {
    const vehicles = data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity;
    return _.map(vehicles, _transformVehicle.bind(this, data));
}

function _transformVehicle(data, vehicle) {
    const journey = vehicle.MonitoredVehicleJourney;
    const lineId = journey.PublishedLineName;
    const matchingLine = _.find(jsonData.lines, line => {
        return line.id === lineId;
    });

    const type = matchingLine ? matchingLine.type : 'bus';

    return {
        id: journey.VehicleRef,
        type: type,
        line: lineId,
        latitude: journey.VehicleLocation.Latitude,
        longitude: journey.VehicleLocation.Longitude,
        rotation: journey.Bearing,
        responseTime: moment(data.Siri.ServiceDelivery.ResponseTimestamp).toISOString()
    };
}

export {
    id,
    name,
    latitude,
    longitude,
    fetch
};
