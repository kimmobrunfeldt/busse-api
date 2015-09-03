import express from 'express';
import * as vehicleController from './controllers/vehicle-controller';
import * as areaController from './controllers/area-controller';

function createRouter() {
    const router = express.Router();

    router.get('/vehicles', vehicleController.getVehicles);
    router.get('/areas', areaController.getAreas);

    return router;
}

export default createRouter;
