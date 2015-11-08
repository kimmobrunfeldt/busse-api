import ajax from '../ajax';
import transforms from '../transforms';

const id = 'toronto';
const name = 'Toronto';
const latitude = 43.651543;
const longitude = -79.383265;
const apiUrl = 'https://publicdata-transit.firebaseio.com/ttc/vehicles.json';

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
