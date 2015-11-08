import ajax from '../ajax';
import transforms from '../transforms';

const id = 'chicago';
const name = 'Chicago';
const latitude = 41.8686835;
const longitude = -87.6985181;
const apiUrl = 'https://publicdata-transit.firebaseio.com/ctabus/vehicles.json';

function fetch() {
    return ajax(apiUrl).then(transforms.transformFirebaseVehicles);
}

export default {
    id,
    name,
    latitude,
    longitude,
    fetch
};
