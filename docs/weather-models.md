# Weather Models

## Overview
The weather models define the TypeScript interfaces and data structures used throughout the application. They ensure type safety, provide clear data contracts, and document the expected structure of weather data from OpenStreetMap (geocoding) and Open-Meteo (weather data) APIs.

## File Location
```
src/app/models/weather.model.ts
```

## Core Interfaces

### `WeatherData`
The main interface representing weather information for display in components.

```typescript
export interface WeatherData {
  city: string;
  country: string;
  date: string;
  temperature: number;
  feelsLike: number;
  minTemp?: number;
  maxTemp?: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex?: number;
  sunrise?: string;
  sunset?: string;
}
```

#### Property Descriptions

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `city` | `string` | ✅ | City name (e.g., "London", "New York") |
| `country` | `string` | ✅ | Country name (e.g., "United Kingdom", "United States") |
| `date` | `string` | ✅ | ISO date string (e.g., "2024-01-15T14:30:00.000Z") |
| `temperature` | `number` | ✅ | Current temperature in Celsius |
| `feelsLike` | `number` | ✅ | Feels-like temperature in Celsius |
| `minTemp` | `number` | ❌ | Minimum temperature (forecast only) |
| `maxTemp` | `number` | ❌ | Maximum temperature (forecast only) |
| `condition` | `string` | ✅ | Weather condition (e.g., "Clear", "Rain", "Clouds") |
| `description` | `string` | ✅ | Detailed weather description |
| `humidity` | `number` | ✅ | Humidity percentage (0-100) |
| `windSpeed` | `number` | ✅ | Wind speed in km/h |
| `windDirection` | `number` | ✅ | Wind direction in degrees (0-360) |
| `pressure` | `number` | ✅ | Atmospheric pressure in hPa |
| `visibility` | `number` | ✅ | Visibility in kilometers |
| `uvIndex` | `number` | ❌ | UV index (0-11+) |
| `sunrise` | `string` | ❌ | Sunrise time (ISO string) |
| `sunset` | `string` | ❌ | Sunset time (ISO string) |

#### Usage Examples

```typescript
// Current weather data
const currentWeather: WeatherData = {
  city: "London",
  country: "United Kingdom",
  date: "2024-01-15T14:30:00.000Z",
  temperature: 15,
  feelsLike: 13,
  condition: "Clear",
  description: "Clear sky",
  humidity: 78,
  windSpeed: 12,
  windDirection: 230,
  pressure: 1013,
  visibility: 10,
  uvIndex: 3
};

// Forecast data (with min/max temps)
const forecastDay: WeatherData = {
  city: "London",
  country: "United Kingdom",
  date: "2024-01-16T12:00:00.000Z",
  temperature: 18,
  feelsLike: 16,
  minTemp: 12,
  maxTemp: 22,
  condition: "Partly Cloudy",
  description: "Partly cloudy",
  humidity: 0, // Not shown in forecast cards
  windSpeed: 0, // Not shown in forecast cards
  windDirection: 0, // Not shown in forecast cards
  pressure: 0, // Not shown in forecast cards
  visibility: 0, // Not shown in forecast cards
  uvIndex: 5
};
```

## API Response Interfaces

### `GeocodingResponse`
Represents the response from OpenStreetMap Nominatim API for geocoding.

```typescript
export interface GeocodingResponse {
  place_id: number;
  licence: string;
  powered_by: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: string[];
}
```

#### Property Descriptions

| Property | Type | Description |
|----------|------|-------------|
| `place_id` | `number` | Unique identifier for the place |
| `lat` | `string` | Latitude as string |
| `lon` | `string` | Longitude as string |
| `display_name` | `string` | Full formatted address |
| `address.city` | `string?` | City name (if available) |
| `address.town` | `string?` | Town name (if available) |
| `address.village` | `string?` | Village name (if available) |
| `address.country` | `string?` | Country name |
| `address.country_code` | `string?` | ISO country code |

#### Geocoding Response Example
```typescript
const geocodingResponse: GeocodingResponse = {
  place_id: 123456789,
  licence: "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
  powered_by: "Nominatim",
  osm_type: "relation",
  osm_id: 85,
  lat: "51.5074",
  lon: "-0.1278",
  display_name: "London, Greater London, England, United Kingdom",
  address: {
    city: "London",
    county: "Greater London",
    state: "England",
    country: "United Kingdom",
    country_code: "gb"
  },
  boundingbox: ["51.2868", "51.6919", "-0.5104", "0.3340"]
};
```

### `OpenMeteoCurrentResponse`
Represents the response from Open-Meteo's current weather API.

```typescript
export interface OpenMeteoCurrentResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation: string;
    rain: string;
    showers: string;
    snowfall: string;
    weather_code: string;
    cloud_cover: string;
    pressure_msl: string;
    surface_pressure: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    visibility: string;
    uv_index: string;
    is_day: string;
    sunshine_duration: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    visibility: number;
    uv_index: number;
    is_day: number;
    sunshine_duration: number;
  };
}
```

