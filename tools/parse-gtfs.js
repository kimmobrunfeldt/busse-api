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

function routesToRouteIds(routes) {
    var uniqTrips = _.uniq(routes, function(trip) {
        return trip[0];
    });

    return _.map(uniqTrips, defaultTransform);
}

function defaultTransform(row) {
    return {
        id: row[2].replace(/ /g, ''),
        operator: row[1],
        type: GTFS_ROUTE_TYPES[Number(row[5])]
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
        var routes = _.tail(routesData)
        var routeIds = routesToRouteIds(routes);

        // Sort first by string comparasion, then numerical
        // This sorts correctly: 91, 92A, 92B
        routeIds.sort();
        routeIds.sort(function(a, b) {
            return parseInt(a, 10) - parseInt(b, 10);
        });

        console.log(JSON.stringify({routes: routeIds}));
    });
}

main();
