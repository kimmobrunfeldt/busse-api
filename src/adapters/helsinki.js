import _ from 'lodash';
import moment from 'moment';
import ajax from '../ajax';

const id = 'helsinki';
const name = 'Helsinki';
const latitude = 60.200763;
const longitude = 24.936219;
const apiUrl = 'http://dev.hsl.fi/siriaccess/vm/json';

function fetch() {
    return ajax(apiUrl).then(_transform);
}

function _transform(data) {
    const vehicles = data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity;
    return _.map(vehicles, _transformVehicle.bind(this, data));
}

function _transformVehicle(data, vehicle) {
    var journey = vehicle.MonitoredVehicleJourney;

    // XXX: The vehicle type information is already in the lines json
    var routeInfo = _interpretJore(journey.LineRef.value);
    var lineName = routeInfo[2];
    if (_.startsWith(lineName, 'GMN:')) {
        // Helsinki data contains some Manchester vehicles also,
        // they are prefixed with a special name.
        // Try to make the line name sensible
        const parts = lineName.split('GMN:');
        if (parts.length > 1) {
            lineName = parts[1].replace(/:/g, '').trim();
        }
    }

    var vehicleType = routeInfo[0].toLowerCase();

    return {
        id: journey.VehicleRef.value,
        type: vehicleType || 'bus',
        line: lineName,
        latitude: journey.VehicleLocation.Latitude,
        longitude: journey.VehicleLocation.Longitude,
        rotation: journey.Bearing || 0,
        responseTime: moment(data.Siri.ServiceDelivery.ResponseTimestamp).toISOString()
    };
}

/*eslint-disable */
// jscs:disable
// From http://dev.hsl.fi/:
// (Values of lineRef are "JORE codes" and can be converted to passenger-friendly line numbers using the interpret_jore example code.)
// (lineRef query parameter can be added to limit the response to that single "JORE code".)
// This function was automatically converted from coffeescript to js, from
// https://github.com/HSLdevcom/navigator-proto/blob/master/src/routing.coffee
function _interpretJore(routeId) {
    var mode, ref, ref1, ref2, ref3, ref4, ref5, ref6, route, routeType;

    if (routeId != null ? routeId.match(/^1019/) : void 0) {
        ref1 = ["FERRY", 4, "Ferry"], mode = ref1[0], routeType = ref1[1], route = ref1[2];
    } else if (routeId != null ? routeId.match(/^1300/) : void 0) {
        ref2 = ["SUBWAY", 1, routeId.substring(4, 5)], mode = ref2[0], routeType = ref2[1], route = ref2[2];
    } else if (routeId != null ? routeId.match(/^300/) : void 0) {
        ref3 = ["TRAIN", 2, routeId.substring(4, 5)], mode = ref3[0], routeType = ref3[1], route = ref3[2];
    } else if (routeId != null ? routeId.match(/^10(0|10)/) : void 0) {
        ref4 = ["TRAM", 0, routeId.replace(/^.0*/, "")], mode = ref4[0], routeType = ref4[1], route = ref4[2];
    } else if (routeId != null ? routeId.match(/^(1|2|4).../) : void 0) {
        ref5 = ["BUS", 3, routeId.replace(/^.0*/, "")], mode = ref5[0], routeType = ref5[1], route = ref5[2];
    } else {
        ref6 = ["BUS", 3, routeId], mode = ref6[0], routeType = ref6[1], route = ref6[2];
    }
    return [mode, routeType, route];
}
// jscs:enable
/*eslint-enable */

export default {
    id,
    name,
    latitude,
    longitude,
    fetch
};
