import _ from 'lodash';
import Promise from 'bluebird';
import geolib from 'geolib';
import * as tampere from '../adapters/tampere';
import * as helsinki from '../adapters/helsinki';
import createInterval from '../interval';

// Active adapters which are fetched from
const adapters = [tampere, helsinki];

// Module's global data
// Format:
// { areaName: [vehicles ... ] }
let vehicleData = {};

function _fetchVehiclesWithInterval() {
    adapters.map((adapter) => {
        const interval = createInterval(() => {
            return adapter.fetch().then((vehicles) => {
                // Add area id to each vehicle for convenience
                _.each(vehicles, function(vehicle) {
                    vehicle.area = adapter.id;
                });

                vehicleData[adapter.id] = vehicles;
                return vehicles;
            });
        }, {interval: process.env.LOOP_INTERVAL})

        interval.start();
    });
}

// Start fetching immediately
_fetchVehiclesWithInterval();

function getVehicles(params) {
    let vehicles;

    if (_.isArray(params.areas)) {
        vehicles = _.reduce(params.areas, function(all, area) {
            if (_.has(vehicleData, area)) {
                return all.concat(vehicleData[area]);
            }
            return all;
        }, []);
    } else {
        vehicles = _.reduce(vehicleData, function(all, areaVehicles, key) {
            return all.concat(areaVehicles);
        }, []);
    }

    if (_.isArray(params.lines) && params.lines.length > 0) {
        vehicles = _.filter(vehicles, function(vehicle) {
            const isVehicleWanted = _.any(params.lines, function(line) {
                return vehicle.line === line.id &&
                       vehicle.area === line.area;
            });

            return isVehicleWanted;
        });
    }

    if (_.isArray(params.bounds)) {
        vehicles = _.filter(vehicles, function(vehicle) {
            return geolib.isPointInside({
                latitude: vehicle.latitude,
                longitude: vehicle.longitude
            }, params.bounds);
        })
    }

    return Promise.resolve(vehicles);
}

export {
    getVehicles
};
