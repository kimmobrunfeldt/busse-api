# Busse API

Gathers real time data from external APIs and serves the data in standard format
for Busse application. The external APIs use SIRI standard.

This API fetches newest data from original APIs in 1000ms interval.

**Goals:**

* Reliable
* Fast on bad network
* Works offline
* Indicates the freshness of data

## Tech

* Node.js express app
* Written in ES6
* Mocha for testing
* Winston for logging

## API Endpoints

* `GET /vehicles` List real time locations of vehicles

    **Parameters**

    *All parameters are optional*

    * `area` One or multiple areas. Valid values: `helsinki`, `tampere`, `oulu`,
    * `line` One or multiple vehicle lines. Format: `<area>:<line>`, e.g. `helsinki:1`
    * `topLeft` Top left latitude and longitude coordinate where to return vehicles. Format: `<lat>:<lng>`. Example: `61.4976153:23.7662998`.

        This can be used to reduce amount of data transferred on each request.

    * `bottomRight` Bottom left latitude and longitude coordinate where to return vehicles.

* `GET /areas` List possible areas

    **Parameters**
    * `area` One or multiple areas. Valid values: `helsinki`, `tampere`, `oulu`,


## Response objects

### Vehicle

Field     | Type | Description
--------- | ---- | -----------
**id**               | *String*  |  Vehicle identifier. Example: `TKL_34`
**line**             | *String*  |  Vehicle line id. Example: `90M`
**latitude**         | *Number*  |  Latitude coordinate. Example: `61.5192917`
**longitude**        | *Number*  |  Longitude coordinate. Example: `23.6257467`
**rotation**         | *Number*  |  Rotation of a vehicle. *0* to *360*. *0* means the vehicle is stopped. East would be *90*. Example: `12`.

Example object:

```json
{
  "id": "Paunu_149",
  "line": "1A",
  "latitude": 61.4976153,
  "longitude": 23.7662998,
  "rotation": 0
}
```

### Area

Field     | Type | Description
--------- | ---- | -----------
**id**               | *String*  |  Area identifier. Example: `helsinki`
**name**             | *String*  |  Name of the area. Example: `Helsinki`
**lines**            | *Array*   |  Array of line objects.
**latitude**         | *Number*  |  Latitude coordinate for area center. Example: `61.5192917`
**longitude**        | *Number*  |  Longitude coordinate for area center. Example: `23.6257467`

Example object:

```json
{
  "id": "helsinki",
  "name": "Helsinki",
  "lines": [{"id": "1A", "type": "bus", "operator": "HKL"}],
  "latitude": 61.4976153,
  "longitude": 23.7662998
}
```

### Line

Field     | Type | Description
--------- | ---- | -----------
**id**               | *String*  |  Line identifier. Example: `90M`
**area**             | *String*  |  Area of the line. Example: `helsinki`
**type**             | *String*  |  Vehicle type which drives the line. Valid values: `bus`, `train`, `ferry`, `tram`, `subway`.
**operator**         | *String*  |  Line operator id. Example: `TKL`.

Example object:

```json
{
  "id": "1A",
  "type": "bus",
  "operator": "TKL"
}
```

## Error handling

When HTTP status code is 400 or higher, response is in format:

```json
{
  "error": "Internal Server Error"
}
```
