import ajax from '../ajax';
import transforms from '../transforms';

const id = 'alameda';
const name = 'Alameda';
const latitude = 37.763877;
const longitude = -122.242768;
const apiUrl = 'https://publicdata-transit.firebaseio.com/actransit/vehicles.json';

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