#### Property Descriptions

| Property | Type | Description |
|----------|------|-------------|
| `latitude` | `number` | Latitude coordinate |
| `longitude` | `number` | Longitude coordinate |
| `timezone` | `string` | Timezone identifier |
| `current.time` | `string` | Current time (ISO string) |
| `current.temperature_2m` | `number` | Temperature at 2m height (°C) |
| `current.relative_humidity_2m` | `number` | Relative humidity at 2m height (%) |
| `current.apparent_temperature` | `number` | Apparent temperature (°C) |
| `current.weather_code` | `number` | Weather condition code (0-99) |
| `current.pressure_msl` | `number` | Atmospheric pressure at mean sea level (hPa) |
| `current.wind_speed_10m` | `number` | Wind speed at 10m height (m/s) |
| `current.wind_direction_10m` | `number` | Wind direction at 10m height (degrees) |
| `current.visibility` | `number` | Visibility distance (m) |
| `current.uv_index` | `number` | UV index |

#### Open-Meteo Current Response Example
```typescript
const openMeteoResponse: OpenMeteoCurrentResponse = {
  latitude: 51.5074,
  longitude: -0.1278,
  generationtime_ms: 0.123,
  utc_offset_seconds: 0,
  timezone: "Europe/London",
  timezone_abbreviation: "GMT",
  elevation: 25,
  current_units: {
    time: "iso8601",
    temperature_2m: "°C",
    relative_humidity_2m: "%",
    apparent_temperature: "°C",
    weather_code: "wmo code",
    pressure_msl: "hPa",
    wind_speed_10m: "m/s",
    wind_direction_10m: "°",
    visibility: "m",
    uv_index: ""
  },
  current: {
    time: "2024-01-15T14:30",
    interval: 900,
    temperature_2m: 15.2,
    relative_humidity_2m: 78,
    apparent_temperature: 13.1,
    precipitation: 0,
    rain: 0,
    showers: 0,
    snowfall: 0,
    weather_code: 0,
    cloud_cover: 25,
    pressure_msl: 1013.2,
    surface_pressure: 1012.8,
    wind_speed_10m: 3.2,
    wind_direction_10m: 230,
    visibility: 10000,
    uv_index: 3,
    is_day: 1,
    sunshine_duration: 28800
  }
};
```

### `OpenMeteoForecastResponse`
Represents the response from Open-Meteo's 5-day forecast API.

```typescript
export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    apparent_temperature_max: string;
    apparent_temperature_min: string;
    precipitation_sum: string;
    rain_sum: string;
    showers_sum: string;
    snowfall_sum: string;
    precipitation_hours: string;
    precipitation_probability_max: string;
    wind_speed_10m_max: string;
    wind_gusts_10m_max: string;
    wind_direction_10m_dominant: string;
    shortwave_radiation_sum: string;
    uv_index_max: string;
    sunshine_duration: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    precipitation_sum: number[];
    rain_sum: number[];
    showers_sum: number[];
    snowfall_sum: number[];
    precipitation_hours: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
    shortwave_radiation_sum: number[];
    uv_index_max: number[];
    sunshine_duration: number[];
  };
}
```

#### Property Descriptions

| Property | Type | Description |
|----------|------|-------------|
| `daily.time` | `string[]` | Array of dates for each day |
| `daily.weather_code` | `number[]` | Weather condition codes for each day |
| `daily.temperature_2m_max` | `number[]` | Maximum temperatures for each day |
| `daily.temperature_2m_min` | `number[]` | Minimum temperatures for each day |
| `daily.apparent_temperature_max` | `number[]` | Maximum apparent temperatures |
| `daily.apparent_temperature_min` | `number[]` | Minimum apparent temperatures |
| `daily.uv_index_max` | `number[]` | Maximum UV indices for each day |

## Legacy Interfaces (Backward Compatibility)

### `WeatherApiResponse` & `ForecastApiResponse`
These interfaces are kept for backward compatibility but are no longer used in the current implementation.

## Data Transformation

### API to Application Mapping

#### Geocoding Transformation
```typescript
// GeocodingResponse → Coordinates
{
  lat: "51.5074" → lat: 51.5074,
  lon: "-0.1278" → lon: -0.1278,
  address.city: "London" → cityName: "London",
  address.country: "United Kingdom" → country: "United Kingdom"
}
```

#### Current Weather Transformation
```typescript
// OpenMeteoCurrentResponse → WeatherData
{
  current.temperature_2m: 15.2 → temperature: 15,
  current.apparent_temperature: 13.1 → feelsLike: 13,
  current.weather_code: 0 → condition: "Clear",
  current.weather_code: 0 → description: "Clear sky",
  current.relative_humidity_2m: 78 → humidity: 78,
  current.wind_speed_10m: 3.2 → windSpeed: 12, // m/s to km/h
  current.wind_direction_10m: 230 → windDirection: 230,
  current.pressure_msl: 1013.2 → pressure: 1013,
  current.visibility: 10000 → visibility: 10, // m to km
  current.uv_index: 3 → uvIndex: 3
}
```

