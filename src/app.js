import './init-env-variables';
import http from 'http';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import createRouter from './router';
import createLogger from './logger';
const logger = createLogger(__filename);

function startApp() {
    const app = express();

    // Heroku's load balancer can be trusted
    app.enable('trust proxy');
    app.disable('x-powered-by');

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Dev and test
    if (process.env.NODE_ENV !== 'production') {
        // Pretty print JSON responses
        app.set('json spaces', 2);

        // Disable caching for easier testing
        app.use(function noCache(req, res, next) {
            res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.header('Pragma', 'no-cache');
            res.header('Expires', 0);
            next();
        });
    }

    app.use(function defaultContentType(req, res, next) {
        const defaultType = 'application/json';
        req.headers['content-type'] = req.headers['content-type'] || defaultType;
        next();
    });

    app.use(cors());
    app.use(compression({
        // Compress everything over 10 bytes
        threshold: 10
    }));

    // Initialize routes
    const router = createRouter();
    app.use('/api', router);

    app.use(function errorLogger(err, req, res, next) {
        const status = err.status ? err.status : 500;

        if (status >= 400) {
            logger.error('Request headers:');
            logger.error(JSON.stringify(req.headers));
            logger.error('Request parameters:');
            logger.error(JSON.stringify(req.params));
        }

        if (process.env.NODE_ENV === 'test' && status >= 500 ||
            process.env.NODE_ENV === 'development'
        ) {
            console.log(err.stack);
        }

        next(err);
    });

    app.use(function errorResponder(err, req, res, next) {
        const status = err.status ? err.status : 500;
        const httpMessage = http.STATUS_CODES[status];

        let message;
        if (status < 500) {
            message = httpMessage + ': ' + err.message;
        } else {
            message = httpMessage;
        }

        let response = {message: message};
        if (err.data) {
            response.errors = err.data;
        }

        res.status(status);
        res.send(response);
    });

    let server = app.listen(process.env.PORT, () => {
        logger.info(
            'Express server listening on port %d in %s mode',
            process.env.PORT,
            app.get('env')
        );
    });

    function _closeServer(signal) {
        logger.info(signal + ' received');
        logger.info('Closing http.Server ..');
        server.close();
    }

    // Handle signals gracefully. Heroku will send SIGTERM before idle.
    process.on('SIGTERM', _closeServer.bind(this, 'SIGTERM'));
    process.on('SIGINT', _closeServer.bind(this, 'SIGINT(Ctrl-C)'));

    server.on('close', () => {
        logger.info('Server closed');
        process.emit('cleanup');
    });

    return {
        app: app,
        server: server,
    };
}

export default startApp;
