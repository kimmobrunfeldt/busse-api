import Promise from 'bluebird';
import request from 'request';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import gtfsTransform from '../gtfs-realtime-transform';

const id = 'massachusetts';
const name = 'Massachusetts';
const latitude = 42.319177;
const longitude = -71.045259;
const apiUrl = 'http://developer.mbta.com/lib/GTRTFS/Alerts/VehiclePositions.pb';

function fetch() {
    return new Promise((resolve, reject) => {
        var requestSettings = {
            method: 'GET',
            url: apiUrl,
            encoding: null
        };

        request(requestSettings, (err, response, body) => {
            if (err) {
                reject(err);
            }

            var feed = GtfsRealtimeBindings.FeedMessage.decode(body);
            var vehicles = gtfsTransform.transformGtfsFeed(feed);
            console.log(vehicles)
            resolve(vehicles);
        });
    });
}

export {
    id,
    name,
    latitude,
    longitude,
    fetch
};
