function createInterval(callback, opts) {
    let _timer;

    function start() {
        callback().finally(_scheduleCall);
    }

    function stop() {
        if (_timer) {
            clearTimeout(_timer);
        }

        _timer = null;
    }

    function _scheduleCall() {
        _timer = setTimeout(start, opts.interval);
    };

    // Stop timers when process will be shut down
    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);

    return {
        start,
        stop
    };
}

export default createInterval;
