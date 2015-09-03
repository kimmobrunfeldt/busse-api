import Promise from 'bluebird';

function getAreas() {
    return Promise.resolve({areas: true});
}

export {
    getAreas
};
