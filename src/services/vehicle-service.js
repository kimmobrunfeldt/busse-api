import Promise from 'bluebird';
import * as tampere from '../adapters/tampere';
import createInterval from '../interval';
import createLogger from '../logger';
const logger = createLogger(__filename);

const adapters = [tampere];

// Module's global data
let vehicleData = {};

function getVehicles() {
    return Promise.resolve(vehicleData);
}

function _fetchVehiclesWithInterval() {
    adapters.map((adapter) => {
        const interval = createInterval(() => {
            logger.info('Fetching data for adapter: ' + adapter.id);

            return adapter.fetch().then((data) => {
                vehicleData[adapter.id] = data;
                logger.info('Data received for adapter: ' + adapter.id);
                return data;
            });
        }, {interval: process.env.LOOP_INTERVAL})

        interval.start();
    });
}

_fetchVehiclesWithInterval();

export {
    getVehicles
};
