import _ from 'lodash';
import Promise from 'bluebird';
import geolib from 'geolib';
import createInterval from '../interval';
import adapters from '../adapters/index';
import createLogger from '../logger';
const logger = createLogger(__filename);

const SLOW_FETCH_TIME = 5000;

// Module's global data
let global = {
    // Format:
    // { areaName: [vehicles ... ] }
    vehicleData: {},

    // { areaName: [Error Object] }
    errors: {}
};

function _fetchVehiclesWithInterval() {
    _.map(adapters, adapter => {
        const interval = createInterval(() => {
            let fetchStartTime = (new Date()).getTime();

            logger.debug('Fetching data from adapter', adapter.id, '..');
            return adapter.fetch().then((vehicles) => {
                logger.debug('Received', vehicles.length, 'vehicles from adapter', adapter.id);

                const timeNow = (new Date()).getTime();
                if (timeNow - fetchStartTime > SLOW_FETCH_TIME) {
                    logger.warn('Adapter', adapter.id, 'fetching takes too long:');
                    logger.warn('Request finished in', timeNow - fetchStartTime, 'ms');
                }

                if (_.isEmpty(vehicles)) {
                    logger.warn('Adapter', adapter.id, 'provided empty response:');
                    logger.warn(vehicles);
                    throw new Error('Empty response from remote server.');
                }

                const vehicleIds = _.pluck(vehicles, 'id');
                const uniqVehicleIds = _.uniq(vehicleIds);
                if (vehicleIds.length !== uniqVehicleIds.length) {
                    logger.warn('Adapter', adapter.id, 'provides multiple vehicles with same id:');

                    const groupedById = _.groupBy(vehicles, 'id');
                    _.each(groupedById, function(val, id) {
                        if (val.length > 1) {
                            logger.warn('Found', val.length, 'vehicles with same id:');
                            logger.warn(JSON.stringify(val));
                        }
                    });

                    throw new Error('Non-unique vehicles returned from remote server.');
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

    if (params.cluster) {
        vehicles = _getClusters(global.vehicleData);
    } else {
        vehicles = _getAllVehicles(global.vehicleData, params);
    }

    return Promise.resolve({
        vehicles: vehicles,
        errors: global.errors
    });
}

function _getClusters(vehicleData) {
    return _.reduce(vehicleData, function(all, areaVehicles, key) {
        const cluster = {
            id: key + '-cluster',
            type: 'cluster',
            area: key,
            vehicleCount: areaVehicles.length,
            latitude: adapters[key].latitude,
            longitude: adapters[key].longitude
        };

        return all.concat([cluster]);
    }, []);
}

function _getAllVehicles(vehicleData, params) {
    let vehicles = _.reduce(vehicleData, function(all, areaVehicles, key) {
        return all.concat(areaVehicles);
    }, []);

    vehicles = _filterVehiclesWithAreas(vehicles, params.areas);
    vehicles = _filterVehiclesWithLines(vehicles, params.lines);
    vehicles = _filterVehiclesWithBounds(vehicles, params.bounds);

    // Sometimes data contains null locations, filter them out
    // null location means: lat:0 lng:0
    vehicles = _filterNullLocationVehicles(vehicles);

    return vehicles;
}

function _filterVehiclesWithAreas(vehicles, areas) {
    if (_.isArray(areas)) {
        return _.filter(vehicles, function(vehicle) {
            return _.contains(areas, vehicle.area);
        });
    }

    return vehicles;
}

function _filterVehiclesWithLines(vehicles, lines) {
    if (_.isArray(lines) && lines.length > 0) {
        return _.filter(vehicles, function(vehicle) {
            const isVehicleWanted = _.any(lines, function(line) {
                return vehicle.line === line.id &&
                       vehicle.area === line.area;
            });

            return isVehicleWanted;
        });
    }

    return vehicles;
}

function _filterVehiclesWithBounds(vehicles, bounds) {
    if (_.isArray(bounds)) {
        return _.filter(vehicles, function(vehicle) {
            return geolib.isPointInside({
                latitude: vehicle.latitude,
                longitude: vehicle.longitude
            }, bounds);
        });
    }

    return vehicles;
}

function _filterNullLocationVehicles(vehicles) {
    return _.filter(vehicles, vehicle => {
        return vehicle.latitude !== 0 && vehicle.longitude !== 0;
    });
}

export {
    getVehicles
};
