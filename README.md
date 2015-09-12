# Busse API

Gathers real time data from external APIs and serves the data in standard format
for Busse application. The external APIs use SIRI standard.

This API fetches newest data from original APIs in 1000ms interval.

**Goals:**

* Reliable
* Fast on bad network
* Works offline
* Indicates the freshness of data


**Shortcuts:**

* [Developer documentation](docs/readme.md)
* [API endpoints](#api-endpoints)

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
    * `bounds` Array of latitude and longitude coorinates to form a polygon, which limits the area where to return vehicles. This is an array of points. Format for single coordinate: `<lat>:<lng>`. Example request: `?bounds=61.4976153:23.7662998&bounds=62.4976153:23.7662998&bounds=61.4976153:23.7662998&bounds=60.4976153:21.7662998`.

        This can be used to reduce amount of data transferred on each request.
        Minimum of 3 points must be given.
        Most common use case is to give boundaries of view port of the map.

* `GET /areas` List possible areas

* `GET /messages` List all Busse messages


## Response objects

### Vehicle

Field     | Type | Description
--------- | ---- | -----------
**id**               | *String*  |  Vehicle identifier. Example: `TKL_34`
**type**             | *String*  |  Type of the vehicle. Valid values: `bus`, `train`, `ferry`, `tram`, `subway`. Example: `bus`
**area**             | *String*  |  Vehicle area. Example: `helsinki`
**line**             | *String*  |  Vehicle line id. Example: `90M`
**latitude**         | *Number*  |  Latitude coordinate. Example: `61.5192917`
**longitude**        | *Number*  |  Longitude coordinate. Example: `23.6257467`
**rotation**         | *Number*  |  Rotation of a vehicle. *0* to *360*. *0* means the vehicle is stopped. East would be *90*. Example: `12`.
**resopnseTime**     | *Date*    |  Indicates when the external API responded the vehicle. Example: `2015-09-03T22:09:28.883Z`.

Example object:

```json
{
    "id": "PAUNU_165",
    "type": "bus",
    "line": "1A",
    "latitude": 61.471807,
    "longitude": 23.756158,
    "rotation": 41,
    "responseTime": "2015-09-03T22:13:17.274Z",
    "area": "tampere"
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
  "lines": [{"id": "1A", "type": "bus"}],
  "latitude": 61.4976153,
  "longitude": 23.7662998
}
```

### Line

Field     | Type | Description
--------- | ---- | -----------
**id**               | *String*  |  Line identifier. Example: `90M`
**type**             | *String*  |  Vehicle type which drives the line. Valid values: `tram`, `subway`, `rail`, `bus`, `ferry`, `cablecar`, `gondola`, `funicular`.


Example object:

```json
{
  "id": "1A",
  "type": "bus"
}
```

### Message

Field         | Type      | Description
------------- | --------- | -----------
**id**        | *String*  | Message identifier. Example: `1`
**expires**   | *Date*    | Date when the message expires. If null, the message never expires
**html**      | *String*  | HTML for the message.


Example object:

```json
{
  "id": "1",
  "expires": "2015-09-06T11:48:36.035Z",
  "html": "Busse is temporarily using HERE maps. <a href='https://twitter.com/bussefi'>Read more: twitter.com/bussefi<a>"
}
```


## Error handling

When HTTP status code is 400 or higher, response is in format:

```json
{
  "error": "Internal Server Error"
}
```

When HTTP status code is below 400, there might be still errors with different
adapters. These errors are defined in the following format:

```json
{

  "errors": [
      {"adapter": "tampere", "error": "Empty response from original server"},
      {"adapter": "helsinki", "error": "Some error"}
  ]
}
```
