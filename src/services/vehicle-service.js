import _ from 'lodash';
import Promise from 'bluebird';
import geolib from 'geolib';
import createInterval from '../interval';
import adapters from '../adapters/index';
import createLogger from '../logger';
const logger = createLogger(__filename);

// Module's global data
let global = {
    // Format:
    // { areaName: [vehicles ... ] }
    vehicleData: {},

    // { areaName: [Error Object] }
    errors: {}
};

function _fetchVehiclesWithInterval() {
    adapters.map((adapter) => {
        const interval = createInterval(() => {
            // TODO: implement logic to detect slow fetches
            return adapter.fetch().then((vehicles) => {
                if (_.isEmpty(vehicles)) {
                    logger.warn('Adapter', adapter.id, 'provided empty response:');
                    logger.warn(vehicles);
                    throw new Error('Empty response from remote server.');
                }

                // Add area id to each vehicle for convenience
                _.each(vehicles, function(vehicle) {
                    vehicle.area = adapter.id;
                });

                global.vehicleData[adapter.id] = vehicles;

                // Clear global.errors
                if (_.has(global.errors, adapter.id)) {
                    delete global.errors[adapter.id];
                }

                return vehicles;
            })
            .catch((err) => {
                logger.error('Error when fetching from ' + adapter.id);
                logger.error(err);
                global.errors[adapter.id] = err.message;
            });
        }, {
            interval: process.env.LOOP_INTERVAL,
            name: adapter.id
        })

        interval.start();
    });
}

// Start fetching immediately
_fetchVehiclesWithInterval();

function getVehicles(params) {
    let vehicles;

    if (_.isArray(params.areas)) {
        vehicles = _.reduce(params.areas, function(all, area) {
            if (_.has(global.vehicleData, area)) {
                return all.concat(global.vehicleData[area]);
            }
            return all;
        }, []);
    } else {
        vehicles = _.reduce(global.vehicleData, function(all, areaVehicles, key) {
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

    return Promise.resolve({
        vehicles: vehicles,
        errors: global.errors
    });
}

export {
    getVehicles
};
