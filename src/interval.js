import createLogger from './logger';
var logger = createLogger(__filename);

function createInterval(callback, opts) {
    var _timer;
    var name = opts.name || 'unknown';

    function start() {
        callback().finally(_scheduleCall);
    }

    function stop() {
        logger.info('Stop timer', name, '..');
        if (_timer) {
            clearTimeout(_timer);
        }

        _timer = null;
    }

    function _scheduleCall() {
        if (_timer === null) {
            // Do not schedule call if interval has been stopped
            return;
        }

        _timer = setTimeout(start, opts.interval);
    };

    // Stop timers when process will be shut down
    process.on('cleanup', stop);

    return {
        start,
        stop
    };
}

export default createInterval;
