#!/usr/bin/env node

// Parses https://developers.google.com/transit/gtfs/ data to more convenient
// format to be used in code.
// The output is JSON which contains list of all routes.

// Usage when adding new city:
//   node ./tools/parse-gtfs.js path/to/gtfs/routes > data/city.json

var Promise = require('bluebird');
var fs = require('fs');
var _ = require('lodash');
var csv = Promise.promisifyAll(require('csv'));

// Taken from https://developers.google.com/transit/gtfs/reference#routes_fields
var GTFS_ROUTE_TYPES = [
    'tram',
    'subway',
    'rail',
    'bus',
    'ferry',
    'cablecar',
    'gondola',
    'funicular'
];

var USAGE = 'Usage: node parse-gtfs.js <path-to-gtfs-routes-txt>';

function routesToRouteIds(routes, indexes) {
    var uniqTrips = _.uniq(routes, function(trip) {
        return trip[indexes.id];
    });

    return _.map(uniqTrips, function(row) {
        return defaultTransform(row, indexes);
    });
}

function defaultTransform(row, indexes) {
    return {
        id: row[indexes.id].replace(/ /g, ''),
        type: GTFS_ROUTE_TYPES[Number(row[indexes.type])]
    }
}

function main() {
    var routesFilePath = process.argv[2];

    if (process.argv.length !== 3 || !routesFilePath) {
        console.log(USAGE);
        process.exit(2);
    }

    // Format of routes.txt
    // route_id,agency_id,route_short_name,route_long_name,route_desc,route_type,route_url
    var routesText = fs.readFileSync(routesFilePath, 'utf8');

    csv.parseAsync(routesText, {comment: '#', delimiter: ','})
    .then(function(routesData) {
        // Different gtfs datas might have different columns
        // For example agency_id is optional
        var headers = _.head(routesData);
        var indexes = {
            id: headers.indexOf('route_short_name'),
            type: headers.indexOf('route_type')
        };

        var routes = _.tail(routesData)
        var routeIds = routesToRouteIds(routes, indexes);

        // Sort first by string comparasion, then numerical
        // This sorts correctly: 91, 92A, 92B
        routeIds.sort();
        routeIds.sort(function(a, b) {
            return parseInt(a, 10) - parseInt(b, 10);
        });

        console.log(JSON.stringify({lines: routeIds}));
    });
}

main();
