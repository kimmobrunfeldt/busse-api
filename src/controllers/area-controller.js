import * as areaService from '../services/area-service';
import {createJsonRoute} from '../utils';

let getAreas = createJsonRoute(function(req, res) {
    return areaService.getAreas();
});

export {
    getAreas
};