#### Forecast Transformation
```typescript
// OpenMeteoForecastResponse → WeatherData[]
// Each day becomes a WeatherData object
{
  daily.time: ["2024-01-16", "2024-01-17", ...] → date: "2024-01-16",
  daily.temperature_2m_max: [22, 20, ...] → maxTemp: 22,
  daily.temperature_2m_min: [12, 10, ...] → minTemp: 12,
  // Average temperature: (max + min) / 2
  temperature: 17, // (22 + 12) / 2
  daily.weather_code: [1, 2, ...] → condition: "Mainly Clear",
  daily.uv_index_max: [5, 4, ...] → uvIndex: 5,
  // Simplified fields for forecast cards
  humidity: 0,
  windSpeed: 0,
  pressure: 0,
  visibility: 0
}
```

## Weather Code Mapping

### Open-Meteo Weather Codes (0-99)

| Code | Condition | Description |
|------|-----------|-------------|
| 0 | Clear | Clear sky |
| 1 | Mainly Clear | Mainly clear sky |
| 2 | Partly Cloudy | Partly cloudy |
| 3 | Overcast | Overcast |
| 45 | Fog | Foggy conditions |
| 48 | Depositing Rime Fog | Rime fog |
| 51 | Light Drizzle | Light drizzle |
| 53 | Moderate Drizzle | Moderate drizzle |
| 55 | Dense Drizzle | Dense drizzle |
| 61 | Slight Rain | Slight rain |
| 63 | Moderate Rain | Moderate rain |
| 65 | Heavy Rain | Heavy rain |
| 71 | Slight Snow Fall | Slight snow fall |
| 73 | Moderate Snow Fall | Moderate snow fall |
| 75 | Heavy Snow Fall | Heavy snow fall |
| 80 | Slight Rain Showers | Slight rain showers |
| 81 | Moderate Rain Showers | Moderate rain showers |
| 82 | Violent Rain Showers | Violent rain showers |
| 95 | Thunderstorm | Thunderstorm |
| 96 | Thunderstorm with Slight Hail | Thunderstorm with slight hail |
| 99 | Thunderstorm with Heavy Hail | Thunderstorm with heavy hail |

## Type Safety Benefits

### Compile-Time Validation
```typescript
// ✅ Valid usage
const weather: WeatherData = {
  city: "London",
  country: "United Kingdom",
  temperature: 15,
  feelsLike: 13,
  condition: "Clear",
  description: "Clear sky",
  humidity: 78,
  windSpeed: 12,
  windDirection: 230,
  pressure: 1013,
  visibility: 10
};

// ❌ TypeScript error - missing required property
const invalidWeather: WeatherData = {
  city: "London"
  // Missing required properties
};

// ❌ TypeScript error - wrong type
const wrongType: WeatherData = {
  city: "London",
  temperature: "15" // Should be number, not string
};
```

### IntelliSense Support
```typescript
// IDE provides autocomplete and type checking
weather.temperature // ✅ number
weather.city // ✅ string
weather.invalidProperty // ❌ TypeScript error
```

## Validation and Constraints

### Data Validation Rules
```typescript
// Temperature constraints
temperature: number; // Should be reasonable range (-50 to 60°C)
feelsLike: number; // Should be reasonable range
minTemp?: number; // Should be ≤ temperature
maxTemp?: number; // Should be ≥ temperature

// Percentage constraints
humidity: number; // Should be 0-100
uvIndex?: number; // Should be 0-11+

// Direction constraints
windDirection: number; // Should be 0-360 degrees

// Positive constraints
windSpeed: number; // Should be ≥ 0
pressure: number; // Should be > 0
visibility: number; // Should be ≥ 0
```

### Date Format Standards
```typescript
// All dates use ISO 8601 format
date: string; // "2024-01-15T14:30:00.000Z"
sunrise?: string; // "2024-01-15T07:30:00.000Z"
sunset?: string; // "2024-01-15T16:45:00.000Z"
```

## Future Enhancements

### Additional Properties
```typescript
export interface WeatherData {
  // Existing properties...
  
  // Potential additions
  airQuality?: {
    aqi: number;
    pm25: number;
    pm10: number;
    o3: number;
  };
  alerts?: Array<{
    event: string;
    description: string;
    start: string;
    end: string;
  }>;
  hourly?: WeatherData[]; // Hourly forecast
  historical?: WeatherData[]; // Historical data
}
```

### Extended Interfaces
```typescript
// More detailed weather conditions
export interface DetailedWeatherData extends WeatherData {
  precipitation: {
    rain: number;
    snow: number;
    probability: number;
  };
  clouds: {
    coverage: number;
    type: string;
  };
  astronomy: {
    moonPhase: string;
    moonrise: string;
    moonset: string;
  };
}
```