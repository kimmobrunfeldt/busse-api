import _ from 'lodash';
import Promise from 'bluebird';
import geolib from 'geolib';
import * as tampere from '../adapters/tampere';
import createInterval from '../interval';
import createLogger from '../logger';
const logger = createLogger(__filename);

// Active adapters which are fetched from
const adapters = [tampere];

// Module's global data
// Format:
// { areaName: [vehicles ... ] }
let vehicleData = {};

function _fetchVehiclesWithInterval() {
    adapters.map((adapter) => {
        const interval = createInterval(() => {
            logger.info('Fetching data for adapter: ' + adapter.id);

            return adapter.fetch().then((vehicles) => {
                // Add area id to each vehicle for convenience
                _.each(vehicles, function(vehicle) {
                    vehicle.area = adapter.id;
                });

                vehicleData[adapter.id] = vehicles;
                logger.info('Data received for adapter: ' + adapter.id);
                return vehicles;
            });
        }, {interval: process.env.LOOP_INTERVAL})

        interval.start();

        process.on('SIGINT', interval.stop);
        process.on('SIGTERM', interval.stop);
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
