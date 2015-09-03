import path from 'path';
import winston from 'winston';
import _ from 'lodash';

const COLORIZE = process.env.NODE_ENV === 'development';

function createLogger(filePath) {
    var fileName = path.basename(filePath);

    const logger = new winston.Logger({
        transports: [new winston.transports.Console({
            colorize: COLORIZE,
            label: fileName,
            timestamp: true
        })]
    });

    if (process.env.NODE_ENV === 'test') {
        _setLevelForTransports(logger, 'warning');
    } else if (process.env.NODE_ENV === 'production') {
        _setLevelForTransports(logger, 'info');
    } else {
        _setLevelForTransports(logger, 'silly');
    }

    return logger;
}

function _setLevelForTransports(logger, level) {
    _.each(logger.transports, function(transport) {
        transport.level = level;
    });
}

export default createLogger;
