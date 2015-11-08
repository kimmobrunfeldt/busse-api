import ajax from '../ajax';
import transforms from '../transforms';

const id = 'sanfrancisco-muni';
const name = 'San Francisco Muni';
const latitude = 37.771902;
const longitude = -122.424147;
const apiUrl = 'https://publicdata-transit.firebaseio.com/sf-muni/vehicles.json';

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
