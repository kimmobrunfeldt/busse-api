import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import Promise from 'bluebird';
import adapters from '../adapters/index';

const areas = _.map(adapters, function(adapter) {
    let area = {
        id: adapter.id,
        name: adapter.name,
        latitude: adapter.latitude,
        longitude: adapter.longitude
    };

    const filePath = path.join(__dirname, '../adapters/' + adapter.id + '.json');
    area.lines = JSON.parse(fs.readFileSync(filePath, 'utf8')).lines;

    return area;
});

function getAreas() {
    return Promise.resolve(areas);
}

export {
    getAreas
};
