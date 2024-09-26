# SunCalc Rest API

Express.js/TypeScript Rest API integrating with [suncalc](https://github.com/mourner/suncalc) for accessing the ☀️'s data based on location and time.

## Build Setup

```bash
# install dependencies
$ pnpm run install

# run server
$ pnpm run dev

# build module
$ pnpm run build

```

# REST API Documentation

The SunCalc REST API is described below.

## Get Position

### Request

`GET /api/position/:date/:latitude,:longitude`

```curl
curl --request GET \
  --url 'http://localhost:8081/api/position/2023-11-13/34.0549,-118.2426'
```

### Response

```json
{
  "azimuth": -1.198657687136746,
  "altitude": -0.010485801748684758
}
```

## Get Current Position

### Request

`GET /api/position/now/:latitude,:longitude`

```curl
curl --request GET \
  --url 'http://localhost:8081/api/position/now/34.0549,-118.2426'
```

### Response

```json
{
  "azimuth": -1.198657687136746,
  "altitude": -0.010485801748684758
}
```

## Get Times

### Request

`GET /api/times/2023-11-13/:latitude,:longitude`

```curl
curl --request GET \
  --url 'http://localhost:8081/api/times/2023-11-13/34.0549,-118.2426'
```

### Response

```json
{
  "solarNoon": "2023-11-13T19:38:37.667Z",
  "nadir": "2023-11-13T07:38:37.667Z",
  "sunrise": "2023-11-13T14:24:53.049Z",
  "sunset": "2023-11-14T00:52:22.285Z",
  "sunriseEnd": "2023-11-13T14:27:38.907Z",
  "sunsetStart": "2023-11-14T00:49:36.427Z",
  "dawn": "2023-11-13T13:58:25.730Z",
  "dusk": "2023-11-14T01:18:49.604Z",
  "nauticalDawn": "2023-11-13T13:28:20.400Z",
  "nauticalDusk": "2023-11-14T01:48:54.935Z",
  "nightEnd": "2023-11-13T12:58:44.641Z",
  "night": "2023-11-14T02:18:30.693Z",
  "goldenHourEnd": "2023-11-13T15:00:57.040Z",
  "goldenHour": "2023-11-14T00:16:18.294Z"
}
```

## Get Current Times

### Request

`GET /api/times/now/:latitude,:longitude`

```curl
curl --request GET \
  --url 'http://localhost:8081/api/times/now/34.0549,-118.2426'
```

### Response

```json
{
  "solarNoon": "2023-11-13T19:38:37.667Z",
  "nadir": "2023-11-13T07:38:37.667Z",
  "sunrise": "2023-11-13T14:24:53.049Z",
  "sunset": "2023-11-14T00:52:22.285Z",
  "sunriseEnd": "2023-11-13T14:27:38.907Z",
  "sunsetStart": "2023-11-14T00:49:36.427Z",
  "dawn": "2023-11-13T13:58:25.730Z",
  "dusk": "2023-11-14T01:18:49.604Z",
  "nauticalDawn": "2023-11-13T13:28:20.400Z",
  "nauticalDusk": "2023-11-14T01:48:54.935Z",
  "nightEnd": "2023-11-13T12:58:44.641Z",
  "night": "2023-11-14T02:18:30.693Z",
  "goldenHourEnd": "2023-11-13T15:00:57.040Z",
  "goldenHour": "2023-11-14T00:16:18.294Z"
}
```

## Get Time By Type

```javascript
type TimeTypes =
  'solarNoon'|
  'nadir'|
  'sunrise'|
  'sunset'|
  'sunriseEnd'|
  'sunsetStart'|
  'dawn'|
  'dusk'|
  'nauticalDawn'|
  'nauticalDusk'|
  'nightEnd'|
  'night'|
  'goldenHourEnd'|
  'goldenHour'

```

### Request

`GET /api/times/2023-11-13/:latitude,:longitude?type=:timeType`

```curl
curl --request GET \
  --url 'http://localhost:8081/api/times/2023-11-13/34.0549,-118.2426?type=sunrise'
```

### Response

```json
{
  "sunrise": "2023-11-13T14:24:53.049Z"
}
```
